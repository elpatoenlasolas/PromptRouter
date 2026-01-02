import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => ReactNode
  mobileLabel?: string // Label to show in mobile card view
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  emptyState?: ReactNode
}

export default function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  emptyState,
}: ResponsiveTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div key={keyExtractor(item)} className="card-sm">
            {columns.map((column) => {
              const value = column.render
                ? column.render(item)
                : (item[column.key as keyof T] as ReactNode)
              
              return (
                <div key={String(column.key)} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-600">
                    {column.mobileLabel || column.header}:
                  </span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-left text-sm text-gray-600">
              {columns.map((column) => (
                <th key={String(column.key)} className="pb-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="text-sm hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={String(column.key)} className="py-3">
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
