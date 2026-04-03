# Warp Weft Studio Monetization Plan

## Positioning

Warp Weft Studio should be marketed as a textile pattern app for Canva users who build:

- fashion moodboards
- fabric pitch decks
- packaging mockups
- scrapbook and stationery surfaces
- editorial backgrounds

The strongest wedge is not "all weaving design." It is "generate polished seamless woven textures inside Canva in under a minute."

## Phase 1: Fast adoption

Goal: get usage, feedback, and Marketplace traction quickly.

- Keep the core tile generator free.
- Ship 4-8 great presets that make the output feel immediately valuable.
- Optimize the app listing around specific use cases like tartans, denim, basket weave, and luxury satin textures.
- Apply for:
  - App Adoption Awards
  - developer grants

Relevant Canva docs:

- [Monetizing apps](https://www.canva.dev/docs/apps/monetization/)
- [App Adoption Awards](https://www.canva.dev/docs/apps/app-adoption-awards/)
- [Developer grants](https://www.canva.dev/docs/apps/developer-grants/)

## Phase 2: Freemium with external payments

Goal: convert advanced users without waiting for Premium Apps approval.

Free tier ideas:

- standard-resolution tile export
- 4 presets
- up to 5 colors per direction

Paid tier ideas:

- ultra-high-resolution exports
- premium preset collections
- saved brand palettes
- AI palette extraction from reference photos
- spec sheet / report export
- commercial-use texture packs

Implementation approach:

- authenticate Canva users against your own backend
- show upgrade CTAs only on platforms that allow payment links
- open the checkout flow on your site using `requestOpenExternalUrl`

Relevant Canva docs:

- [External payment links](https://www.canva.dev/docs/apps/accepting-payments/)
- [Authenticating users](https://www.canva.dev/docs/apps/authenticating-users/)

## Phase 3: Premium Apps Program

Goal: capture native Canva monetization once the app proves retention.

Best premium candidates:

- `generate_image` for creating new woven texture tiles
- `import_image` for premium preset libraries or licensed textile packs

Recommended path:

- keep the free flow strong
- prove repeated usage with a narrow, compelling job-to-be-done
- apply to the Premium Apps Program with a clean premium surface and measured usage

Relevant Canva docs:

- [Premium Apps Program overview](https://www.canva.dev/docs/apps/premium-apps/)
- [Implementing monetization](https://www.canva.dev/docs/apps/premium-apps/implementing-monetization/)

## Revenue strategy recommendation

The most realistic sequence is:

1. free launch for distribution and feedback
2. external paid upgrade for high-value exports and premium libraries
3. Premium Apps application after usage proof

This keeps onboarding friction low while still giving you a direct path to revenue.
