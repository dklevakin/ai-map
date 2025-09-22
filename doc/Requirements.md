# Requirements — AI Compass SPA

## 1. Context and Scope
- **Product description:** a React-based single-page application that visualizes a curated catalog of AI services as an interactive mind map and accessible list.
- **System boundaries:** the site remains client-side only; Vite builds a static bundle that can be deployed to any static host (Cloudflare Pages, GitHub Pages) without a backend. A pre-built copy of the bundle (`public/assets/app.{js,css}`) ships with the repository for environments that cannot execute the Node-based build step.
- **Key stakeholders:**
  - Business owners, marketing teams, and product managers selecting AI tools.
  - Maintainers curating the catalog and localizations.
  - Accessibility advocates and mobile-first users who need alternate navigation modes.

## 2. Functional Requirements
### 2.1 Content & Data Management
1. Store localized catalog data in `public/data/{ua,en}.json`; each service must provide `name`, `href`, and `desc`.
2. Persist supplemental resources (docs, repos, community, tags) in `public/data/resources.json`, matched by slug/name/domain.
3. Cache fetched datasets in `localStorage` and warm up the inactive language in the background for faster switches.
4. Resolve recognizable service logos via domain lookups (Clearbit) with a branded fallback asset.

### 2.2 User Interface & Interactions
5. Render the AI Compass mind map in SVG with expandable categories, groups, and service nodes.
6. Display the service logo inside each node and prevent overlaps between nodes and connector paths.
7. Provide an alternate accordion/list view optimized for mobile widths (<900px) and low-vision navigation.
8. Implement language (UA/EN) and theme (dark/light) toggles; remember user preferences across sessions.
9. Surface a persistent detail panel with description, category/group context, tags, and actionable resource links opening in new tabs.
10. Support keyboard navigation: categories, groups, and services must be focusable, respond to `Enter`/`Space`, and the detail panel must expose a close control.
11. Highlight a prominent hero CTA that links directly to the catalog section, keeps a high-contrast treatment, and scales to full width on small screens.

### 2.3 Search & Filtering
12. Offer instant search across categories, groups, and service descriptions; highlight matching nodes in both map and list modes.
13. When a search is active, auto-expand matching branches in the map and list to reveal results.

### 2.4 Deployment & Tooling
14. Provide npm scripts for development (`npm run dev`), production build (`npm run build`), and preview (`npm run preview`).
15. Ensure Cloudflare Pages and GitHub Pages deployment documentation reflects the build pipeline.
16. Resolve JSON datasets, assets, and icons relative to the configured Vite `base` so the SPA works when hosted from a subdirectory (e.g., GitHub Pages project sites).
17. Keep project documentation in `/doc`, updating requirements, ADRs, and guides whenever the architecture evolves.
18. Refresh and commit the pre-built bundle in `public/assets/app.{js,css}` whenever the SPA changes so zero-build deployments render correctly.

## 3. Non-functional Requirements
| ID  | Requirement | Type |
| --- | --- | --- |
| NF-1 | The SPA must remain static-host friendly; build artifacts are plain HTML/CSS/JS with no server dependencies. | Architecture |
| NF-2 | Initial bundle size should remain lean (<400 KB gzip) and leverage code-splitting or lazy data loading if catalog growth threatens this budget. | Performance |
| NF-3 | Provide a fully responsive experience: mind map for ≥1024px, list/accordion mode for narrow screens and toggleable on demand. | Usability |
| NF-4 | Respect accessibility basics: sufficient contrast, focus outlines, keyboard operability, aria labels for controls and the details panel. | Accessibility |
| NF-5 | Use TypeScript for component contracts and utilities to improve maintainability and onboarding. | Maintainability |
| NF-6 | Document data-editing procedures so non-developers can update JSON files confidently. | Documentation |
| NF-7 | Asset URLs must degrade gracefully when deployed behind a subpath or CDN prefix, avoiding blank screens due to broken absolute references. | Reliability |
| NF-8 | If a host serves the repository without running the build (e.g., static mirroring), the committed `public/assets/app.{js,css}` bundle must keep the SPA functional. | Reliability |
| NF-9 | Preference persistence must tolerate browsers that block `localStorage`, falling back to defaults without breaking the UI. | Reliability |

## 4. Constraints and Assumptions
- The catalog remains public and unauthenticated; no personal data is collected.
- Service logos are loaded from external providers (e.g., Clearbit). If a logo fails, the UI must fall back to the local placeholder.
- Editors update JSON content via Git; no CMS is provided at this stage.

## 5. Open Questions
- Should we add analytics hooks (e.g., Plausible) in the build pipeline?
- Do we need offline support (service worker) now that the bundle exceeds a single file?
- Would an automated image cache or local logo repository be preferable to third-party logo lookups?
