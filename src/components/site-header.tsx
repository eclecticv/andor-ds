import * as React from "react";
import { Menu, X } from "lucide-react";

import { cn } from "../lib/cn";
import { Button } from "./ui/button";

export type NavLink = { label: string; href: string; external?: boolean };

export type Brand = { name: string; href: string };

/**
 * The shared header. Every And/or product uses this bar: brand on the left,
 * section links in the middle, one primary action on the right. The floating
 * rounded bar is the family signature; only the theme changes between products.
 *
 * Pass `parent` on product sites to show the "by And/or Labs" lockup.
 * Hydrate with `client:load` in Astro so the mobile menu works. In Astro, pass
 * the logo as a named slot (`<AndorMark slot="logo" />`); Astro hands it to
 * React as the `logo` prop, which keeps the island serialisable.
 */
export function SiteHeader({
  brand,
  logo,
  parent,
  nav,
  cta,
  className,
}: {
  brand: Brand;
  logo?: React.ReactNode;
  parent?: { name: string; href: string };
  nav: NavLink[];
  cta?: NavLink;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ext = (l: NavLink) => (l.external ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <header className={cn("fixed inset-x-0 top-3 z-50 px-3 lg:top-5", className)}>
      <div
        data-scrolled={scrolled || open}
        className={cn(
          "mx-auto w-full max-w-5xl rounded-2xl border border-transparent bg-background/70 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200",
          "data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/90 data-[scrolled=true]:shadow-float",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-6 pl-4 pr-2">
          <a href={brand.href} className="flex min-w-0 items-center gap-2.5" aria-label={`${brand.name} home`}>
            {logo}
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-[-0.01em]">{brand.name}</span>
              {parent && <span className="mt-1 font-label text-[10px] uppercase tracking-[0.08em] text-muted-foreground">by {parent.name}</span>}
            </span>
          </a>

          <nav aria-label="Main" className="max-lg:hidden">
            <ul className="flex items-center gap-1">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...ext(l)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            {cta && (
              <Button href={cta.href} {...ext(cta)} size="sm" className="max-sm:hidden">
                {cta.label}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {open && (
          <nav aria-label="Mobile" className="border-t px-2 pb-3 pt-2 lg:hidden">
            <ul className="grid">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...ext(l)} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-lg px-3 text-[15px] hover:bg-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            {cta && (
              <Button href={cta.href} {...ext(cta)} className="mt-2 w-full sm:hidden">
                {cta.label}
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
