import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = React.ComponentProps<"svg"> & {
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "muted" | "primary" | "rainbow";
};

const sizeMap = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export function Spinner({
  className,
  size = "sm",
  tone = "rainbow",
  ...props
}: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin",
        sizeMap[size],
        tone === "muted" && "text-muted-foreground",
        tone === "primary" &&
          "text-primary drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]",
        tone === "rainbow" &&
          "text-foreground drop-shadow-[0_18px_60px_rgba(0,0,0,0.65)]",
        className
      )}
      {...props}
    />
  );
}
