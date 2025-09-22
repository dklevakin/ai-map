# AI Tools Mind‑map (Static)

Interactive mind‑map of AI tools for SMBs. Single‑file static site (`index.html`) built with pure HTML/SVG/vanilla JS — no build step, works offline. Click any service to open a richer detail card with its description, official site, documentation, and other helpful resources.

## Quick Start (Local)

Open `index.html` in your browser, or run a local server:
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Documentation

- [User & maintainer guide](doc/index.md)
- [Requirements](doc/Requirements.md)
- [Backlog](doc/Backlog.md)
- [Architecture Decision Records](doc/adr)

## Deploy to **Cloudflare Pages**

1. Create a new Pages project and connect your GitHub repo.
2. **Build command**: _empty_ (no build step).  
3. **Output directory**: `/` (root).  
4. Deploy. Cloudflare will serve `index.html` from the root.

> Tip: If you later add a build step, update the build command/output in Pages settings.

## Deploy to **GitHub Pages** (optional)

- **Option A (root)**: Settings → Pages → Source: `main` → Root.  
- **Option B (`/docs` folder)**: Move `index.html` into `/docs`, then set Pages Source to `/docs`.

## Custom Domain / DNS

- Cloudflare Pages: attach your domain in **Pages → Custom domains** (free SSL).  
- GitHub Pages: add your domain, create `CNAME` DNS record to `username.github.io`, commit a `CNAME` file with your domain name.

## Project Structure

```
/
├─ index.html            # Production single-file app (vanilla, no deps)
├─ data/                 # Localized datasets and resource metadata
│  ├─ ua.json            # Ukrainian catalog
│  ├─ en.json            # English catalog
│  └─ resources.json     # Optional docs/repos/examples per service
├─ doc/                  # Documentation and ADRs
│  ├─ index.md           # User and maintainer guide
│  ├─ Requirements.md    # Consolidated requirements
│  ├─ Backlog.md         # Improvement backlog
│  └─ adr/               # Architecture decisions
│     ├─ 0001-static-single-file-architecture.md
│     ├─ 0002-adaptive-radial-layout.md
│     ├─ 0003-curated-bilingual-catalog.md
│     ├─ 0004-collapsible-subcategories.md
│     └─ 0005-service-detail-cards.md
├─ examples/
│  └─ react-babel/       # Alternative React+Babel+CDN version (no build)
├─ .github/workflows/
│  └─ pages.yml          # (Optional) CI to test link integrity
├─ .editorconfig
├─ .gitignore
├─ LICENSE
└─ README.md
```

## Editing Content

- Categories and items are defined in `data/ua.json` and `data/en.json`. Keep translations aligned between the two files when you add or edit services.
- Rich metadata such as documentation, getting-started guides, code samples, or community links lives in `data/resources.json`. Entries are matched by service name or slug (falling back to the official URL) and appear in the detail card when present.
- To add a tool: update the localized JSON datasets (name, href, desc) and optionally add resource links/tags in `resources.json`.
- The mind‑map layout is calculated radially; category click expands nodes; clicking a service opens the persistent detail card with links, and the official site opens from the card.

## License

MIT © 2025 Dmytro Klevakin
