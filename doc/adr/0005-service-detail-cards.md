# ADR 0005: Click-to-open Service Detail Cards

- **Status:** Accepted
- **Date:** 2025-10-10
- **Related PRs:** This change

## Context
Initial prototypes surfaced service details through hover-only tooltips. The interaction was fragile on touch devices, easy to dismiss accidentally, and offered just a single link to the official site. Research sessions with early users showed a recurring need for richer context—documentation, quick-start guides, repositories, and community links—without leaving the map. Maintainers also asked for a structured way to store that metadata independently from the main catalog.

## Decision
- Replace hover-only tooltips with click-to-open detail cards that persist until the user clicks the empty canvas, presses the × button, or uses `Esc`.
- Keep hover feedback, but use it purely as a visual cue (ellipse enlargement) so users can aim precisely without triggering content changes.
- Render the detail card inside a dedicated HTML aside next to the canvas and list multiple resource links (official site, docs, repos, examples, support) when available.
- Introduce a new metadata file, `data/resources.json`, keyed by service name/slug (with the official URL as a fallback) to store optional links and tags that enrich the card without touching the localized catalogs.
- Wire keyboard support so services behave like buttons: `Enter`/`Space` toggles the card, and `Esc` dismisses it for accessibility parity.

## Consequences
- ✅ Users get a stable reading experience with quick access to docs, code samples, and communities while staying on the map.
- ✅ Content editors can extend metadata by editing `resources.json` instead of modifying the large `index.html` payload.
- ✅ The architecture remains static-friendly—metadata is fetched once and merged client-side without extra build steps.
- ⚠️ There is now an additional JSON file to maintain; mismatched slugs or URLs will result in missing links in the card.
- ⚠️ The interaction logic is more complex, so regression testing around focus management and search rendering becomes more important.
