# Canva Portal Release Checklist

Use this file while filling out the Canva Developer Portal for the public release of `Warp Weft`.

## Before opening the portal

- Run `npm run build`
- Confirm the release bundle exists at [dist/app.js](/F:/canva_apps/warp-weft-studio/dist/app.js)
- Confirm the icon exists at [submission/assets/app-icon.png](/F:/canva_apps/warp-weft-studio/submission/assets/app-icon.png)
- Confirm the featured image exists at [submission/assets/featured-contextual.png](/F:/canva_apps/warp-weft-studio/submission/assets/featured-contextual.png)
- Confirm the policy site is live:
  - `https://parkhyokeun00.github.io/warp-weft-studio/`
  - `https://parkhyokeun00.github.io/warp-weft-studio/support.html`
  - `https://parkhyokeun00.github.io/warp-weft-studio/privacy.html`
  - `https://parkhyokeun00.github.io/warp-weft-studio/terms.html`

## Listing fields

### App name

`Warp Weft`

### Short description

`Create woven repeat patterns for your Canva designs`

### Tagline

`Build seamless textile patterns and place them in your design`

### Full description

`Warp Weft helps you create woven textures without leaving Canva. Start with tartan, denim, satin, or basket weave presets, then edit warp and weft colors, thread counts, and weave settings to shape the final look. Build a repeat sheet in one step and add it straight to your design for fashion moodboards, packaging mockups, editorial backdrops, and surface design concepts.`

## Asset uploads

- Bundle: [dist/app.js](/F:/canva_apps/warp-weft-studio/dist/app.js)
- Icon: [submission/assets/app-icon.png](/F:/canva_apps/warp-weft-studio/submission/assets/app-icon.png)
- Featured image: [submission/assets/featured-contextual.png](/F:/canva_apps/warp-weft-studio/submission/assets/featured-contextual.png)

## URLs

- Website URL: `https://parkhyokeun00.github.io/warp-weft-studio/`
- Support URL: `https://parkhyokeun00.github.io/warp-weft-studio/support.html`
- Privacy policy URL: `https://parkhyokeun00.github.io/warp-weft-studio/privacy.html`
- Terms and conditions URL: `https://parkhyokeun00.github.io/warp-weft-studio/terms.html`

## Reviewer instructions

1. Open the app inside a standard Canva design.
2. Choose any preset.
3. Adjust `Sheet repeats` with the quick buttons or number inputs.
4. Optionally change weave type, colors, or thread counts.
5. Click `Add repeat sheet to design`.
6. Confirm that a generated textile repeat image is added to the current page.

## Reviewer notes

- No external login is required.
- No reviewer test account is required.
- No third-party backend is required for the core flow.
- The app generates the repeat sheet in the browser and uploads it into Canva with `canva:asset:private:write`.

## Owner-only information still required

These details cannot be generated from code and must be completed by the app owner in the Developer Portal:

- legal name
- phone number
- physical address
- business registration details if applicable
- identity or business verification documents

## Final submission sequence

1. Upload the production bundle.
2. Upload the listing assets.
3. Paste the listing copy.
4. Paste the reviewer instructions.
5. Paste the reviewer notes.
6. Add the four public URLs.
7. Complete Developer Verification.
8. Submit for review.
9. After approval, click `Release app`.
