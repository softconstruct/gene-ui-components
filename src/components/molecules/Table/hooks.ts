import { useCallback, useMemo, useState } from "react";
import {
    ColumnPinningState,
    ExpandedState,
    PaginationState,
    RowPinningState,
    SortingState,
    VisibilityState
} from "@tanstack/react-table";

import { deepCloneWithFunctions } from "./helpers";
import { Row, SelectionMode, TableCallbacks } from "./type";

export interface UseTableStateProps<T = any> {
    initialData: Row[];
    initialPageSize?: number;
    selectionMode?: SelectionMode;
    callbacks?: TableCallbacks<T>;
}

export function useTableState<T = any>({ initialData, initialPageSize = 20, callbacks }: UseTableStateProps<T>) {
    // Core table states
    const [data, setData] = useState<T[]>(deepCloneWithFunctions(initialData) as T[]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [globalFilter, setGlobalFilter] = useState("");

    // Pinning states
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ["expand", "rowCheckbox"]
    });
    const [rowPinning, setRowPinning] = useState<RowPinningState>({
        top: [],
        bottom: []
    });

    // Pagination state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize
    });

    const [menuOpened, setMenuOpened] = useState(false);

    // Computed values
    const selectedRows = useMemo(() => {
        return Object.keys(rowSelection).filter((key) => rowSelection[key]);
    }, [rowSelection]);

    const hasSelectedRows = selectedRows.length > 0;

    // Handlers
    const handleSortingChange = useCallback(
        (updater: any) => {
            setSorting(updater);
            const newSorting = typeof updater === "function" ? updater(sorting) : updater;
            callbacks?.onSortChange?.(newSorting);
        },
        [sorting, callbacks]
    );

    const handlePaginationChange = useCallback(
        (updater: any) => {
            setPagination(updater);
            const newPagination = typeof updater === "function" ? updater(pagination) : updater;
            callbacks?.onPageChange?.(newPagination);
        },
        [pagination, callbacks]
    );

    const handleRowSelectionChange = useCallback(
        (updater: any) => {
            setRowSelection(updater);
            const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;
            const selectedRowsData = Object.keys(newSelection)
                .filter((key) => newSelection[key])
                .map((index) => data[parseInt(index, 3)])
                .filter(Boolean);
            callbacks?.onRowSelect?.(selectedRowsData);
        },
        [rowSelection, data, callbacks]
    );

    const handleGlobalFilterChange = useCallback(
        (value: string) => {
            setGlobalFilter(value);
            callbacks?.onGlobalFilterChange?.(value);
        },
        [callbacks]
    );

    return {
        data,
        sorting,
        columnVisibility,
        rowSelection,
        expanded,
        globalFilter,
        columnPinning,
        rowPinning,
        pagination,
        menuOpened,
        selectedRows,
        hasSelectedRows,
        setData,
        setSorting: handleSortingChange,
        setColumnVisibility,
        setRowSelection: handleRowSelectionChange,
        setExpanded,
        setGlobalFilter: handleGlobalFilterChange,
        setColumnPinning,
        setRowPinning,
        setPagination: handlePaginationChange,
        setMenuOpened
    };
}
