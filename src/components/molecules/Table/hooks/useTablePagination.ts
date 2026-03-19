import { useMemo } from "react";
import { Table } from "@tanstack/table-core";

// Types
import { IPaginationProps } from "@components/molecules/Pagination";

export const useTablePagination = <TData>(paginationProp: boolean | IPaginationProps, table: Table<TData>) => {
    const paginationProps = useMemo(() => {
        if (!paginationProp) return null;

        const config: Partial<IPaginationProps> = typeof paginationProp === "object" ? paginationProp : {};

        return {
            ...config,
            totalPages: config.totalPages ?? table.getPageCount(),
            current: table.getState().pagination.pageIndex + 1,
            showInputPageField: config.showInputPageField ?? false,
            rowsPerPageOptions: config.rowsPerPageOptions ?? undefined,

            onPageChange: (page: number) => {
                table.setPageIndex(page - 1);
                config.onPageChange?.(page);
            },
            onPageSizeChange: (size: number) => {
                table.setPageSize(size);
                config.onPageSizeChange?.(size);
            }
        };
    }, [
        paginationProp,
        table.getState().pagination.pageIndex,
        table.getState().pagination.pageSize,
        table.getPageCount()
    ]);

    return { paginationProps };
};
