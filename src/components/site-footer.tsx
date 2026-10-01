import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../lib/cn";
import { Label } from "./primitives";
import type { Brand, NavLink } from "./site-header";

export type FamilyMember = { name: string; href: string; description: string };

/** Every product in the And/or family. The footer lists all of them on every site. */
export const FAMILY: FamilyMember[] = [
  { name: "And/or Labs", href: "https://andorlabs.ca", description: "The lab" },
  { name: "MediaContext", href: "https://mediacontext.dev", description: "Market intelligence for the premium open web" },
];

/**
 * The shared footer. Same anatomy on every product: brand and tagline, link
 * columns, the family row (which marks where you are), a legal line, and the
 * oversized wordmark that closes the page.
 */
export function SiteFooter({
  brand,
  logo,
  tagline,
  columns,
  current,
  family = FAMILY,
  legal,
  className,
}: {
  brand: Brand;
  logo?: React.ReactNode;
  tagline?: React.ReactNode;
  columns: { title: string; links: NavLink[] }[];
  current: string;
  family?: FamilyMember[];
  legal?: React.ReactNode;
  className?: string;
}) {
  const ext = (l: { href: string; external?: boolean }) =>
    l.external ?? /^https?:/.test(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <footer className={cn("relative overflow-hidden border-t", className)}>
      <div className="container grid gap-12 pt-16 pb-10 md:grid-cols-[1.4fr_repeat(var(--cols),1fr)]" style={{ "--cols": columns.length } as React.CSSProperties}>
        <div className="max-w-xs">
          <a href={brand.href} className="inline-flex items-center gap-2.5">
            {logo}
            <span className="text-[15px] font-semibold tracking-[-0.01em]">{brand.name}</span>
          </a>
          {tagline && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tagline}</p>}
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <Label>{col.title}</Label>
            <ul className="mt-4 grid gap-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...ext(l)} className="inline-flex min-h-8 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                    {/^https?:/.test(l.href) && <ArrowUpRight className="size-3.5" aria-hidden />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container">
        <div className="flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Label>The And/or family</Label>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {family.map((m) => {
                const here = m.name === current;
                return (
                  <li key={m.name}>
                    <a
                      href={m.href}
                      aria-current={here ? "page" : undefined}
                      title={m.description}
                      className={cn("inline-flex items-center gap-1.5 text-sm transition-colors", here ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                      <i aria-hidden className={cn("size-1.5 rounded-full", here ? "bg-primary" : "bg-border")} />
                      {m.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">{legal ?? <>© {new Date().getFullYear()} And/or Labs</>}</p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] whitespace-nowrap bg-linear-to-b from-primary/25 to-primary/0 bg-clip-text text-center font-display text-[clamp(4rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-transparent">
          {brand.name}
        </p>
      </div>
    </footer>
  );
}
