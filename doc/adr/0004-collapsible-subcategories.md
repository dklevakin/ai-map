# ADR 0004: Collapsible Subcategories and Service Groups

- **Status:** Accepted
- **Date:** 2025-09-21
- **Related PRs:** #4 `codex/expand-subcategories-to-match-categories`

## Context
As the number of services grew within each category, long lists became hard to browse—items stretched beyond the viewport and users lost context. We needed to keep the map compact while allowing people to dive into specific sections.

## Decision
- Introduce a `group` → `items` structure for subgroups with their own titles.
- Store the expansion state of groups separately for each language and category via a `Map` + `Set` approach so language switching does not lose context.
- Render groups as dedicated nodes that can be opened/closed via clicks and keyboard controls.
- Recalculate category weights with the state of expanded groups to adjust the canvas height dynamically.

## Consequences
- ✅ Users get a concise overview and can expand only the sections they need.
- ✅ The data architecture supports flexible scenarios such as thematic playbooks.
- ⚠️ The category weight calculation logic is more complex; unit or smoke tests are recommended when the structure changes.
- ⚠️ All new elements must have unique group names to ensure caching works correctly.
