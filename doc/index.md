# AI Compass — User Guide

## Project Overview
AI Compass is a static website featuring an interactive map of artificial intelligence services tailored for small and medium-sized businesses. The catalog is presented as a radial diagram that visualizes the relationships between each category and service. All logic and data live in a single `index.html` file, so the solution requires no build step, works offline, and can be hosted on any static platform with ease.

## Purpose and Goals
- **Target audience:** marketing teams, operations managers, and entrepreneurs who are searching for reliable AI tools for their business workflows.
- **Primary goal:** help visitors quickly navigate the AI landscape, choose solutions for specific tasks, and jump to the official product pages.

## Key Features
- Radial map with the “AI Compass” central node and color-coded service categories.
- Toggle between Ukrainian and English content localizations.
- Expandable categories, groups, and subgroups with detailed service descriptions.
- Click-to-open detail cards that surface extended descriptions plus curated links to docs, repos, and examples.
- Visual icons next to service names for instant recognition of the service type.
- Adaptive canvas height for large catalogs plus keyboard navigation support.

## How to Use the Site
### Quick Start
1. Open `index.html` in your browser, or launch a local server with `python3 -m http.server 8000` and navigate to `http://localhost:8000`.
2. Review the banner at the top of the page—it explains the catalog’s focus.
3. Read the hero section, which briefly outlines the purpose of the mind map.

### Navigating the Map
1. The “AI Compass” node sits in the center, with branches extending into categories (marketing, automation, analytics, etc.).
2. Click a category to expand its services. Click again to collapse it.
3. When a category contains groups (for example, “Video & Clips” inside Marketing), click the group heading to reveal all services inside it.

### Service Details
- Hover over a service to gently expand the node for easier targeting.
- Click a service name to open its detail card. The card stays open until you click the canvas, open another service, or press `Esc`.
- Each card lists the description and a stack of helpful links: the official site plus optional documentation, getting-started guides, repositories, or community hubs sourced from `data/resources.json`.
- Use the links inside the card to open resources in a new tab; the map remains unchanged in the background.
- Each service is paired with an icon that represents its specialization (for example,  for DALL·E).

### Switching Languages
- Use the **UA** and **EN** buttons in the control panel to switch the content language.
- The selected language is stored in LocalStorage, so returning visitors see their last preference automatically.

### Keyboard Controls
- Categories receive focus and react to the `Enter` or `Space` keys, allowing navigation without a mouse.
- Services are also focusable: press `Enter` or `Space` to toggle the detail card, and press `Esc` to dismiss it.
- You can also close an open card by clicking an empty area of the canvas.

## Updating the Catalog
- Catalog data lives in `data/ua.json` and `data/en.json`. Each category contains a list of services with `name`, `href`, and `desc` fields, plus optional groups structured as `group` → `items`.
- Add or update a service in both language files to keep translations aligned; the rendering logic stays unchanged.
- Additional metadata (documentation, repos, examples, tags) can be stored in `data/resources.json`. Entries are matched by `href` or `slug` and automatically merged into the detail card.
- Icons are configured through the `ICONS` dictionary inside `index.html`. If a service is not listed, the fallback ✨ icon is used.

## Deployment
- **Local:** open `index.html` directly or spin up any simple HTTP server.
- **Cloudflare Pages:** create a project, leave the build command empty, and set the output directory to the root (`/`).
- **GitHub Pages:** publish from the `main` branch and point the source to the repository root. No extra settings are required because the site is static.

## Documentation on GitHub Pages
1. The `/doc` folder contains this guide and supporting files.
2. In GitHub Pages settings you can publish the documentation separately by selecting the `/doc` folder as the source.
3. To apply a GitHub Pages theme, add a `_config.yml` file with the theme name to this folder.

## Additional Resources
- [Requirements.md](./Requirements.md) — functional and non-functional requirements.
- [Backlog.md](./Backlog.md) — proposed improvements and future tasks.
- [ADR](./adr) — architecture decisions made during the project.
