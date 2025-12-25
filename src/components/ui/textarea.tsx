'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * HamarTech Textarea styles:
 * - Dark / glassy surface (matches cards + inputs)
 * - Softer rounded corners (xl)
 * - Stronger focus ring + border
 * - Nice disabled + invalid states
 */
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // layout
        'min-h-28 w-full resize-y',
        // shape + border
        'rounded-xl border border-border/70',
        // glassy background
        'bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/45',
        // spacing + typography
        'px-3 py-2.5 text-sm text-foreground leading-relaxed',
        'placeholder:text-muted-foreground/80',
        // shadow
        'shadow-[0_10px_30px_rgba(0,0,0,0.55)]',
        // transitions
        'transition-[background-color,border-color,box-shadow] duration-150',
        // hover / focus
        'hover:border-primary/45 hover:bg-background/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-0',
        'focus-visible:border-primary/55',
        // invalid
        'aria-invalid:border-destructive/70 aria-invalid:ring-2 aria-invalid:ring-destructive/25',
        // disabled
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background/30',
        // optional: keep auto-sizing if you rely on it
        'field-sizing-content',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
