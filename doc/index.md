# AI Compass — User Guide (SPA Edition)

## Project Overview
AI Compass is a React/Vite single-page application that visualizes a bilingual catalog of AI services. The experience combines a radial SVG mind map, searchable list/accordion mode, and a persistent detail panel with curated resources. The UI is themed, responsive, and accessible from keyboard and screen readers.

## Purpose and Goals
- **Target audience:** marketing teams, founders, and product managers researching AI tooling.
- **Primary goal:** help visitors discover trusted AI services, compare options by category, and jump to official resources quickly.

## Key Features
- Mind map canvas with expandable categories, groups, and logo-enhanced service nodes.
- Accessible accordion/list mode for mobile (<900px) and low-vision users (toggle available on desktop).
- Segmented UA/EN language and dark/light theme toggles with persistent preferences via `localStorage`.
- Icon-enhanced map/list view switcher that communicates layout changes at a glance.
- Search with instant highlighting across categories, groups, and service descriptions.
- Detail panel containing localized copy, tags, and curated resource links that open in new tabs.

## How to Run the App
### Local Development
```bash
npm install
npm run dev
```
Open the Vite dev server URL (default `http://localhost:5173`). Hot module replacement keeps the map responsive while editing components or data.

### Production Build
```bash
npm run build
npm run preview # optional local preview of the production bundle
```
The optimized assets are generated in `dist/` and can be hosted on any static platform. The post-build hook also refreshes
`public/assets/app.js` and `public/assets/app.css`; commit these files so that hosts which mirror the repository without
executing `npm run build` still deliver the compiled SPA.

## Navigating the Map
1. The “AI Compass” node sits at the center; categories radiate to the left and right. Each node includes a service logo for easier recognition.
2. Click a category to expand its groups/services. Use the list mode toggle for a linear view if preferred.
3. Hover or focus a service to emphasize the node. Click (or press `Enter`/`Space`) to open its detail card on the right.
4. Use the search field to filter the map; matching categories, groups, and services expand automatically in both map and list views.

## Detail Panel
- Displays the service name, category, and group context.
- Shows the localized description, tags, and curated resource links (docs, repos, communities, etc.).
- Primary “Open website” action opens the official site in a new tab.
- Close the panel via the button or keyboard (`Esc`).

## Editing the Catalog
- Update `public/data/ua.json` and `public/data/en.json` for localized categories, groups, and services. Keep translations aligned.
- Manage optional resources in `public/data/resources.json`. Entries can include localized labels for links; tags are rendered as chips in the detail panel.
- New services should include official URLs so the logo resolver can fetch recognizable branding. Missing logos automatically fall back to the branded placeholder (`public/assets/service-placeholder.svg`).
- After data changes, run `npm run dev` to preview or `npm run build` to produce deployable assets. The SPA resolves JSON and asset URLs relative to `import.meta.env.BASE_URL`, so previews also work when served from a subdirectory.

## Deployment
- **Cloudflare Pages:** configure the project with `npm run build` as the build command and `dist` as the output directory. Hosts that skip the build step can still serve the committed `public/assets/app.{js,css}` bundle, but running the build in CI is preferred. A step-by-step walkthrough with troubleshooting tips lives in [doc/deployment/cloudflare-pages.md](./deployment/cloudflare-pages.md).
- **GitHub Pages:** publish the `dist/` folder through GitHub Actions or manual deployment (e.g., `gh-pages` branch). The generated bundle already targets a relative base (`./`), so no extra rewrites are required for project subpaths.

## Accessibility & Mobile Tips
- Keyboard users can tab through categories, groups, services, and hero toggles; focus states are visible and `aria-pressed`
  states announce active selections.
- A hero quick-links strip provides icon-accented skip links to the catalog, resource panel, and footer; it becomes a
  swipeable carousel on small screens for thumb-friendly navigation.
- The list/accordion view automatically activates under 900px width and can be toggled manually with the view switcher.
- High-contrast themes (dark/light) ensure readability across environments, and the segmented controls reveal active modes for
  assistive tech and sighted users alike.

## Documentation Map
- [Requirements](./Requirements.md) — updated functional & non-functional scope.
- [Backlog](./Backlog.md) — roadmap of future improvements.
- [ADR](./adr) — architecture decisions (SPA migration captured in ADR 0001).
