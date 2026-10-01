import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,box-shadow,transform,color] duration-150 ease-out-brand active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.18)] hover:bg-primary/90",
        outline: "bg-background text-foreground shadow-[0_0_0_1px_var(--border)] hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "h-auto px-0 text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & { className?: string; asChild?: boolean } & (
  | (React.ComponentProps<"button"> & { href?: undefined })
  | (React.ComponentProps<"a"> & { href: string })
);

/**
 * Pass `href` to render a link styled as a button. Prefer this over `asChild`
 * in Astro: Astro wraps slotted children in <astro-slot>, so Slot would style
 * the wrapper instead of the link.
 */
function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const cls = cn(buttonVariants({ variant, size, className }));
  if (props.href !== undefined) return <a data-slot="button" className={cls} {...(props as React.ComponentProps<"a">)} />;
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cls} {...(props as React.ComponentProps<"button">)} />;
}

export { Button, buttonVariants };
