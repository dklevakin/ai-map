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
- Tooltips that surface extended descriptions and direct links to each service on hover.
- Real product logos next to service names for instant recognition.
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
- Hover over a service name to see a tooltip containing the description, key use cases, and an active link.
- Click the service name inside the tooltip to open the official website in a new tab.
- Each service is paired with its official logo when available; a neutral fallback badge is shown otherwise.

### Switching Languages
- Use the **UA** and **EN** buttons in the control panel to switch the content language.
- The selected language is stored in LocalStorage, so returning visitors see their last preference automatically.

### Keyboard Controls
- Categories receive focus and react to the `Enter` or `Space` keys, allowing navigation without a mouse.
- To dismiss a tooltip, click anywhere on the canvas or hover over another element.

## Updating the Catalog
- Catalog data lives in the `DATA` constant inside `index.html`. Each category contains a list of services with `name`, `href`, and `desc` fields, plus optional groups structured as `group` → `items`.
- To add a service, insert an object into the relevant language array (`ua` and `en`) and keep the translations aligned.
- Logos are resolved automatically from each service link (via [logo.clearbit.com](https://logo.clearbit.com/)).
  Use the `LOGO_OVERRIDES` map in `index.html` to point a service to a different domain or local asset, or set the optional
  `logo` field directly in the dataset. When a logo cannot be retrieved, the generic `assets/default-logo.svg` badge is used.

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
