"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center justify-center gap-1",
        "rounded-full border border-border/60 bg-background/70",
        "px-1 py-1 text-[11px] text-muted-foreground",
        "shadow-[0_10px_25px_rgba(0,0,0,0.45)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1",
        "rounded-full border border-transparent px-3 py-1",
        "text-[11px] font-medium uppercase tracking-[0.16em]",
        "text-muted-foreground/80",
        "transition-all",

        // Hover
        "hover:border-border/60 hover:bg-secondary/50 hover:text-foreground",

        // Active state
        "data-[state=active]:bg-background data-[state=active]:text-foreground",
        "data-[state=active]:border-border/80",
        "data-[state=active]:shadow-[0_10px_25px_rgba(0,0,0,0.55)]",

        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",

        // Focus
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // SVG
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",

        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 pt-2 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
