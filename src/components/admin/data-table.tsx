'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Column<T> = {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  filterable?: boolean
  filterOptions?: Array<{ label: string; value: string }>
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  searchKey?: string
  searchPlaceholder?: string
  onRowClick?: (item: T) => void
  loading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Søk...',
  onRowClick,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState('')
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const ALL_FILTER_VALUE = '__all__'

  const filteredData = React.useMemo(() => {
    let result = [...data]

    // Apply search
    if (search && searchKey) {
      const searchLower = search.toLowerCase()
      result = result.filter((item) => {
        // Handle nested keys like "user.email"
        const keys = searchKey.split('.')
        let value: any = item
        for (const key of keys) {
          value = value?.[key]
          if (value === undefined || value === null) break
        }
        return value && String(value).toLowerCase().includes(searchLower)
      })
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== ALL_FILTER_VALUE) {
        result = result.filter((item) => {
          // Handle nested keys like "user.email"
          const keys = key.split('.')
          let itemValue: any = item
          for (const k of keys) {
            itemValue = itemValue?.[k]
            if (itemValue === undefined || itemValue === null) break
          }
          return String(itemValue) === value
        })
      }
    })

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        // Handle nested keys like "user.email"
        const keys = sortKey.split('.')
        let aVal: any = a
        let bVal: any = b
        for (const key of keys) {
          aVal = aVal?.[key]
          bVal = bVal?.[key]
        }
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, search, searchKey, filters, sortKey, sortDirection])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Laster...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full min-w-0 overflow-hidden">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {searchKey && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {columns
            .filter((col) => col.filterable && col.filterOptions)
            .map((col) => (
              <Select
                key={col.key}
                value={filters[col.key] || ALL_FILTER_VALUE}
                onValueChange={(value) => {
                  if (value === ALL_FILTER_VALUE) {
                    setFilters((prev) => {
                      const next = { ...prev }
                      delete next[col.key]
                      return next
                    })
                  } else {
                    setFilters((prev) => ({ ...prev, [col.key]: value }))
                  }
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={`Filter: ${col.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER_VALUE}>Alle</SelectItem>
                  {col.filterOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            const col = columns.find((c) => c.key === key)
            const option = col?.filterOptions?.find((o) => o.value === value)
            if (!value || value === ALL_FILTER_VALUE) return null
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => clearFilter(key)}
                className="h-7 gap-1 text-xs"
              >
                {col?.label}: {option?.label || value}
                <X className="h-3 w-3" />
              </Button>
            )
          })}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-hidden">
        <div className="overflow-x-auto rounded-lg border border-border/70 bg-background/50 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60">
          <table className="w-full caption-bottom text-sm text-foreground table-auto">
            <thead className="[&_tr]:border-b [&_tr]:border-border/60">
              <tr className="border-b border-border/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="h-11 px-3 text-left align-middle whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground bg-background/40 supports-backdrop-filter:bg-background/25 supports-backdrop-filter:backdrop-blur border-border/60"
                  >
                    {col.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredData.length === 0 ? (
                <tr className="border-b border-border/50">
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center px-3 py-3 align-middle text-sm text-muted-foreground"
                  >
                    Ingen resultater funnet
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      'border-b border-border/50 transition-colors hover:bg-secondary/20',
                      onRowClick && 'cursor-pointer',
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-3 align-middle whitespace-nowrap text-sm text-foreground">
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredData.length === 0 ? (
          <div className="rounded-lg border border-border/70 bg-background/50 p-8 text-center text-muted-foreground">
            Ingen resultater funnet
          </div>
        ) : (
          filteredData.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-lg border border-border/70 bg-background/50 p-4 space-y-3',
                onRowClick && 'cursor-pointer hover:bg-secondary/10 transition-colors',
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => {
                const value = col.render ? col.render(item) : String(item[col.key] ?? '')
                // Skip actions column on mobile or show it differently
                if (col.key === 'actions') {
                  return (
                    <div key={col.key} className="pt-2 border-t border-border/50">
                      {value}
                    </div>
                  )
                }
                return (
                  <div key={col.key} className="flex flex-col gap-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.label}
                    </div>
                    <div className="text-sm">{value}</div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Viser {filteredData.length} av {data.length} resultater
      </div>
    </div>
  )
}
