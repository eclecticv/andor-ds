# @andor/ds

Every And/or Labs product is built on [Mainline](https://github.com/shadcnblocks/mainline-astro-template), unmodified. This repo holds the pinned Mainline source, one colour-and-font theme per product, and a checker that fails when a product drifts from Mainline.

## The rule

A product may change exactly three things:

1. **Colour values** of the existing tokens in `global.css` (`--primary`, `--ring`, `--background`, ...).
2. **Font values**: `@font-face` rules, the `--font-*` stacks and the font links in `BaseHead.astro`.
3. **Content** inside blocks: strings, links, image paths, data-array entries and image files in `public/`.

Everything else stays byte-for-byte Mainline: `components/ui/*`, `background.tsx`, `dashed-line.tsx`, `lib/utils.ts`, class names, markup, spacing, radius, shadows, token names and component structure. No new components. If a section has no matching Mainline block, stop and ask.

## What is here

| Path | What it is |
|---|---|
| `mainline/` | Mainline `src/components`, `lib`, `hooks`, `styles/global.css` and `components.json`, verbatim from upstream commit `f92afce` (2025-10-14) |
| `themes/andor.css` | And/or Labs values: electric blue `#1B4DFF` primary and ring, Geist for display and text, Departure Mono for mono |
| `themes/mediacontext.css` | MediaContext values: ink blue (hue 222), Outfit display, IBM Plex Sans text, JetBrains Mono |
| `fonts/` | Geist (variable) and Departure Mono, for `public/fonts/` |
| `scripts/check.mjs` | Drift checker |

## Start a product

```sh
npx degit shadcnblocks/mainline-astro-template#f92afce my-product
```

Then paste the theme's values over the matching declarations in `src/styles/global.css` (or `@import` the theme file after the Mainline tokens), copy the fonts into `public/fonts/`, and swap content. Nothing else.

## Check a product

```sh
node scripts/check.mjs ../andor-labs
```

It passes only when:

- every primitive under `components/ui`, plus `background.tsx`, `dashed-line.tsx`, `theme-toggle.tsx`, `header-link.tsx`, `lib/utils.ts` and `hooks/use-mobile.ts`, is identical to `mainline/`;
- every changed line in `styles/global.css` is a colour token value or a font declaration;
- every changed line in `components/blocks/*` and `BaseHead.astro` differs only in strings, JSX text, links or data entries. Class lists count as structure.

Page files (`src/pages/*`) are not checked; review their diff by hand.

## Upgrading Mainline

Replace `mainline/` with the new upstream commit, update the commit in this README, tag a new version, then re-apply content in each product and re-run the checker.

## Versioning

`v0.1.0` was a hand-written component library inspired by Mainline. It drifted from Mainline in radius, buttons, header, footer and layout, and is superseded by `v0.2.0`.

## Licence

Code: MIT. Mainline: MIT, by shadcnblocks.com. Departure Mono: SIL Open Font License 1.1, by Helena Zhang. Geist: SIL Open Font License 1.1, by Vercel.
