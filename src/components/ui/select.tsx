'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * HamarTech Select styles:
 * - Dark/glassy trigger (same vibe as cards)
 * - Soft borders, stronger focus ring
 * - Popover matches app overlays (bg + blur + shadow)
 * - Items: subtle hover + selected indicator
 */

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // layout
        'inline-flex w-full items-center justify-between gap-2 whitespace-nowrap',
        // shape + border
        'rounded-xl border border-border/70',
        // glassy background
        'bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/45',
        // typography
        'text-sm text-foreground',
        // sizing
        'px-3 data-[size=default]:h-10 data-[size=sm]:h-9',
        // shadow
        'shadow-[0_10px_30px_rgba(0,0,0,0.55)]',
        // hover / focus
        'transition-[background-color,border-color,box-shadow] duration-150',
        'hover:border-primary/50 hover:bg-background/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-0',
        // invalid / disabled
        'aria-invalid:border-destructive/70 aria-invalid:ring-2 aria-invalid:ring-destructive/25',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // value clamp
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        // icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-80" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'start',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        align={align}
        className={cn(
          // base
          'relative z-50 min-w-[10rem] overflow-hidden rounded-2xl',
          // glass + border
          'border border-border/60 bg-background/80 text-foreground',
          'backdrop-blur supports-[backdrop-filter]:bg-background/65',
          // shadow (match cards)
          'shadow-[0_18px_55px_rgba(0,0,0,0.75)]',
          // animation
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          // sizing + scroll
          'max-h-[min(420px,var(--radix-select-content-available-height))] overflow-y-auto overflow-x-hidden',
          // offset when popper
          position === 'popper' &&
            'data-[side=bottom]:translate-y-2 data-[side=top]:-translate-y-2 data-[side=left]:-translate-x-2 data-[side=right]:translate-x-2',
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn('p-1.5', position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]')}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground', className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2',
        'rounded-xl px-3 py-2 text-sm',
        'outline-none transition-colors',
        // hover/focus
        'focus:bg-secondary/25 focus:text-foreground',
        'data-[highlighted]:bg-secondary/25 data-[highlighted]:text-foreground',
        // disabled
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 grid h-7 w-7 place-items-center rounded-lg border border-border/60 bg-background/40"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none my-1 h-px bg-border/60', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center',
        'bg-background/60 py-2 text-muted-foreground',
        'border-b border-border/50',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center',
        'bg-background/60 py-2 text-muted-foreground',
        'border-t border-border/50',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
