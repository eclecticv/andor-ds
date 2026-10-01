# @andor/ds

The shared operating system for every And/or Labs product.

Moving from andorlabs.ca to mediacontext.dev should feel like the theme changed but the operating system stayed the same: the same header, the same footer, the same section rhythm, the same components. This package is how that stays true.

- **Structure lives here.** Token names, component anatomy, the header and footer, base element styles.
- **Brand lives in a theme.** One CSS file per product sets colours, fonts and radius. Nothing else changes between products.

Built on [shadcn/ui](https://ui.shadcn.com) conventions and Tailwind CSS v4, so shadcn blocks drop in unmodified and pick up the theme.

## Install

```sh
npm install github:eclecticv/andor-ds#v0.1.0
```

Peer dependencies: `react@^19`, `react-dom@^19`, `tailwindcss@^4`.

The package ships TypeScript source. Your bundler compiles it:

```js
// astro.config.mjs or vite.config.ts
vite: {
  ssr: { noExternal: ["@andor/ds"] },
  resolve: { dedupe: ["react", "react-dom"] },
}
```

## Use

### 1. Styles

```css
/* global.css */
@import "tailwindcss";
@import "@andor/ds/styles.css";
@import "@andor/ds/themes/andor.css";   /* or themes/mediacontext.css */
```

Import exactly one theme. `styles.css` already tells Tailwind to scan the DS components.

### 2. Header and footer

Every product renders both. Only the props differ.

```tsx
import { AndorMark, Endorsement, SiteFooter, SiteHeader } from "@andor/ds";

<SiteHeader
  brand={{ name: "MediaContext", href: "/" }}
  logo={<YourMark />}
  parent={{ name: "And/or Labs", href: "https://andorlabs.ca" }}   // product sites only
  nav={[{ label: "Product", href: "#product" }, { label: "FAQ", href: "#faq" }]}
  cta={{ label: "Request access", href: "https://cal.com/jatain/book", external: true }}
/>

<SiteFooter
  brand={{ name: "MediaContext", href: "/" }}
  logo={<YourMark />}
  tagline="Market intelligence for the premium open web."
  current="MediaContext"
  columns={[{ title: "Product", links: [...] }, { title: "Company", links: [...] }]}
/>
```

In Astro, the header is an island (`client:load`) for the mobile menu. Pass the logo as a named slot so the island stays serialisable:

```astro
<SiteHeader client:load brand={brand} nav={NAV} cta={CTA}>
  <AndorMark slot="logo" size={26} />
</SiteHeader>
```

The footer needs no hydration.

### 3. Sections

```tsx
<Panel>                                          {/* brand-wash container for hero and closing */}
  <SectionHeader label="Services" marker={1} title="..." lede="..." />
</Panel>
<Label marker={2}>Product</Label>                {/* mono eyebrow with a coloured square */}
<Button href="/start" size="lg">Start</Button>   {/* href renders a link */}
<DashedLine orientation="vertical" />
```

## Tokens

All components read these CSS variables and nothing else. Themes override the values.

| Token | Role |
|---|---|
| `--background`, `--foreground` | Page paper and ink |
| `--card`, `--popover` | Raised surfaces |
| `--primary`, `--primary-foreground` | The one action colour: buttons, links, focus |
| `--secondary`, `--muted`, `--accent` | Quiet fills, hover surfaces |
| `--muted-foreground` | Secondary text (must pass 4.5:1 on `--background`) |
| `--border`, `--input`, `--ring` | Hairlines, field borders, focus ring |
| `--tint` | Brand wash behind hero and closing panels |
| `--marker-1` … `--marker-4` | Category colours: 6px squares, chart series, icon tiles. Never body text, never large fills |
| `--font-sans` | Body and UI |
| `--font-display` | Headings |
| `--font-label` | Labels, eyebrows, numbers, metadata |
| `--radius` | Base corner radius; `sm` to `4xl` derive from it |
| `--shadow-panel`, `--shadow-float` | Card lift, floating header |
| `--ease-out`, `--duration-fast`, `--duration-base` | Motion |

Tailwind utilities map 1:1: `bg-primary`, `text-muted-foreground`, `bg-tint`, `bg-marker-2`, `font-label`, `rounded-2xl`, `shadow-panel`.

## Themes

| Theme | Fonts (sans / display / label) | Primary | Character |
|---|---|---|---|
| `andor` | Geist / Geist / Departure Mono | Electric blue `#1B4DFF` | White paper, four bright markers, slightly playful |
| `mediacontext` | IBM Plex Sans / Outfit / JetBrains Mono | Ink blue, hue 222 | Instrument panel, markers carry evidence tiers |

The `andor` theme bundles Geist (via `@fontsource-variable/geist`) and Departure Mono. Product themes name their fonts; the product loads them.

### Adding a product

1. Copy `src/styles/themes/mediacontext.css` to `src/styles/themes/<product>.css`.
2. Change values only. Never add new token names in a theme.
3. Add the export to `package.json` and the product to `FAMILY` in `site-footer.tsx`.
4. Check contrast: `--muted-foreground` and `--primary` on `--background` at 4.5:1 or better.

## Rules

- **Departure Mono is a label face.** Never use it for headings or body copy.
- **One action colour.** `--primary` is for things you can click. Markers are for categories.
- **Hit targets are 40px or more.** Button sizes are `sm` 36px (header only), `default` 40px, `lg` 44px.
- **No hardcoded colours or fonts in components.** If a component needs a new role, add a token to `styles/index.css` and give every theme a value.
- **Respect reduced motion.** The base layer already disables animation under `prefers-reduced-motion`.

## Exports

| Export | What it is |
|---|---|
| `SiteHeader`, `SiteFooter`, `FAMILY` | The shared chrome |
| `Button`, `buttonVariants` | shadcn button; `href` renders a link |
| `Accordion*` | shadcn accordion, themed |
| `Label`, `SectionHeader`, `Panel`, `DashedLine` | Section anatomy |
| `AndorMark`, `Endorsement` | Parent brand mark and "An And/or Labs product" lockup |
| `cn` | `clsx` + `tailwind-merge` |

## Versioning

Tag every release (`v0.1.0`, `v0.2.0`). Products pin a tag in `package.json` and upgrade deliberately. Breaking changes to token names or component props bump the minor version until 1.0.

## Licence

Code: MIT. Departure Mono: SIL Open Font License 1.1, by Helena Zhang. Geist: SIL Open Font License 1.1, by Vercel.
