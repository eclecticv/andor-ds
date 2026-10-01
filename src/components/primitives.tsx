import * as React from "react";

import { cn } from "../lib/cn";

export type Marker = 1 | 2 | 3 | 4;

/** Mono eyebrow with an optional coloured square. The house "label" voice. */
export function Label({ marker, className, children, ...props }: React.ComponentProps<"span"> & { marker?: Marker }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-label text-[11px] uppercase tracking-[0.08em] text-muted-foreground", className)}
      {...props}
    >
      {marker && <i aria-hidden className="size-1.5 shrink-0" style={{ background: `var(--marker-${marker})` }} />}
      {children}
    </span>
  );
}

/** Label, heading and lede for the top of a section. */
export function SectionHeader({
  label,
  marker,
  title,
  lede,
  align = "start",
  id,
  className,
}: {
  label?: React.ReactNode;
  marker?: Marker;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "start" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {label && <Label marker={marker}>{label}</Label>}
      <h2 id={id} className="mt-4 text-3xl font-semibold leading-[1.1] md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lede && <p className={cn("mt-4 text-lg leading-relaxed text-muted-foreground", align === "center" && "mx-auto")}>{lede}</p>}
    </div>
  );
}

/** Mainline's rounded brand-wash panel, re-pointed at the theme's --tint. */
export function Panel({
  variant = "top",
  className,
  children,
}: {
  variant?: "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative mx-2.5 mt-2.5 lg:mx-4",
        variant === "top" && "rounded-t-4xl rounded-b-2xl bg-linear-to-b from-tint via-background via-30% to-background",
        variant === "bottom" && "rounded-t-2xl rounded-b-4xl bg-linear-to-b from-background via-background via-40% to-tint",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Mainline's fading dashed rule. */
export function DashedLine({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  const h = orientation === "horizontal";
  return (
    <div aria-hidden className={cn("relative text-border", h ? "h-px w-full" : "h-full w-px", className)}>
      <div
        className={cn(
          h
            ? "h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]"
            : "h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)]",
        )}
      />
    </div>
  );
}

/** The And/or mark: a rounded square with the slash. Colour follows --primary unless overridden. */
export function AndorMark({ size = 24, color = "var(--primary)", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={cn("shrink-0", className)}>
      <rect width="32" height="32" rx="8" fill={color} />
      <path d="M20.75 8 L11.25 24" stroke="#fff" strokeWidth="3.25" strokeLinecap="round" />
    </svg>
  );
}

/** "An And/or Labs product" endorsement, for product headers, footers and cards. */
export function Endorsement({ href = "https://andorlabs.ca", className }: { href?: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      <AndorMark size={14} color="oklch(0.53 0.255 265)" />
      An And/or Labs product
    </a>
  );
}
