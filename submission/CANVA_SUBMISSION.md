# Canva Submission Package

This folder contains the release assets, copy, and public-hosting plan for submitting `Warp Weft` as a public Canva app.

## Recommended app identity

- App name: `Warp Weft`
- Internal product name: `Warp Weft Studio`
- Distribution: `public`

`Warp Weft` stays within Canva's published naming guidance because it is short, clear, and easy to understand in the Apps Marketplace.

## Marketplace copy

### Short description

Create woven repeat patterns for your Canva designs

### Tagline

Build seamless textile patterns and place them in your design

### Description

Warp Weft helps you create woven textures without leaving Canva. Start with tartan, denim, satin, or basket weave presets, then edit warp and weft colors, thread counts, and weave settings to shape the final look. Build a repeat sheet in one step and add it straight to your design for fashion moodboards, packaging mockups, editorial backdrops, and surface design concepts.

## Reviewer testing instructions

1. Open the app inside a standard Canva design.
2. Choose any preset.
3. Adjust `Sheet repeats` with the quick buttons or number inputs.
4. Optionally change weave type, colors, or thread counts.
5. Click `Add repeat sheet to design`.
6. Confirm that a generated textile repeat image is added to the current page.

## Reviewer notes

- No external login is required.
- No external content library is required.
- The core flow is client-side and does not rely on a third-party backend.
- The app generates a repeat sheet, uploads it to Canva with `canva:asset:private:write`, and inserts it into the current design.
- Best tested in a standard design page where image insertion is supported.

## Files to upload

- JavaScript bundle: [dist/app.js](/F:/canva_apps/warp-weft-studio/dist/app.js)
- App icon: [submission/assets/app-icon.png](/F:/canva_apps/warp-weft-studio/submission/assets/app-icon.png)
- Featured image: [submission/assets/featured-contextual.png](/F:/canva_apps/warp-weft-studio/submission/assets/featured-contextual.png)

## Support and policy pages

Prepared source files:

- Website landing page: [submission/site/index.html](/F:/canva_apps/warp-weft-studio/submission/site/index.html)
- Support page: [submission/site/support.html](/F:/canva_apps/warp-weft-studio/submission/site/support.html)
- Privacy policy: [submission/site/privacy.html](/F:/canva_apps/warp-weft-studio/submission/site/privacy.html)
- Terms and conditions: [submission/site/terms.html](/F:/canva_apps/warp-weft-studio/submission/site/terms.html)

GitHub Pages workflow:

- Workflow file: [.github/workflows/pages.yml](/F:/canva_apps/warp-weft-studio/.github/workflows/pages.yml)
- Expected site root after push to a GitHub repository named `warp-weft-studio`: `https://parkhyokeun00.github.io/warp-weft-studio/`

## Required Developer Portal URLs

Use these URLs after the GitHub Pages workflow goes live:

- Developer website URL: `https://parkhyokeun00.github.io/warp-weft-studio/`
- Support URL: `https://parkhyokeun00.github.io/warp-weft-studio/support.html`
- Privacy policy URL: `https://parkhyokeun00.github.io/warp-weft-studio/privacy.html`
- Terms and conditions URL: `https://parkhyokeun00.github.io/warp-weft-studio/terms.html`

## Remaining submission blockers

1. Push the repository so the GitHub Pages workflow can publish the support site.
2. In GitHub repo settings, confirm **Pages -> Build and deployment -> Source = GitHub Actions** if prompted.
3. Complete Canva Developer Verification details in the Developer Portal:
   - legal name
   - phone number
   - physical address
   - registration details if applicable
   - identity or business verification document
4. Submit the public listing through the Developer Portal.

## Release path

1. Run `npm run build`.
2. Confirm [dist/app.js](/F:/canva_apps/warp-weft-studio/dist/app.js) is the latest bundle.
3. Push the repository and wait for the GitHub Pages workflow to publish the support site.
4. Verify the four public URLs above in a browser.
5. Upload `dist/app.js`.
6. Upload the icon and featured image files from `submission/assets`.
7. Paste the marketplace copy from this document.
8. Add the hosted policy and support URLs.
9. Paste reviewer instructions and notes from this document.
10. Submit the app for review.
11. After approval, use `Release app` in the Developer Portal.

## Helpful companion doc

For the exact field-by-field Canva Developer Portal checklist, use [PORTAL_RELEASE_CHECKLIST.md](/F:/canva_apps/warp-weft-studio/submission/PORTAL_RELEASE_CHECKLIST.md).
