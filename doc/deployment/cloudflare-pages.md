# Cloudflare Pages Deployment Guide

This guide walks through deploying the AI Compass React SPA to [Cloudflare Pages](https://pages.cloudflare.com/).
It also lists troubleshooting steps for the common “blank page” symptom that appears when the wrong
output directory is published.

## Prerequisites

- A Cloudflare account with permission to create Pages projects.
- Access to the repository that contains the SPA source code.
- Node.js 18 (or the version configured in the repository) available in the build environment.

## 1. Create the Pages project

1. Sign in to Cloudflare and open **Pages** from the left navigation.
2. Click **Create a project** → **Connect to Git**.
3. Choose the Git provider and repository that hosts AI Compass. Select the branch you want to deploy (for example `main` or `work`).

## 2. Configure the build settings

On the “Set up builds and deployments” screen, adjust the defaults:

| Setting | Value |
| --- | --- |
| **Framework preset** | `None` (Vite is detected automatically, but the SPA uses a custom base path helper.) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | leave empty (build from the repository root) |

> **Important:** The output directory must be `dist`. Publishing the repository root will serve the development `index.html`, which references `/src/main.tsx` and results in an empty white page.

> **No-build fallback:** If corporate policy blocks outbound npm traffic, you can temporarily publish the repository root. The committed `public/assets/app.js` and `public/assets/app.css` bundles allow the SPA to run without executing `npm run build`, but you must refresh those files locally before pushing updates.

Cloudflare installs dependencies with `npm install` before executing the build command. No additional environment variables are required for the default setup.

## 3. Trigger the first deploy

1. Review the settings and click **Save and Deploy**.
2. Wait for the build to finish. Cloudflare will provide both a preview URL and a production URL once the deployment succeeds.
3. Open the preview URL. You should see the full AI Compass hero section, controls, and either the map or list view. If you only see a blank screen, continue with the troubleshooting checklist below.

## 4. Post-deploy checklist

- ✅ The deployed site contains the hero banner, theme and language toggles, and service map/list.
- ✅ Requests to `/data/ua.json`, `/data/en.json`, and `/data/resources.json` return HTTP 200.
- ✅ The browser downloads `assets/index-*.js` and `assets/index-*.css` without errors (check the Network tab).
- ✅ When using the committed fallback bundle, `/assets/app.js` and `/assets/app.css` load successfully.
- ✅ Service nodes display recognizable logos; if a logo fails, the placeholder icon appears instead of an emoji.

## Troubleshooting blank pages

| Symptom | Fix |
| --- | --- |
| **Blank page, console shows `Failed to load module script`** | Ensure the build output directory is set to `dist`. Serving the repository root leaves the development `index.html`, which points to `/src/main.tsx` (TypeScript) and cannot run in the browser. |
| **Blank page after deploy, console shows 404 for `/assets/index-*.js`** | Verify that the latest build uploaded hashed assets inside `dist/assets/`. Re-run the deployment to refresh cached assets, or clear Cloudflare cache for the project. |
| **Data not loading (`Failed to load dataset`)** | Confirm that the `/data/*.json` files exist in the deployed output. Cloudflare Pages must publish the files from `dist/data/`. |
| **Logos failing to load** | Clearbit sometimes returns 404 for lesser-known domains. The SPA falls back to `public/assets/service-placeholder.svg`, so the map remains usable. |

## Optional enhancements

- Configure a custom domain in Cloudflare Pages → **Custom domains**.
- Enable automatic deployments on pushes to your main branch. You can also trigger preview builds on pull requests.
- If you use GitHub Actions to build artifacts, upload the `dist/` directory as part of the workflow and let Pages deploy from those artifacts.

## References

- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
- [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
