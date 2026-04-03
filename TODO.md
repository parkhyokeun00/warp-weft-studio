# Warp Weft Studio TODO

## Environment

- Upgrade local Node.js to v24 before previewing in the Canva Developer Portal.
- Run `npm start` from this folder and connect the local development URL in the Canva Developer Portal.
- Paste the generated `.env` credentials from Canva into this app before enabling HMR or any backend work.

## Product

- Validate the MVP flow in Canva: preset selection, thread edits, PNG upload, and image insertion into a design.
- Port the strongest legacy features from the original web app:
  - image-to-palette extraction
  - project save/load
  - spec sheet export
  - higher-fidelity WASM rendering
- Add localized copy for Korean and English audiences.

## Monetization

- Decide the initial commercial path:
  - free app for adoption + App Adoption Awards
  - freemium app with external payments
  - Premium Apps Program application once usage signals are strong
- Add Canva user authentication so off-platform customers can unlock premium pattern packs or higher-resolution exports.
- Build an external upgrade page for paid packs, subscriptions, or studio credits.

## Distribution

- Prepare the listing assets:
  - app icon
  - featured image
  - support URL
  - privacy policy
  - help center page
- Run `canva apps doctor --report --verbose` before each submission.
- Review the submission checklist and premium design guidelines before public release.

## Technical follow-up

- Consider replacing the TypeScript preview renderer with the existing C++/WASM engine for closer parity with the legacy tool.
- Add tests for preset switching, thread editing, and export button behavior.
- Introduce a lightweight backend for saved pattern libraries, user entitlements, and analytics.
