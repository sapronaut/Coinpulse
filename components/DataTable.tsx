'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DataTable<T>({
    columns,
    data,
    rowKey,
    tableClassName,
    headerClassName,
    headerRowClassName,
    headerCellClassName,
    bodyRowClassName,
    bodyCellClassName,
}: DataTableProps<T>) {
    return (
        <Table className={tableClassName}>
            <TableHeader className={headerClassName}>
                <TableRow className={headerRowClassName}>
                    {columns.map((col, i) => (
                        <TableHead key={i} className={col.headClassName ?? headerCellClassName}>
                            {col.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={rowKey(row, index)} className={bodyRowClassName}>
                        {columns.map((col, i) => (
                            <TableCell key={i} className={col.cellClassName ?? bodyCellClassName}>
                                {col.cell(row, index)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
