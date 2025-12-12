import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 " +
    "rounded-full border px-2.5 py-1 text-[10px] font-medium " +
    "tracking-[0.14em] uppercase whitespace-nowrap " +
    "bg-background/60 backdrop-blur-sm " +
    "[&>svg]:pointer-events-none [&>svg]:size-3 " +
    "transition-colors transition-shadow " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
    "dark:aria-invalid:ring-destructive/40 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--brand-gradient)] text-background " +
          "shadow-[0_0_0_1px_rgba(15,23,42,0.5)] " +
          "[a&]:hover:brightness-110",

        secondary:
          "border-border/60 bg-secondary/70 text-secondary-foreground " +
          "[a&]:hover:bg-secondary/90",

        destructive:
          "border-transparent bg-destructive text-background " +
          "shadow-[0_0_0_1px_rgba(15,23,42,0.4)] " +
          "focus-visible:ring-destructive/40 " +
          "[a&]:hover:bg-destructive/90",

        outline:
          "border-border/70 bg-background/40 text-foreground " +
          "[a&]:hover:bg-secondary/30 [a&]:hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
