import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  rowClassName?: string;
  emptyMessage?: React.ReactNode;
}

export function CommonTable<T>({
  data,
  columns,
  className,
  rowClassName,
  emptyMessage = "No data available.",
}: Readonly<CommonTableProps<T>>) {
  return (
    <Table className={cn(className)}>
      <TableHeader className="bg-muted/50 transition-colors">
        <TableRow className="hover:bg-transparent border-border">
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className={cn("px-8 py-4 h-auto", column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-border/50">
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(
                "hover:bg-muted/50 border-border/50 group transition-colors",
                rowClassName,
              )}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn("px-8 py-4", column.className)}
                >
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                      ? (item[column.accessorKey] as React.ReactNode)
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="px-8 py-20 text-center w-full"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
