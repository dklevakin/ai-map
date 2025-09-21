# ADR 0006: Node Measurement Caching for SVG Rendering

- **Status:** Accepted
- **Date:** 2025-09-22
- **Related PRs:** #8 `codex/optimize-wraptext-for-performance`, #9 `codex/implement-node-size-caching-in-createnode`

## Context
As the map gained more categories and services, repeated renders (language switches, search queries, hover events) triggered
multiple SVG measurement calls. Each `getBBox()` and tooltip text measurement forced the browser to recalculate layout, which was
noticeable on mid-range laptops when rapidly searching or toggling languages.

## Decision
- Cache ellipse dimensions per label and text style so `createNode` reuses the stored width/height when possible.
- Reuse a single hidden `<text>` element for tooltip wrapping instead of creating and removing measurement nodes for every hover.
- Clear the caches when the language changes to ensure measurements remain accurate after translation switches.

## Consequences
- ✅ Subsequent renders during search or language toggles reuse cached measurements, cutting down layout thrash.
- ✅ Tooltip generation no longer allocates extra DOM nodes, keeping hover interactions smooth.
- ⚠️ Developers must invalidate caches whenever font styles or padding constants change, otherwise stale dimensions may persist.
- ⚠️ Caching adds bookkeeping; debugging layout shifts requires checking cache invalidation logic in addition to the rendering code.
