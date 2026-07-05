'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface Column<T> {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  title,
  columns,
  data,
  emptyMessage = 'No data',
}: DataTableProps<T>) {
  return (
    <div className="rounded-[24px] bg-muted/30 p-3">
        <div className="p-2 ">
          <p className="text-md font-semibold text-foreground">{title}</p>
        </div>
      <div className="rounded-xl bg-card">
      
        {data.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-3 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
