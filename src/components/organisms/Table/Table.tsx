import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
    ColumnFiltersState,
    ColumnPinningState,
    ColumnSizingState,
    FilterFn,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    HeaderGroup,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import classNames from "classnames";

// Components
import Divider from "@components/atoms/Divider";
import Pagination from "@components/molecules/Pagination";
import { createColumns } from "@components/organisms/Table/Columns";
import TBody from "@components/organisms/Table/TBody";
import TFoot from "@components/organisms/Table/TFoot";
import THead from "@components/organisms/Table/THead";
import Toolbar from "@components/organisms/Table/Toolbar";
import TRow from "@components/organisms/Table/TRow";
import {
    EditBuffer,
    IBulkActions,
    IEditActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
    IRowAction,
    IRowSelectionInfo,
    Row,
    TableColumns
} from "@components/organisms/Table/types";
import VirtualizedBody from "@components/organisms/Table/VirtualizedBody";

// Styles
import "./Table.scss";

// Helpers
import { getBufferKey, getCellValue, mergeBufferIntoData } from "./helpers";

interface ITableContext {
    headers: HeaderGroup<Row>[];
    columnVisibility?: VisibilityState;
    columnOrder?: string[];
    pinnedColumns?: ColumnPinningState["left"];
    onSort?: (event: SortingState) => void;
    onGlobalFilter?: (event: string) => void;
    onColumnFilter?: (event: ColumnFiltersState) => void;
    rowActions?: IRowAction[];
}

interface ITableProps {
    /**
     * Array of row objects to render in the table.
     * Each row must conform to the shared `Row` shape used across the table helpers and cells.
     */
    data: Row[];
    /**
     * An array of column definitions that configure the table's structure, data accessors, and rendering.
     * This prop extends the `ColumnDef` interface from `@tanstack/react-table`.
     * Key properties include:
     * - `id` (string): A unique identifier for the column.
     * - `header` (string | function): The content for the column header.
     * - `accessorKey` (string): The key to access data from a row object.
     * - `accessorFn` (function): A function to get a cell's value from a row object.
     * - `enableSorting` (boolean): Enables sorting for the column.
     * - `enableColumnFilter` (boolean): Enables filtering for the column.
     * - `renderer` (function): A custom function to render the cell's content.
     *
     * For more information on column properties, see the official TanStack Table documentation: https://tanstack.com/table/v8/docs/api/core/column-def
     */
    columns: TableColumns<Row>[];
    /**
     * Identifiers of columns that should be pinned to the left side of the table.
     * Maps to TanStack Table's `columnPinning.left` state.
     */
    pinnedColumns?: string[];
    /**
     * Explicit ordering of columns by column id.
     * When provided, overrides the default order derived from the column definitions.
     */
    columnOrder?: string[];
    /**
     * Visibility map for columns.
     * Useful for integrating "manage columns" experiences or external column visibility controls.
     */
    columnVisibility?: VisibilityState;
    /**
     * Information about the current row selection, including selected count and handlers.
     * Used to display and manage bulk selection UI in the toolbar.
     */
    rowSelectionInfo?: IRowSelectionInfo;
    /**
     * Configuration for the global filter input.
     * Controls placeholder, behaviour and whether the table owns filtering or delegates it.
     */
    globalFilterInfo?: IGlobalFilterInfo;
    /**
     * Row action definitions applied to every data row.
     * When provided, an actions cell is rendered per row with the configured actions.
     */
    rowActions?: IRowAction[];
    /**
     * Configuration for bulk actions that can be applied to the current selection.
     */
    bulkActions?: IBulkActions;
    /**
     * Configuration for the "manage columns" experience:
     * controls which columns can be toggled, reordered or pinned.
     */
    manageColumnsInfo?: IManageColumnsInfo;
    /**
     * Configuration for edit mode actions (primary/secondary buttons and their behaviour).
     */
    editActions?: IEditActions;
    /**
     * Optional custom content to render in the header area above the table.
     */
    headerContent?: ReactNode;
    /**
     * Text label used for the "select all" checkbox in the header.
     */
    selectAllText?: string;
    /**
     * When true, the table is rendered in "edit mode" and edit-specific UI is enabled.
     */
    editMode?: boolean;
    /**
     * Enables column resizing controls in the header.
     */
    resizable?: boolean;
    /**
     * Renders the toolbar section containing filters, bulk actions and edit controls.
     */
    withToolbar?: boolean;
    /**
     * Enables built-in client-side pagination for the table.
     * Ignored when `withVirtualScroll` is true.
     */
    withPagination?: boolean;
    /**
     * Enables virtualized rendering of the table body.
     * When true, only the visible portion of the center rows is rendered using `VirtualizedBody`.
     */
    withVirtualScroll?: boolean;
    /**
     * Callback invoked when the virtualized body scrolls near the end of the currently loaded data.
     * Intended for implementing infinite scroll / "load more" behaviours.
     */
    onLoadMore?: () => void;
    /**
     * Indicates whether there is more data that can be loaded via `onLoadMore`.
     * Used to guard the infinite scroll trigger.
     */
    hasMore?: boolean;
    /**
     * Estimated row height in pixels used by the virtualizer before actual measurements are available.
     * Defaults to `33`.
     */
    estimateSize?: number;
    /**
     * Number of extra rows to render above and below the visible window when virtual scrolling.
     * Higher values improve scroll smoothness at the cost of rendering more rows.
     */
    overscan?: number;
    /**
     * When true, the header row is rendered as sticky at the top of the scroll container.
     */
    withStickyHeader?: boolean;
    /**
     * When true, the footer row is rendered as sticky at the bottom of the scroll container.
     */
    withStickyFooter?: boolean;
    /**
     * When true, sorting is controlled externally and the table will not update its own sort state.
     */
    withManualSorting?: boolean;
    /**
     * When true, filtering is controlled externally and the table will not update its own filter state.
     */
    withManualFiltering?: boolean;
    /**
     * When true, filtering is applied from leaf rows instead of grouped rows.
     */
    withFilterFromLeafRows?: boolean;
    /**
     * Callback fired whenever column sizing changes.
     * Receives TanStack Table's `ColumnSizingState`.
     */
    onColumnSizingChange?: (columnData: ColumnSizingState) => void;
    /**
     * Callback fired when the user requests column sizing to be reset/restored.
     */
    onColumnSizingRestore?: (columnData: ColumnSizingState) => void;
    /**
     * Determines when column resize updates are applied.
     * - `"onChange"`: update sizes while dragging
     * - `"onEnd"`: update sizes only after the drag ends
     */
    columnResizeMode?: "onEnd" | "onChange";
    /**
     * Direction of column resize interactions.
     * `"ltr"` for left-to-right tables, `"rtl"` for right-to-left tables.
     */
    columnResizeDirection?: "ltr" | "rtl";
    /**
     * Callback fired whenever the table's internal sorting state changes.
     * Useful when `withManualSorting` is enabled.
     */
    onSort?: (event: SortingState) => void;
    /**
     * Callback fired whenever the global filter value changes.
     * Useful when `withManualFiltering` is enabled.
     */
    onGlobalFilter?: (event: string) => void;
    /**
     * Callback fired whenever column-level filters change.
     * Useful when `withManualFiltering` is enabled.
     */
    onColumnFilter?: (event: ColumnFiltersState) => void;
    /**
     * Default sizing configuration applied to all columns unless overridden per-column.
     */
    defaultColumnSizes?: {
        size?: number;
        minSize?: number;
        maxSize?: number;
    };
    /**
     * Available page size options for the pagination control.
     * Defaults to `[10, 20, 50, 100]`.
     */
    pageSizes?: number[];
    /**
     * Sets the default number of rows to display per page upon initial render.
     * Defaults to `10`.
     */
    initialPageSize?: number;
    /**
     * Sets the default page index on initial render.
     * Defaults to `0`.
     */
    initialPageIndex?: number;
    /**
     * A callback function that is triggered when the current page changes.
     * The new 1-based page number is passed as an argument.
     */
    onPageChange?: (pageNumber: number) => void;
    /**
     * A callback function that is triggered when the page size changes.
     * The new page size is passed as an argument.
     */
    onPageSizeChange?: (size: number) => void;
    /**
     * Displays an input field in the pagination control that allows users to manually enter a page number.
     */
    showInputPageField?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using `BEM` conventions.
     */
    className?: string;
}

export const TableContext = createContext<ITableContext>({} as ITableContext);

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets. Data tables are essential for presenting information such as reports, inventories, or user data in a clear, sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 */
const Table: FC<ITableProps> = ({
    data,
    columns,
    pinnedColumns,
    columnOrder,
    columnVisibility,
    rowSelectionInfo,
    manageColumnsInfo,
    rowActions,
    bulkActions,
    editActions,
    globalFilterInfo,
    headerContent,
    selectAllText,
    editMode,
    withPagination,
    withVirtualScroll,
    onLoadMore,
    hasMore,
    estimateSize,
    overscan,
    resizable,
    withToolbar,
    withStickyHeader,
    withStickyFooter,
    withFilterFromLeafRows,
    defaultColumnSizes,
    columnResizeMode = "onChange",
    columnResizeDirection = "ltr",
    onColumnSizingChange,
    onColumnSizingRestore,
    withManualSorting,
    withManualFiltering,
    onSort,
    onGlobalFilter,
    onColumnFilter,
    pageSizes = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    showInputPageField,
    initialPageSize = 10,
    initialPageIndex = 0,
    className
}) => {
    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);
    const cols = useMemo(() => createColumns(columns), [columns]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
    const [editBuffer, setEditBuffer] = useState<EditBuffer>(new Map());

    const handleSave = () => {
        const mergedData = mergeBufferIntoData(data, editBuffer);
        editActions?.primary?.onClick?.(mergedData);
        setEditBuffer(new Map());
    };

    const handleCancel = () => {
        setEditBuffer(new Map());
        editActions?.secondary?.onClick?.();
    };

    const table = useReactTable({
        columns: cols,
        data,
        initialState: {
            ...(withPagination &&
                !withVirtualScroll && {
                    pagination: { pageSize: initialPageSize, pageIndex: initialPageIndex }
                })
        },
        state: {
            sorting,
            globalFilter,
            columnFilters,
            columnSizing,
            columnPinning: {
                left: pinnedColumns
            },
            ...(columnOrder && { columnOrder }),
            ...(columnVisibility && { columnVisibility })
        },
        onColumnSizingChange: setColumnSizing,
        defaultColumn: defaultColumnSizes,
        meta: {
            editMode,
            updateData: (rowIndex, columnId, value) => {
                const rowId = data[rowIndex]?.id;
                if (rowId == null) return;
                setEditBuffer((prev) => new Map(prev).set(getBufferKey(rowId, columnId), value));
            },
            getCellValue: (row: Row, columnId: string) => getCellValue(row, columnId, editBuffer)
        },
        getCoreRowModel: getCoreRowModel(),
        ...(withPagination && !withVirtualScroll && { getPaginationRowModel: getPaginationRowModel() }),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode,
        columnResizeDirection,
        filterFromLeafRows: withFilterFromLeafRows,
        manualSorting: withManualSorting,
        manualFiltering: withManualFiltering,
        filterFns: {
            multiSelect: ((row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                const normalizedValue = String(cellValue);

                if (Array.isArray(filterValue) && filterValue.length > 0) {
                    return filterValue.includes(normalizedValue);
                }
                if (typeof filterValue === "string" && filterValue.trim().length > 0) {
                    return normalizedValue.toLowerCase().includes(filterValue.trim().toLowerCase());
                }
                return true;
            }) as FilterFn<Row>
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters
    });

    const memoizedTableContextValue = useMemo<ITableContext>(
        () => ({
            headers: table.getHeaderGroups(),
            columnVisibility,
            columnOrder,
            pinnedColumns: table.getState().columnPinning.left,
            rowActions
        }),
        [table, columnVisibility, columnOrder, rowActions]
    );

    useEffect(() => {
        if (!onSort) return;

        onSort(sorting);
    }, [sorting, onSort]);

    useEffect(() => {
        if (!onColumnFilter) return;

        onColumnFilter(columnFilters);
    }, [columnFilters, onColumnFilter]);

    const onGlobalFilterChange = (value: string) => {
        if (!withManualFiltering) table.setGlobalFilter(value);
        onGlobalFilter?.(value);
    };

    const handlePageChange = (pageNumber: number) => {
        table.setPageIndex(pageNumber - 1);
        onPageChange?.(pageNumber);
    };

    const handlePageSizeChange = (size: number) => {
        table.setPageSize(size);
        onPageSizeChange?.(size);
    };

    const pinnedRows = [...table.getTopRows()];
    const centerRows = [...table.getCenterRows()];

    const hasFooters = table
        .getFooterGroups()
        .some((group) => group.headers.some((header) => header.column.columnDef.footer));

    return (
        <TableContext.Provider value={memoizedTableContextValue}>
            <div className={classNames("dataTable")}>
                {withToolbar && (
                    <Toolbar
                        globalFilterInfo={globalFilterInfo}
                        rowSelectionInfo={rowSelectionInfo}
                        manageColumnsInfo={manageColumnsInfo}
                        editActions={editActions}
                        bulkActions={bulkActions}
                        headerContent={headerContent}
                        onGlobalFilterChange={onGlobalFilterChange}
                        withEditMode={editMode}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />
                )}
                <div
                    className={classNames("dataTable__content", {
                        dataTable__virtualizedContent: withVirtualScroll
                    })}
                    ref={setScrollElement}
                >
                    <table
                        className={classNames("table", className)}
                        style={{
                            width: table.getTotalSize()
                        }}
                        role="table"
                    >
                        <THead
                            columns={table.getHeaderGroups()}
                            withStickyHeader={withStickyHeader}
                            selectAllText={selectAllText}
                            resizable={resizable}
                            onColumnSizingChange={onColumnSizingChange}
                            onColumnSizingRestore={onColumnSizingRestore}
                        />
                        {pinnedRows.map((row) => (
                            <TRow key={row.id} row={row} />
                        ))}
                        {withVirtualScroll ? (
                            <VirtualizedBody
                                rows={centerRows}
                                scrollElement={scrollElement}
                                hasMore={hasMore}
                                onLoadMore={onLoadMore}
                                overscan={overscan}
                                estimateSize={estimateSize}
                            />
                        ) : (
                            <TBody rows={centerRows} />
                        )}
                        {hasFooters && <TFoot footer={table.getFooterGroups()} withStickyFooter={withStickyFooter} />}
                    </table>
                </div>
                {withPagination && !withVirtualScroll && (
                    <div className="dataTable__pagination">
                        <div className="dataTable__pagination_controls">
                            <Pagination
                                current={table.getState().pagination.pageIndex + 1}
                                totalPages={table.getPageCount()}
                                rowsPerPageOptions={pageSizes}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                showInputPageField={showInputPageField}
                            />
                        </div>
                    </div>
                )}
                <Divider />
            </div>
        </TableContext.Provider>
    );
};

export { ITableProps, Table as default };
