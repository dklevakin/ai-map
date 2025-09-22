# ADR 0007: Segmented Hero Toggles for Language, Theme, and View

- **Status:** Accepted
- **Date:** 2025-09-22
- **Related PRs:** This change

## Context
The hero controls previously rendered inline buttons directly inside `App.tsx`. Each button repeated `aria-pressed` logic,
duplicated labels, and relied on plain text without visual grouping. Usability reviews called out that the stacked buttons
felt noisy on small screens, lacked icon affordances for the view switch, and made it harder for screen reader users to
understand the available states.

## Decision
- Extract dedicated `LanguageToggle`, `ThemeToggle`, and `ViewToggle` components under `src/components/` so the `aria`
  attributes, pressed state management, and icons live in one place.
- Style the toggles as segmented controls with clear active affordances and visual separators, while adding icons to the
  theme and view switches for quicker recognition.
- Update the hero layout and copy dictionary to provide localized group labels and button announcements for each toggle.

## Consequences
- ✅ Keyboard and screen reader users now receive consistent announcements when toggles change state, and the compact layout
  reduces wrapping on small screens.
- ✅ Future updates to toggle behavior happen in a single component instead of editing `App.tsx` directly.
- ⚠️ The design system must keep the segmented-control styles aligned with the rest of the site; new themes or brand colors
  require validating contrast within the grouped buttons.
