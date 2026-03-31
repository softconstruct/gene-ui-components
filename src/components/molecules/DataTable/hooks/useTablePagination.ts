import { useEffect, useMemo } from "react";
import { Table } from "@tanstack/table-core";

// Types
import { IPaginationProps } from "@components/molecules/Pagination";

export const useTablePagination = <TData>(paginationProp: boolean | IPaginationProps, table: Table<TData>) => {
    const config: IPaginationProps = typeof paginationProp === "object" ? paginationProp : {};

    const isControlledPage =
        typeof paginationProp === "object" && paginationProp.current !== undefined && !!paginationProp.onPageChange;
    const isControlledPageSize =
        typeof paginationProp === "object" &&
        paginationProp.pageSize !== undefined &&
        !!paginationProp.onPageSizeChange;

    useEffect(() => {
        if (isControlledPage && config.current !== undefined) {
            const pageIndex = config.current - 1;
            if (table.getState().pagination.pageIndex !== pageIndex) {
                table.setPageIndex(pageIndex);
            }
        }
    }, [config.current, isControlledPage, table]);

    useEffect(() => {
        if (isControlledPageSize && config.pageSize !== undefined) {
            if (table.getState().pagination.pageSize !== config.pageSize) {
                table.setPageSize(config.pageSize);
            }
        }
    }, [config.pageSize, isControlledPageSize, table]);

    const paginationProps = useMemo(() => {
        if (!paginationProp) return null;

        const currentPageIndex = table.getState().pagination.pageIndex;
        const currentPageSize = table.getState().pagination.pageSize;
        const totalPages = config.totalPages ?? table.getPageCount();
        const totalItems = config.totalItems ?? table.getRowCount();

        return {
            ...config,
            totalPages,
            totalItems,
            current: isControlledPage ? config.current : currentPageIndex + 1,
            pageSize: isControlledPageSize ? config.pageSize : currentPageSize,
            showInputPageField: config.showInputPageField ?? false,
            rowsPerPageOptions: config.rowsPerPageOptions ?? undefined,

            onPageChange: (page: number) => {
                if (!isControlledPage) {
                    table.setPageIndex(page - 1);
                }
                config.onPageChange?.(page);
            },
            onPageSizeChange: (size: number) => {
                if (!isControlledPageSize) {
                    table.setPageSize(size);
                }
                config.onPageSizeChange?.(size);
            }
        };
    }, [
        paginationProp,
        config,
        isControlledPage,
        isControlledPageSize,
        table.getState().pagination.pageIndex,
        table.getState().pagination.pageSize,
        table.getPageCount(),
        table.getRowCount()
    ]);

    return { paginationProps };
};
