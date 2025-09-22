# ADR 0008: Hero Quick Navigation Links

- **Status:** Accepted
- **Date:** 2025-09-22
- **Related PRs:** This change

## Context
Hero content focused on toggles and the primary CTA, but visitors still needed to scroll or tab through multiple
controls to reach the catalog or the resource sidebar. Keyboard testing showed that jumping from the hero to the
resource panel required dozens of focus stops, and mobile users had no quick way to skip past the hero if they landed
midway through the page. Stakeholders asked for a lightweight, non-modal navigation aid that keeps the hero visually
balanced while surfacing anchors to the core sections of the SPA.

## Decision
- Add a `hero__quick-links` navigation strip immediately below the hero actions with an accessible
  `aria-label` (“Швидка навігація”) and icon-accented links.
- Define persistent anchor targets for the main catalog (`#catalog`), the resource sidebar (`#resources`), and the site
  footer (`#site-footer`), making each section programmatically focusable so skip links work with the keyboard.
- Style the quick links as a horizontal pill list on wide screens with hover/focus affordances, falling back to a
  scrollable carousel on narrow viewports so the icons remain legible on mobile.

## Consequences
- ✅ Keyboard and screen-reader users can jump directly to the catalog, resource panel, or footer without traversing all
  hero controls, reducing interaction cost for returning visitors.
- ✅ The anchored sections become explicit entry points for documentation, demos, and analytics, enabling deep links to be
  shared confidently.
- ⚠️ Content editors must keep section IDs stable; renaming or removing targets will break the quick links until the
  navigation array is updated.
