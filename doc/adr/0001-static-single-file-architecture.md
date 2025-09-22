# ADR 0001: React SPA Architecture

- **Status:** Accepted
- **Date:** 2025-03-05
- **Context:** migration from the single-file prototype to a maintainable SPA

## Context
The original release packaged HTML, CSS, JS, and catalog data into one `index.html` to guarantee zero build steps and extreme portability. As the catalog expanded, the monolithic script became hard to maintain: adding features (search, accessibility improvements, alternate views) required copy-pasting large DOM blocks, and non-technical editors struggled with growing inline logic. The team also needed mobile-first navigation and recognizable service branding that exceeded the limits of the legacy approach.

## Decision
Adopt a React + Vite single-page application:
- Split the UI into typed components (mind map canvas, accordion list, detail panel) stored in `src/`.
- Load localized JSON datasets from `public/data` and cache them via `localStorage`.
- Use Vite to bundle and optimize the SPA for static hosting; provide `npm run dev` / `npm run build` workflows.
- Normalize asset and dataset URLs with a helper that respects Vite's configurable `base`, so deployments under subpaths keep working.
- Render service nodes with SVG + logos, apply accessibility best practices, and introduce a responsive list mode.

## Consequences
- ✅ Modular codebase with clear separation of concerns, easier testing, and room for future features.
- ✅ Modern tooling (TypeScript, React, Vite) improves developer experience and hot reloading.
- ✅ Cloudflare Pages and GitHub Pages deployments still work after adding a lightweight build step, even when the site lives under a project subpath.
- ⚠️ Editors must run the build or rely on CI; documentation now includes instructions for the new pipeline.
- ⚠️ Logo fetching depends on external providers; fallbacks must be maintained for reliability.
