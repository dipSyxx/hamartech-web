"use client";

import * as React from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      closeButton
      icons={{
        success: <CircleCheckIcon className="h-4 w-4 text-primary" />,
        info: <InfoIcon className="h-4 w-4 text-primary" />,
        warning: <TriangleAlertIcon className="h-4 w-4 text-primary" />,
        error: <OctagonXIcon className="h-4 w-4 text-destructive" />,
        loading: <Loader2Icon className="h-4 w-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            // container
            "group/toast relative overflow-hidden",
            "w-[min(420px,calc(100vw-2rem))]",
            "rounded-2xl border border-border/70",
            "bg-background/80 backdrop-blur-md",
            "shadow-[0_18px_45px_rgba(0,0,0,0.65)]",
            "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out",
            "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/90 hover:shadow-[0_22px_60px_rgba(0,0,0,0.75)]",
          ].join(" "),
          title: "text-sm font-semibold text-foreground",
          description: "text-xs text-muted-foreground md:text-sm",
          actionButton:
            "h-8 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "h-8 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground hover:bg-secondary/80",
          closeButton: [
            "absolute right-2 top-2",
            "rounded-md border border-border/60 bg-background/70 p-1",
            "text-muted-foreground shadow-sm",
            "transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          ].join(" "),
          icon: "text-primary",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--background) / 0.85)",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border) / 0.7)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
