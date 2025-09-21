# ADR 0002: Adaptive Radial Map Layout

- **Status:** Accepted
- **Date:** 2025-09-21
- **Related PRs:** #1 `codex/refactor-mind-map-l`

## Context
The initial node placement on the map did not account for different numbers of services per category. As a result, some elements overlapped and the canvas height was fixed, failing to scale with the content. We needed adaptive positioning without relying on external graph libraries.

## Decision
- Compute category positions symmetrically around the central node, splitting them into left and right hemispheres.
- Determine category weight based on the number of items (including expanded groups) and distribute vertical space proportionally.
- Use ellipses with dynamic radii around text so long labels are not truncated.
- Generate connecting Bézier curves between the center and categories for smooth visualization of relationships.

## Consequences
- ✅ The map now scales to different catalogs without overlapping elements.
- ✅ Flexible ellipses allow longer category and service names without clipping.
- ⚠️ Client-side logic is more complex; we need regression tests when adjusting spacing constants.
- ⚠️ Further graph complexity (such as third-level nodes) will require additional layout algorithms.
