import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    CellContext,
    ColumnOrderState,
    ColumnPinningState,
    ExpandedState,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";

// Components
import { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Pagination, { IPaginationProps } from "@components/molecules/Pagination";

// Styles
import "./DataTable.scss";

import { EXPANDER_COLUMN_ID, INITIAL_PAGE_SIZE } from "./constants";
// Context
import { DataTableProvider } from "./context";
import { adaptColumns, DefaultCellComponent, withExpanderColumn } from "./helper";
// Hooks
import { useTablePagination } from "./hooks/useTablePagination";
import TableBody from "./TableBody/TableBody";
import TableHeader from "./TableHeader/TableHeader";
import Toolbar from "./Toolbar/Toolbar";
// Types
import {
    ColumnVisibilityState,
    DataTableColumn,
    DataTableGetRowStatus,
    DataTableRenderExpandedRow,
    DataTableRowExpandChangeHandler,
    IDataTableRowAction,
    ITableNoDataTexts,
    ManageColumnsConfig
} from "./types";

const defaultColumn = {
    cell: <TData, TValue>({ getValue }: CellContext<TData, TValue>) => (
        <DefaultCellComponent value={String(getValue() ?? "")} />
    )
};

interface IDataTableProps<TData> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Set a sticky header.
     */
    sticky?: boolean;
    /**
     * Defines the pagination of the Table component.
     * Whether set `true` will display the raw pagination.
     * Can accept also a config object with custom handlers and data.
     *
     * @default false
     */
    pagination?: boolean | IPaginationProps;
    /**
     * Enables TanStack manual/server-side pagination mode.
     * When `true`, DataTable will not auto-paginate row data on the client and expects
     * the current page data to be provided through the `data` prop.
     *
     * @default false
     */
    manualPagination?: boolean;
    /**
     * Data record array to be displayed in the table.
     * Each object in this array represents a single row, and its shape should match the `TData` generic.
     *
     * @default []
     *
     * @example
     * ```tsx
     * type Person = { id: number; firstName: string; status: string };
     *  const tableData: Person[] = [
     * { id: 1, firstName: "John", status: "Active" },
     * { id: 2, firstName: "Jane", status: "Pending" },
     * { id: 3, firstName: "Alice", status: "Inactive" }
     * ];
     * ```
     */
    data?: TData[] | null;
    /**
     * Configuration array for the table columns.<br/>
     * Uses TanStack Table's `ColumnDef` structure to define headers, data accessors, and custom cell rendering.
     *
     * @default []
     *
     * @example
     * ```tsx
     * [
     * {
     * accessorKey: "id",
     * header: "ID",
     * },
     * {
     * accessorKey: "firstName",
     * header: "First Name",
     * cell: (info) => <span className="custom-name-class">{info.getValue() as string}</span>
     * },
     * {
     * accessorKey: "status",
     * }
     * ];
     * ```
     */
    columns: DataTableColumn<TData>[];
    /**
     * Toggles the loading state of the table.
     */
    loading?: boolean;
    /**
     * Info text displayed under loading spinner.
     */
    loadingText?: string;
    /**
     * An object with error texts, used for various cases (no data, no result found).
     */
    noDataTexts?: ITableNoDataTexts;
    /**
     * An array of action button objects to display in the `empty` component's footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * @example
     * actions={[
     * { children: 'Cancel', appearance: 'secondary', onClick: handleCancel },
     * { children: 'Reload', appearance: 'primary', onClick: handleReload }
     * ]}
     */
    noDataAvailableActions?: IButtonProps[];
    /**
     * Returns expanded row content for a given row.
     * When provided, rows become expandable and the returned node is rendered in a dedicated expanded row panel.
     */
    renderExpandedRow?: DataTableRenderExpandedRow<TData>;
    /**
     * Callback invoked when a row is expanded or collapsed.
     * Receives a structured payload with the resulting state and the toggled row.
     *
     * @param payload - Object with `isExpanded`, `row`, and stable `rowId` fields.
     *
     * @example
     * ```tsx
     * <DataTable
     *   renderExpandedRow={(row) => <div>{row.id}</div>}
     *   onRowExpandChange={({ isExpanded, row, rowId }) => {
     *     console.log(isExpanded, row, rowId);
     *   }}
     * />
     * ```
     */
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>;
    /**
     * An array of action button objects to display in the row's action menu.
     * @example
     * rowActions={[
     * { Icon: Edit, title: 'Edit', disabled: false, onClick: (row, e) => handleEdit(row, e) },
     * { Icon: Delete, title: 'Delete', disabled: true, onClick: (row, e) => handleDelete(row, e) }
     * ]}
     */
    rowActions?: IDataTableRowAction<TData>[];
    /**
     * Resolves the visual status variant for a row from its data.
     * Use this when row styling should be derived from business fields such as `status`, `isLocked`, or similar flags,
     * without mutating or pre-mapping the incoming dataset.
     *
     * @example
     * ```tsx
     * <DataTable
     *   getRowStatus={(row) => (row.isLocked ? "red" : "default")}
     * />
     * ```
     */
    getRowStatus?: DataTableGetRowStatus<TData>;
    /**
     * Configuration object for managing columns.
     * This object allows fine-grained control over the visibility, order, and position of columns.
     */
    manageColumnsConfig?: ManageColumnsConfig;
    /**
     * Resolves a stable, unique id for a row from its data.
     * Without it rows are identified by their index, so row-bound state (e.g. expanded rows)
     * sticks to positions instead of records when data is re-sorted or paginated on the server.
     *
     * @example
     * ```tsx
     * <DataTable getRowId={(row) => String(row.id)} />
     * ```
     */
    getRowId?: (originalRow: TData, index: number) => string;
}

const EMPTY_DATA: never[] = [];
const EMPTY_MANAGE_COLUMNS_CONFIG: ManageColumnsConfig = {};

const DataTable = <TData,>({
    className,
    data = EMPTY_DATA,
    columns = [],
    pagination = false,
    loading: isTableLoading = false,
    sticky = true,
    loadingText,
    noDataTexts,
    noDataAvailableActions,
    manualPagination = false,
    renderExpandedRow,
    onRowExpandChange,
    rowActions,
    getRowStatus,
    manageColumnsConfig = EMPTY_MANAGE_COLUMNS_CONFIG,
    getRowId
}: IDataTableProps<TData>): ReactElement => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

    const isExpandable = Boolean(renderExpandedRow);

    const onRowExpandChangeRef = useRef(onRowExpandChange);
    useEffect(() => {
        onRowExpandChangeRef.current = onRowExpandChange;
    });

    const stableOnRowExpandChange = useCallback<DataTableRowExpandChangeHandler<TData>>(
        (payload) => onRowExpandChangeRef.current?.(payload),
        []
    );

    const tableColumns = useMemo(() => {
        const adapted = adaptColumns(columns);
        return isExpandable ? withExpanderColumn(adapted, stableOnRowExpandChange) : adapted;
    }, [columns, isExpandable, stableOnRowExpandChange]);

    const initialPageSize =
        typeof pagination === "object" && (pagination.pageSize || pagination.rowsPerPageOptions?.length)
            ? pagination.pageSize || pagination?.rowsPerPageOptions?.[0]
            : INITIAL_PAGE_SIZE;

    const initialColumnVisibility = useMemo<ColumnVisibilityState>(() => {
        return tableColumns.reduce<ColumnVisibilityState>((acc, column) => {
            if (!column.id) return acc;

            acc[column.id] = column.meta?.defaultVisible ?? true;
            return acc;
        }, {});
    }, [tableColumns]);

    const initialColumnPinning = useMemo<ColumnPinningState>(
        () => ({
            left: tableColumns
                .filter((column) => column.meta?.defaultPinned && column.id)
                .map((column) => column.id as string),
            right: []
        }),
        [tableColumns]
    );

    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibility);
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => ({
        left: [...(isExpandable ? [EXPANDER_COLUMN_ID] : []), ...(initialColumnPinning.left ?? [])],
        right: [...(initialColumnPinning.right ?? [])]
    }));

    const handleColumnPinningChange = useCallback(
        (updaterOrValue: ColumnPinningState | ((old: ColumnPinningState) => ColumnPinningState)) => {
            setColumnPinning((prevState) => {
                const newState = typeof updaterOrValue === "function" ? updaterOrValue(prevState) : updaterOrValue;
                const left = (newState.left ?? []).filter((id) => id !== EXPANDER_COLUMN_ID);
                return { ...newState, left: isExpandable ? [EXPANDER_COLUMN_ID, ...left] : left };
            });
        },
        [isExpandable]
    );

    useEffect(() => {
        setColumnPinning((prevState) => {
            const prevLeft = prevState.left ?? [];
            const isAlreadyConsistent = isExpandable
                ? prevLeft[0] === EXPANDER_COLUMN_ID && prevLeft.lastIndexOf(EXPANDER_COLUMN_ID) === 0
                : !prevLeft.includes(EXPANDER_COLUMN_ID);
            if (isAlreadyConsistent) return prevState;

            const left = prevLeft.filter((id) => id !== EXPANDER_COLUMN_ID);
            return { ...prevState, left: isExpandable ? [EXPANDER_COLUMN_ID, ...left] : left };
        });
    }, [isExpandable]);

    const table = useReactTable({
        data: data ?? EMPTY_DATA,
        columns: tableColumns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        manualPagination,
        ...(getRowId ? { getRowId } : {}),
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: handleColumnPinningChange,
        onColumnOrderChange: setColumnOrder,
        initialState: {
            ...(pagination && {
                pagination: { pageSize: initialPageSize }
            })
        },
        state: {
            expanded,
            columnVisibility,
            columnPinning,
            columnOrder
        }
    });

    const pageCount = table.getPageCount();
    const { pageIndex } = table.getState().pagination;
    useEffect(() => {
        if (!manualPagination && pageCount > 0 && pageIndex >= pageCount) {
            table.setPageIndex(pageCount - 1);
        }
    }, [manualPagination, pageCount, pageIndex, table]);

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = !isTableLoading && paginationProps && paginationProps.totalPages > 0;

    const isTableDataEmpty = isTableLoading || !data?.length;

    const [dirMode, setDirMode] = useState(() => (typeof document === "undefined" ? "ltr" : document.dir || "ltr"));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDirMode(document.dir || "ltr");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["dir"]
        });

        return () => observer.disconnect();
    }, []);

    const contextValue = useMemo(
        () => ({
            table,
            manageColumnsConfig,
            initialColumnVisibility,
            initialColumnPinning,
            dirMode
        }),
        [table, manageColumnsConfig, initialColumnVisibility, initialColumnPinning, dirMode]
    );

    return (
        <DataTableProvider value={contextValue}>
            <div className={classNames("dataTable", className)}>
                <Toolbar />
                <Scrollbar>
                    <table
                        className={classNames("dataTable__table", {
                            dataTable__noDataToDisplay: isTableDataEmpty
                        })}
                    >
                        <TableHeader
                            sticky={sticky}
                            headerGroups={table.getHeaderGroups()}
                            hasRowActions={Boolean(rowActions?.length)}
                        />
                        <TableBody
                            loading={isTableLoading}
                            loadingText={loadingText}
                            rows={table.getRowModel().rows}
                            noDataTexts={noDataTexts}
                            noDataAvailableActions={noDataAvailableActions}
                            rowActions={rowActions}
                            getRowStatus={getRowStatus}
                            renderExpandedRow={renderExpandedRow}
                        />
                    </table>
                </Scrollbar>
                {shouldShowPagination && (
                    <Pagination className="dataTable__pagination" {...paginationProps} disabled={isTableLoading} />
                )}
            </div>
        </DataTableProvider>
    );
};

export { IDataTableProps, DataTable as default };
