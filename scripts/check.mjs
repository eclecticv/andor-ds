#!/usr/bin/env node
// Verify a product is still Mainline: primitives byte-identical, global.css
// changed only in colour and font values, blocks changed only in content.
// Usage: node scripts/check.mjs ../andor-labs
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ds = new URL("../mainline/", import.meta.url).pathname;
const product = process.argv[2];
if (!product) {
  console.error("usage: node scripts/check.mjs <product-dir>");
  process.exit(2);
}
const src = join(product, "src");
const failures = [];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);

// Line diff: lines removed from a and lines added in b (multiset).
function sides(a, b) {
  const count = new Map();
  for (const l of a.split("\n")) count.set(l, (count.get(l) ?? 0) + 1);
  const added = [];
  for (const l of b.split("\n")) {
    const n = count.get(l) ?? 0;
    if (n > 0) count.set(l, n - 1);
    else added.push(l);
  }
  const removed = [...count].flatMap(([l, n]) => Array(n).fill(l));
  const clean = (ls) => ls.map((l) => l.trim()).filter(Boolean);
  return { removed: clean(removed), added: clean(added) };
}
const changed = (a, b) => {
  const { removed, added } = sides(a, b);
  return [...removed, ...added];
};

// 1. Primitives: byte-identical.
const primitives = [
  ...walk(join(ds, "components/ui")).map((p) => relative(ds, p)),
  "components/background.tsx",
  "components/dashed-line.tsx",
  "components/theme-toggle.tsx",
  "components/header-link.tsx",
  "lib/utils.ts",
  "hooks/use-mobile.ts",
];
for (const f of primitives) {
  const mine = read(join(src, f));
  if (mine !== null && mine !== read(join(ds, f))) failures.push(`${f}: primitive differs from Mainline`);
}

// 2. global.css: colour and font values only.
const valueLine = [
  /^--(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar)[\w-]*:\s*[^;]+;$/,
  /^--font-[\w-]+:/,
  /^@font-face \{$/, /^\}$/,
  /^font-(family|weight|style|display):[^;]+;$/,
  /^src: url\([^)]+\) format\("[\w-]+"\);$/,
  /^("[^"]+",\s*)*[\w-]+(,\s*("[^"]+"|[\w-]+))*[,;]$/,
  /^\/\*.*\*\/$/,
];
const css = read(join(src, "styles/global.css"));
if (css !== null) {
  for (const l of changed(read(join(ds, "styles/global.css")), css))
    if (!valueLine.some((r) => r.test(l))) failures.push(`styles/global.css: non-value change: ${l}`);
}

// 3. Blocks and BaseHead: content only. Strip strings and JSX text from each
// changed line; what remains must match on both sides, apart from data-array
// entries (arrays may grow or shrink) and lines that were pure text.
// Tailwind class lists are structure, not content: keep them in the skeleton.
const bareUtilities = new Set(
  "flex grid block hidden inline relative absolute fixed static sticky contents container truncate grow shrink italic underline uppercase lowercase capitalize border rounded shadow outline transition antialiased prose group peer visible invisible isolate ring blur sr-only".split(" "),
);
const classLike = (s) => {
  const t = s.trim().split(/\s+/).filter(Boolean);
  if (/^[\/#]|:\/\/|\.(svg|webp|png|jpe?g|woff2?|ttf)\b|^(font|image)\//.test(s.trim())) return false;
  return t.length > 0 && t.every((x) => /^[a-z0-9!\-:\[\]\/.%_&>()*#=,]+$/.test(x) && (/[-:\[\/]/.test(x) || bareUtilities.has(x)));
};
const skeleton = (l) =>
  /^[^<>{}=;()]*$/.test(l) && !/^\w+:\s*("|'|\d|null|\[|\{|$)/.test(l) && !/^[\]\[},]+$/.test(l)
    ? ""
    : l
        .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, (s) => (classLike(s.slice(1, -1)) ? s : '""'))
        .replace(/\b(href|src)=\{[A-Z_]+\}/g, '$1=""')
        .replace(/>[^<>{}]*</g, "><")
        .replace(/^[^<>{}]*</, "<")
        .replace(/>[^<>{}]*$/, ">");
const dataEntry = /^(\{|\},?|\[|\],?|\w+:\s*(""|\d+|null|\[|\{)?,?|"",?|\{(\s*\w+:\s*""\s*,?)+\s*\},?)$/;
for (const p of [...walk(join(ds, "components/blocks")), join(ds, "components/BaseHead.astro")]) {
  const f = relative(ds, p);
  const mine = read(join(src, f));
  if (mine === null) continue;
  const base = read(p);
  const d = sides(base, mine);
  const left = changed(d.removed.map(skeleton).join("\n"), d.added.map(skeleton).join("\n")).filter(
    (l) => l && !dataEntry.test(l),
  );
  for (const l of left) failures.push(`${f}: structural change: ${l.slice(0, 120)}`);
}

if (failures.length) {
  console.log(failures.join("\n"));
  console.log(`\n${failures.length} change(s) outside colour, font and content.`);
  process.exit(1);
}
console.log("OK: primitives identical; global.css changes are colour/font values; blocks changed in content only.");
