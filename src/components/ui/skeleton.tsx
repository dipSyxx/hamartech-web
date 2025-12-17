import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        [
          "relative overflow-hidden rounded-xl",
          "border border-border/60",
          "bg-secondary/35 dark:bg-secondary/25",
          "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "animate-pulse",
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          "before:animate-[skeleton-shimmer_1.4s_infinite]",
          "motion-reduce:before:hidden motion-reduce:animate-none",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
