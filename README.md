# AI Tools Mind‑map (Static)

Interactive mind‑map of AI tools for SMBs. Single‑file static site (`index.html`) built with pure HTML/SVG/vanilla JS — no build step, works offline.

## Quick Start (Local)

Open `index.html` in your browser, or run a local server:
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

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
├─ assets/               # Place any static assets here (optional)
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

- Categories and items are defined inside `index.html` in the `DATA` object (UA/EN).  
- To add tools: update the `DATA` arrays (name, href, desc).  
- The mind‑map layout is calculated radially; category click expands nodes; hover shows tooltip with link.

## License

MIT © 2025 Dmytro Klevakin
