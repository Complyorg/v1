# Comply.org Attestation Standard (v1)

An open standard for publishing machine-readable, expert-verified vendor
compliance profiles.

## What is this?

The Comply.org Attestation Standard defines a structured JSON format for
publicly attesting to a vendor's data-protection practices. Any platform,
auditor, law firm, or privacy engineer can produce a Comply.org attestation —
the only requirement is traceable expert identification.

**Read the full specification: [SPECIFICATION.md](./SPECIFICATION.md)**

## Quick Start

1. Create a JSON document conforming to
   [`schema/attestation.schema.json`](./schema/attestation.schema.json)
2. Optionally add expert reviews following
   [`schema/expert-review.schema.json`](./schema/expert-review.schema.json)
3. Render to HTML/Markdown using the reference templates in
   [`templates/`](./templates/) or your own tooling
4. Publish as static pages

See [`examples/`](./examples/) for complete attestation documents:
- [`full-attestation.json`](./examples/full-attestation.json) — All fields
  populated, expert-verified
- [`minimal-attestation.json`](./examples/minimal-attestation.json) —
  Minimum viable self-reported attestation

## Repository Structure

```
schema/                    JSON Schema definitions
  attestation.schema.json    Vendor attestation format
  expert-review.schema.json  Expert review format
  principles.json            The six core principles
templates/                 Reference rendering templates
  vendor-page.html           HTML template
  vendor-page.md             Markdown template
examples/                  Example attestation documents
generators/                Reference code (TypeScript)
SPECIFICATION.md           The human-readable standard (CC-BY-4.0)
CONTRIBUTING.md            How to contribute
ACKNOWLEDGMENTS.md         History and credits
LICENSE                    MIT (code) + CC-BY-4.0 (specification)
```

## Core Principles

Every attestation is assessed against six data-protection principles:

| Principle | Description |
|-----------|-------------|
| **Transparency** | Clear communication about data practices |
| **Data Minimization** | Collecting only necessary data |
| **Accountability** | Demonstrable compliance through audits and certifications |
| **Security** | Technical and organizational safeguards |
| **Quality** | Data accuracy and currency |
| **Participation** | Supporting data subject rights |

## Expert Traceability

Expert reviewers are identified by an **opaque reference code** tied to an
**issuing platform** — never by name. The issuing platform is responsible for
expert KYC and responds to legitimate verification requests. This protects
expert privacy while ensuring full accountability.

## License

- **Code and tooling**: [MIT License](./LICENSE)
- **Specification and schemas**: [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)

## Acknowledgments

This standard originates from work by **PrivacyCloud SL**, which designed the
core framework and published the original comply.org website in 2018. See
[ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md) for the full history.
