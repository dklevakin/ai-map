# ADR 0003: Curated Bilingual Catalog with Branded Visuals

- **Status:** Accepted
- **Date:** 2025-09-21
- **Related PRs:** #2 `codex/review-and-improve-services-categories`, #3 `codex/add-icons-to-ai-services`

## Context
The initial service list was short and failed to reflect key business use cases. The lack of icons and extended descriptions also made it harder to scan the map quickly and reduced its informational value. The team aimed to cover a broader range of AI solutions and make the catalog useful for both Ukrainian- and English-speaking audiences.

## Decision
- Enrich the `DATA` object with detailed service descriptions in Ukrainian and English while keeping the `ua` and `en` arrays synchronized.
- Standardize the structure of categories and groups, adding subgroups (for example, “Video & Clips” and “Content & Copywriting”).
- Add branded visuals next to each service name. The implementation now resolves real product logos automatically with a
  graceful fallback badge when a logo cannot be retrieved.
- Update page text blocks (banner, hero, notes, footer) to support bilingual display.

## Consequences
- ✅ Users receive context and usage scenarios without leaving the site.
- ✅ Bilingual support makes the product suitable for an international audience.
- ✅ Logos speed up visual scanning and help differentiate services.
- ⚠️ The larger dataset requires thorough translation review with each update.
- ⚠️ Maintaining logo quality requires curating the `LOGO_OVERRIDES` map or per-entry `logo` fields whenever automatic
  detection is insufficient.
