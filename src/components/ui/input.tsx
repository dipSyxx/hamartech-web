import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Basic field style
        "flex h-9 w-full min-w-0 rounded-full border border-border/70",
        "bg-background/60 px-3 py-1.5 text-xs md:text-sm text-foreground",
        "shadow-[0_0_0_1px_rgba(15,23,42,0.75)] backdrop-blur-sm",

        // Placeholder / selection
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",

        // File input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
        "file:px-2 file:text-xs file:font-medium file:text-foreground",

        // States
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // Focus / errors
        "outline-none transition-[background,border-color,box-shadow,color]",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/60",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",

        className
      )}
      {...props}
    />
  );
}

export { Input };
