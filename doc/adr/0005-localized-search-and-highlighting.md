# ADR 0005: Localized Search with Highlighted Matches

- **Status:** Accepted
- **Date:** 2025-09-22
- **Related PRs:** #5 `codex/add-search-input-with-debounce-handling`

## Context
The catalog grew large enough that scanning every category became slow and frustrating, especially for repeat visitors who knew
what they were looking for. Because the dataset is bilingual, we also needed a solution that respected the active language and
could surface results without reloading the page or breaking the single-file architecture.

## Decision
- Add a persistent search input above the canvas that filters categories, groups, and individual services in the selected
  language.
- Debounce search updates (~180 ms) to avoid layout jitter while typing and keep the experience smooth on lower-powered devices.
- Highlight matching nodes, automatically expand relevant branches, and show a “no results” card when nothing matches the query.
- Keep the implementation framework-free so the feature works offline and does not introduce build tooling.

## Consequences
- ✅ Users can jump straight to the tools they need without manually expanding every category.
- ✅ The UX remains accessible in both Ukrainian and English, matching the rest of the catalog experience.
- ⚠️ Search relies on the quality of manual translations; inconsistencies between `ua` and `en` entries will surface as missing
  results.
- ⚠️ Additional filtering modes (tags, sorting) will require extending the current data schema and UI controls.
