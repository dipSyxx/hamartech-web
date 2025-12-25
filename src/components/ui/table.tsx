'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * HamarTech table styles:
 * - Dark, glassy container (same vibe as Cards)
 * - Subtle borders + soft hover
 * - Sticky header option via class if needed
 * - Better spacing/typography on md+
 */

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-x-auto rounded-2xl border border-border/60 bg-background/70',
        'shadow-[0_16px_45px_rgba(0,0,0,0.65)]',
        'backdrop-blur supports-[backdrop-filter]:bg-background/55',
        // nicer scrollbars (optional, safe)
        '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60',
        '[&::-webkit-scrollbar-thumb:hover]:bg-border',
        // edge fade on overflow
        'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:opacity-0 after:transition-opacity',
        'after:bg-[linear-gradient(to_left,hsl(var(--background))_0%,transparent_100%)]',
        'data-[overflowing=true]:after:opacity-100',
        // smooth scrolling on mobile
        'scroll-smooth',
      )}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm md:text-[15px]', 'text-foreground', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        // sticky header feel (only if parent overflow scroll is used)
        '[&_tr]:border-b [&_tr]:border-border/60',
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        // last row without border
        '[&_tr:last-child]:border-0',
        className,
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t border-border/60 bg-secondary/20 font-medium text-muted-foreground',
        '[&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-border/50 transition-colors',
        'hover:bg-secondary/20',
        'data-[state=selected]:bg-secondary/30',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-11 px-3 text-left align-middle whitespace-nowrap',
        'text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground',
        'bg-background/40',
        'supports-[backdrop-filter]:bg-background/25 supports-[backdrop-filter]:backdrop-blur',
        'border-border/60',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-3 align-middle',
        'text-sm md:text-[14px]',
        'text-foreground',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        // Allow wrapping on mobile, nowrap on desktop
        'whitespace-normal md:whitespace-nowrap',
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-xs md:text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
