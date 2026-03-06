#!/usr/bin/env node
/**
 * Comply.org Attestation Validator
 *
 * Validates attestation.json files against the Comply.org schemas.
 * Outputs GitHub Actions annotations on failure.
 */
import { readFileSync } from "node:fs";
import { basename, dirname, resolve, join } from "node:path";
import { glob } from "glob";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ATTESTATION_GLOB = process.env.ATTESTATION_GLOB || "**/attestation.json";
const SCHEMA_DIR = process.env.SCHEMA_DIR || resolve("schema");

// ── Load schemas ────────────────────────────────────────────────

const attestationSchema = JSON.parse(
  readFileSync(join(SCHEMA_DIR, "attestation.schema.json"), "utf-8")
);
const expertReviewSchema = JSON.parse(
  readFileSync(join(SCHEMA_DIR, "expert-review.schema.json"), "utf-8")
);

// ── Configure ajv ───────────────────────────────────────────────

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Register expert-review schema so $ref resolution works
ajv.addSchema(expertReviewSchema, "expert-review.schema.json");
const validate = ajv.compile(attestationSchema);

// ── Find files ──────────────────────────────────────────────────

const files = await glob(ATTESTATION_GLOB, {
  ignore: ["node_modules/**", "_render/**", ".git/**"],
});

if (files.length === 0) {
  console.log("No attestation.json files found matching:", ATTESTATION_GLOB);
  process.exit(0);
}

console.log(`Validating ${files.length} attestation(s)...\n`);

let errors = 0;

function annotate(file, message) {
  // GitHub Actions annotation format
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::error file=${file}::${message}`);
  } else {
    console.error(`ERROR [${file}]: ${message}`);
  }
  errors++;
}

// ── Validate each file ─────────────────────────────────────────

for (const file of files) {
  const relPath = file;
  let data;

  // 1. JSON syntax
  try {
    data = JSON.parse(readFileSync(file, "utf-8"));
  } catch (e) {
    annotate(relPath, `Invalid JSON: ${e.message}`);
    continue;
  }

  // 2. Schema validation
  const valid = validate(data);
  if (!valid) {
    for (const err of validate.errors) {
      annotate(relPath, `Schema: ${err.instancePath || "/"} ${err.message}`);
    }
    continue;
  }

  // 3. $complyVersion check (redundant with schema const, but explicit)
  if (data.$complyVersion !== "1.0") {
    annotate(relPath, `$complyVersion must be "1.0", got "${data.$complyVersion}"`);
  }

  // 4. Slug matches parent directory
  const parentDir = basename(dirname(resolve(file)));
  if (parentDir !== "examples" && parentDir !== "." && data.slug !== parentDir) {
    annotate(
      relPath,
      `Slug "${data.slug}" does not match parent directory "${parentDir}"`
    );
  }

  // 5. transparencyScore range (redundant with schema, but defense-in-depth)
  if (
    typeof data.transparencyScore !== "number" ||
    data.transparencyScore < 0 ||
    data.transparencyScore > 100
  ) {
    annotate(relPath, `transparencyScore must be 0–100, got ${data.transparencyScore}`);
  }

  // 6. Expert review fields
  if (Array.isArray(data.expertReviews)) {
    for (let i = 0; i < data.expertReviews.length; i++) {
      const review = data.expertReviews[i];
      if (!review.expertRefCode || review.expertRefCode.trim() === "") {
        annotate(relPath, `expertReviews[${i}].expertRefCode must be non-empty`);
      }
      if (!review.issuingPlatform || review.issuingPlatform.trim() === "") {
        annotate(relPath, `expertReviews[${i}].issuingPlatform must be non-empty`);
      }
    }
  }

  // 7. URL fields validation (ajv-formats handles format:uri, but check non-null strings)
  const urlFields = [
    "website",
    "privacyPolicyUrl",
    "trustCenterUrl",
    "dpaUrl",
    "securityPageUrl",
  ];
  for (const field of urlFields) {
    const val = data[field];
    if (typeof val === "string" && val.length > 0) {
      try {
        new URL(val);
      } catch {
        annotate(relPath, `${field} is not a valid URL: "${val}"`);
      }
    }
  }

  if (errors === 0) {
    console.log(`  ✓ ${relPath} — ${data.name}`);
  }
}

// ── Summary ─────────────────────────────────────────────────────

console.log(
  `\nValidated ${files.length} file(s): ${errors === 0 ? "all passed" : `${errors} error(s)`}`
);

process.exit(errors > 0 ? 1 : 0);
