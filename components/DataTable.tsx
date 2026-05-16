import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from 'react'

// 1. Define the interface so the component knows what props to expect
interface DataTableProps<T> {
    columns: any[];
    data: T[];
    rowKey?: (item: T, index: number) => string; // Fixed name from rowKew to rowKey
    tableClassName?: string;
    headerRowClassName?: string;
    headerCellClassName?: string;
    bodyRowClassName?: string;
    bodyCellClassName?: string;
    headerClassName?: string;
}

const DataTable = <T,>({
                           columns,
                           data,
                           rowKey, // Fixed typo here
                           tableClassName,
                           headerRowClassName,
                           headerClassName,
                           bodyRowClassName,
                       }: DataTableProps<T>) => {
    return (
        <Table className={cn('custom-scrollbar', tableClassName)}>
            <TableHeader className={headerClassName}>
                <TableRow className={cn('hover:bg-transparent', headerRowClassName)}>
                    {columns.map((column, i) => (
                        <TableHead
                            key={i}
                            className={cn('bg-[#1a1c1e] text-gray-400 py-4 first:pl-5 last:pr-5')}
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow
                        // Use rowKey if provided, otherwise fallback to index
                        key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                        className={cn(
                            'overflow-hidden border-b border-gray-800 hover:bg-gray-800/30 relative',
                            bodyRowClassName
                        )}
                    >
                        {columns.map((column, columnIndex) => (
                            <TableCell key={columnIndex} className={cn('py-4 first:pl-5 last:pr-5')}>
                                {column.cell(row, rowIndex)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable;