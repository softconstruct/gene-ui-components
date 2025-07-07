import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    ColumnFiltersState,
    ColumnPinningState,
    ExpandedState,
    PaginationState,
    RowPinningState,
    SortingState,
    VisibilityState
} from "@tanstack/react-table";

import { Row } from "@components/molecules/Table/makeData";

import { deepCloneWithFunctions } from "./helpers";
import { IOrderedColumns, LoadingState, SelectionMode, TableCallbacks } from "./type";

export interface UseTableStateProps<T = any> {
    initialData: Row[];
    initialPageSize?: number;
    manageColumnsData?: IOrderedColumns[];
    selectionMode?: SelectionMode;
    callbacks?: TableCallbacks<T>;
}

export function useTableState<T = any>({
    initialData,
    manageColumnsData,
    initialPageSize = 20,
    callbacks
}: UseTableStateProps<T>) {
    // Core table states
    const [data, setData] = useState<T[]>(deepCloneWithFunctions(initialData) as T[]);
    const [currentManageColumnsData, setCurrentManageColumnsData] = useState<IOrderedColumns[] | undefined>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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

    // UI states
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");
    const [editableMode, setEditableMode] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

    // Editable data tracking
    const [editedValues, setEditedValues] = useState<Record<string, Record<string, string>>>({});

    // Computed values
    const selectedRows = useMemo(() => {
        return Object.keys(rowSelection).filter((key) => rowSelection[key]);
    }, [rowSelection]);

    const hasSelectedRows = selectedRows.length > 0;

    useEffect(() => {
        if (!manageColumnsData) return;
        setCurrentManageColumnsData(manageColumnsData);
    }, [manageColumnsData]);

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

    const handleCellEdit = useCallback(
        (
            e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
            rowIndex: number,
            columnId: string
        ) => {
            e.persist();
            const { value } = e.currentTarget;

            // Update edited values tracking
            setEditedValues((prev) => ({
                ...prev,
                [columnId]: { ...prev[columnId], [rowIndex]: value }
            }));

            // Update actual data
            const newData = [...data];
            if (newData[rowIndex] && typeof newData[rowIndex] === "object") {
                (newData[rowIndex] as any)[columnId].data = value;
            }
            setData(newData);

            callbacks?.onCellEdit?.(rowIndex, columnId, value);
        },
        [data, callbacks]
    );

    const handleSave = useCallback(() => {
        callbacks?.onSave?.(data);
        setEditableMode(false);
        setEditedValues({});
    }, [data, callbacks]);

    const handleCancel = useCallback(() => {
        setData(deepCloneWithFunctions(initialData) as T[]);
        setEditableMode(false);
        setEditedValues({});
    }, [initialData]);

    const handleEdit = useCallback(() => {
        setEditableMode(true);
    }, []);

    const clearSelection = useCallback(() => {
        setRowSelection({});
    }, []);

    const selectAll = useCallback(() => {
        const allRowSelection = data.reduce(
            (acc, _, index) => {
                acc[index] = true;
                return acc;
            },
            {} as Record<string, boolean>
        );
        setRowSelection(allRowSelection);
    }, [data]);

    return {
        data,
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        expanded,
        globalFilter,
        columnPinning,
        rowPinning,
        pagination,
        loadingState,
        editableMode,
        menuOpened,
        isBulkActionsOpen,
        editedValues,
        currentManageColumnsData,
        selectedRows,
        hasSelectedRows,
        setData,
        setSorting: handleSortingChange,
        setColumnFilters,
        setColumnVisibility,
        setRowSelection: handleRowSelectionChange,
        setExpanded,
        setGlobalFilter: handleGlobalFilterChange,
        setColumnPinning,
        setRowPinning,
        setPagination: handlePaginationChange,
        setLoadingState,
        setEditableMode,
        setMenuOpened,
        setIsBulkActionsOpen,
        setCurrentManageColumnsData,
        handleCellEdit,
        handleSave,
        handleCancel,
        handleEdit,
        clearSelection,
        selectAll
    };
}
