import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Базовий стиль для всіх кнопок
  "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    "rounded-full border border-transparent font-pixel " +
    "text-[9px] md:text-[10px] tracking-[0.16em] uppercase leading-none " +
    "transition-colors transition-transform " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0 " +
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/70 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Основна градієнтна кнопка
        default:
          "bg-[linear-gradient(90deg,#22E4FF,#5B5BFF,#F044FF)] text-background shadow-md " +
          "hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0 active:brightness-100",

        destructive:
          "bg-destructive text-background shadow-md hover:bg-destructive/90 " +
          "focus-visible:ring-destructive/40",

        outline:
          "border-border bg-background/10 text-foreground " +
          "hover:border-ring hover:bg-background/40",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "bg-transparent text-foreground/80 " +
          "hover:bg-secondary/40 hover:text-foreground",

        link:
          "border-none bg-transparent text-primary underline-offset-4 " +
          "hover:underline hover:bg-transparent px-0 h-auto",
      },
      size: {
        default: "h-8 px-4 md:h-9 md:px-5",
        sm: "h-7 px-3 text-[8px] md:text-[9px]",
        lg: "h-9 px-6 md:h-10 md:px-7",
        icon: "size-8 md:size-9 rounded-full",
        "icon-sm": "size-7 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
