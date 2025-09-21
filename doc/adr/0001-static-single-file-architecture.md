# ADR 0001: Static Single-File Architecture

- **Status:** Accepted
- **Date:** 2025-09-21
- **Context:** initial repository (`initial commit`, PR draft)

## Context
The first release of AI Compass needed a straightforward way to publish the AI service catalog without a backend and with as few files as possible. The team wanted a solution that:
- could be deployed to GitHub Pages or Cloudflare Pages without CI/CD or Node.js;
- worked offline (simply save the page);
- remained transparent for non-technical editors who can open the source and update the data manually.

## Decision
We chose a “single-file app” architecture: all HTML, CSS, JavaScript, and data are placed inside `index.html`. No third-party libraries or package managers are used. The application runs entirely on the client and renders SVG graphics for the map.

## Consequences
- ✅ The project is easy to deploy on any static hosting and can even be opened directly from the file system.
- ✅ Content updates require only editing one file without a build pipeline.
- ⚠️ Scaling the code base demands careful structuring of sections within `index.html` as the file grows in size.
- ⚠️ The lack of a build step limits the ability to use TypeScript/SCSS and modular organization without additional tooling.
