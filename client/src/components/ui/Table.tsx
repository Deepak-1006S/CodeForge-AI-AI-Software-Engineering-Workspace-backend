import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder = 'asc',
  onSort,
  emptyMessage = 'No data available',
  className,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300',
                  column.sortable && 'cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800',
                  column.width
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          'h-3 w-3 -mb-1',
                          sortBy === column.key && sortOrder === 'asc'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-3 w-3',
                          sortBy === column.key && sortOrder === 'desc'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        )}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-gray-200 dark:border-gray-700 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                >
                  {column.render
                    ? column.render(row)
                    : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
