# AI Compass — SPA Mind Map of AI Services

AI Compass is now a modular single-page application built with React and Vite. It renders an interactive mind map of curated AI services for SMBs, supports bilingual content, and includes an accessible list/accordion view for mobile and low-vision users. Each service node shows a recognizable logo and opens a detail card with descriptions and resource links.

## Quick Start

```bash
npm install
npm run dev
```

Open the local dev server URL (default `http://localhost:5173`) to explore the map with hot reloading.

To create a production build:

```bash
npm run build
```

The optimized output is written to `dist/`.

## Documentation

- [User & maintainer guide](doc/index.md)
- [Requirements](doc/Requirements.md)
- [Backlog](doc/Backlog.md)
- [Architecture Decision Records](doc/adr)

## Deploy

### Cloudflare Pages

1. Connect the repository to a Pages project.
2. **Build command:** `npm run build`
3. **Output directory:** `dist`
4. Cloudflare installs dependencies, runs the build, and serves the generated SPA.

### GitHub Pages

1. Run `npm run build` locally or in CI.
2. Publish the `dist/` folder (for example, push the contents to the `gh-pages` branch or enable GitHub Actions to deploy the build).

## Project Structure

```
/
├─ index.html                # Vite entry point
├─ package.json              # SPA scripts & dependencies
├─ public/
│  ├─ assets/                # Brand logo, favicon, service placeholder
│  └─ data/                  # Localized datasets + resource metadata
│     ├─ ua.json
│     ├─ en.json
│     └─ resources.json
├─ src/
│  ├─ App.tsx                # Layout, state management, view toggles
│  ├─ components/            # Mind map canvas, accordion, details card, logos
│  ├─ hooks/                 # Media-query helpers
│  ├─ lib/                   # Data loading, catalog utilities, copy
│  ├─ styles/                # Theme-aware CSS variables and layout styles
│  └─ main.tsx               # SPA bootstrap
├─ doc/                      # Documentation and ADRs
└─ ...
```

## Editing Content

- Catalog data lives in `public/data/ua.json` and `public/data/en.json`. Update both files when adding or editing services to keep translations aligned.
- Extended resources (docs, repos, examples, communities) live in `public/data/resources.json`. Entries are matched by service slug, name, or official domain.
- Logos are resolved automatically from the service URL via Clearbit, with a branded placeholder fallback.
- The legacy `data/` directory has been removed; update any custom scripts to read from `public/data/` instead.

## Features

- React-driven mind map with animated SVG nodes and connectors.
- Theme toggle (dark/light) and language switcher (UA/EN).
- Search filtering across categories, groups, and services.
- Accessible list/accordion mode for mobile and assistive technologies.
- Detail panel with localized copy, tags, and actionable resource links.

## License

MIT © 2025 Dmytro Klevakin
