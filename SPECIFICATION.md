# Comply.org Attestation Standard — Version 1.0

> This specification is licensed under
> [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
> Code and tooling in this repository are licensed under the
> [MIT License](./LICENSE).

> **History.** The Comply.org standard originates from work by PrivacyCloud SL,
> which designed the core framework in 2018, coinciding with the EU General Data
> Protection Regulation entering into force. See
> [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md) for the full history.

---

## 1. Purpose

The Comply.org Attestation Standard defines a structured, machine-readable
format for publishing public compliance profiles of vendors and data processors.

The standard is designed so that **any platform, auditor, law firm, privacy
engineer, or individual** can produce a Comply.org attestation for any vendor
they wish to assess — provided the attestation includes traceable expert
identification.

## 2. Design Principles

1. **Open.** The standard is freely available. Anyone may create, host, and
   distribute attestations.
2. **Transparent.** Every data point is either self-reported by the vendor or
   independently verified by a named (but privacy-protected) expert.
3. **Traceable.** Expert reviewers are identified by an opaque reference code
   tied to an issuing platform that is responsible for verifying the expert's
   identity. The expert's personal information is never published.
4. **Portable.** Attestations are JSON documents that can be rendered as HTML,
   Markdown, PDF, or consumed by APIs.
5. **Vendor-neutral.** No single platform owns the standard. Multiple platforms
   may independently produce attestations for the same vendor.

## 3. Attestation Document

An attestation is a JSON document conforming to
[`schema/attestation.schema.json`](./schema/attestation.schema.json).

### 3.1 Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `$complyVersion` | `"1.0"` | Standard version |
| `slug` | string | URL-safe vendor identifier (`^[a-z0-9][a-z0-9-]*$`) |
| `name` | string | Vendor legal or trading name |
| `category` | string | Primary vendor category |
| `certifications` | string[] | Security/privacy certifications held |
| `frameworks` | string[] | Regulatory frameworks claimed |
| `dataLocations` | string[] | Countries/regions where data is processed |
| `aiCapabilities` | string[] | AI capabilities (empty array if none) |
| `aiTechniques` | string[] | AI techniques used (empty array if none) |
| `transparencyScore` | integer 0–100 | Disclosure completeness score |
| `expertReviews` | ExpertReview[] | Expert assessments (may be empty) |

### 3.2 Optional Fields

All other fields defined in the schema are optional and may be `null` when
unknown. See [`schema/attestation.schema.json`](./schema/attestation.schema.json)
for the complete field reference.

### 3.3 Transparency Score

The transparency score reflects **how much information the vendor has
disclosed**, not the quality of that information. Platforms implementing the
standard may define their own scoring methodology, but must document it.

## 4. Expert Reviews

Expert reviews are the mechanism through which attestations move from
"Self-Reported" to "Expert-Verified" status. Each review conforms to
[`schema/expert-review.schema.json`](./schema/expert-review.schema.json).

### 4.1 Expert Traceability

Every expert review **must** include:

| Field | Purpose |
|-------|---------|
| `expertRefCode` | Opaque identifier (e.g., `EXP-2026-001`). Must **not** contain the expert's personal information. |
| `issuingPlatform` | Domain or identifier of the platform that assigned the expert (e.g., `vendor.watch`). |
| `issuingPlatformUrl` | URL where the expert's credentials can be verified through the issuing platform. |
| `expertType` | `"legal"`, `"technical"`, or `"general"`. |

The **issuing platform** is responsible for:

- Verifying the expert's identity and qualifications (KYC).
- Maintaining a mapping from `expertRefCode` to the expert's real identity.
- Responding to legitimate verification requests (e.g., from regulators or
  audited vendors).

This design protects the expert's personal data while ensuring full
traceability. The expert's name is never published in the attestation.

### 4.2 Core Principles

Each expert review assesses the vendor against six core principles:

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Transparency** | Clear communication about data collection, use, and sharing |
| 2 | **Data Minimization** | Collecting only data necessary for stated purposes |
| 3 | **Accountability** | Demonstrable compliance via certifications, audits, processes |
| 4 | **Security** | Technical and organizational measures for integrity and confidentiality |
| 5 | **Quality** | Data accuracy, completeness, and currency |
| 6 | **Participation** | Supporting data subject rights (access, rectification, deletion) |

### 4.3 Assessment Statuses

Each principle receives one of three statuses:

| Status | Meaning |
|--------|---------|
| `pending` | Not yet assessed |
| `submitted` | Evidence provided by the vendor but not independently verified |
| `verified` | Independently confirmed by the reviewing expert |

## 5. Rendering

Attestations may be rendered in any format. This repository provides reference
templates in [`templates/`](./templates/) for HTML and Markdown.

### 5.1 HTML Pages

Static HTML pages should be self-contained (inline CSS, no external
dependencies) and include:

- Schema.org `Organization` JSON-LD for SEO
- `<meta name="robots" content="index, follow">`
- A footer crediting the data source and generation date

### 5.2 Markdown

Markdown output should include YAML front matter with at minimum: `slug`,
`name`, `category`, `status`, `transparencyScore`, and `generated`.

### 5.3 Status Badge

An attestation's overall status is derived from the presence of expert reviews:

| Condition | Label |
|-----------|-------|
| At least one completed expert review | **Expert-Verified** |
| No expert reviews | **Self-Reported** |

## 6. Publishing

Attestations may be published anywhere. The recommended directory structure for
static hosting is:

```
site-root/
├── index.html              # Directory listing
├── {vendor-slug}/
│   ├── index.html          # HTML attestation page
│   └── profile.md          # Markdown version
│   └── attestation.json    # Source data
└── ...
```

Including the raw `attestation.json` alongside rendered pages allows other
platforms to consume and re-render the data.

## 7. Versioning

This is version **1.0** of the Comply.org Attestation Standard.

Future versions will follow semantic versioning (`MAJOR.MINOR`). Breaking
changes to required fields increment the major version. Additive changes
(new optional fields, new principle statuses) increment the minor version.

The `$complyVersion` field in each attestation document indicates which version
of the standard it conforms to.

## 8. Contributing

The standard is open to contributions from anyone. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
