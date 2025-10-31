import React, { createContext, FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
    ColumnFiltersState,
    ColumnPinningState,
    ExpandedState,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row as TanstackRow,
    RowPinningState,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import classNames from "classnames";

import Divider from "@components/atoms/Divider";
import { ILoaderProps } from "@components/atoms/Loader";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import { IEmptyProps } from "@components/molecules/Empty";
import Pagination from "@components/molecules/Pagination";
import { deepCloneWithFunctions } from "@components/molecules/Table/helpers";
import TBody from "@components/molecules/Table/TBody";
import TFoot from "@components/molecules/Table/TFoot";
import THead from "@components/molecules/Table/THead";
import Toolbar from "@components/molecules/Table/Toolbar";
import { BulkAction, IManageColumnsData, IOrderedColumns, Row, TableCol } from "@components/molecules/Table/type";

// Styles
import "./Table.scss";

interface ITableActions {
    /**
     * A callback function that is triggered when a row is clicked. The ID of the clicked row is passed as an argument.
     */
    onRowClick?: (data: TanstackRow<Row>) => void;
    /**
     * A callback function that is triggered when the main checkbox in the table header is toggled.
     */
    onSelectAllRows?: () => void;
    /**
     * A callback function that is triggered when the value of the global search input changes.
     */
    onGlobalFilterChange?: (filter: string) => void;
    /**
     * A callback function that is triggered when column visibility or order is updated via the "Manage Columns" menu.
     */
    onManageColumns?: (event: IManageColumnsData[]) => void;
    /**
     * A callback function that is triggered when the column configuration is restored to its default settings from the "Manage Columns" menu.
     */
    onManageColumnRestore?: () => void;
    /**
     * A callback function that is triggered whenever the sorting state of the table changes.
     */
    onSortChange?: (sorting: SortingState) => void;
    /**
     * A callback function that is triggered when the current page changes. The new page number is passed as an argument.
     */
    onPageChange?: (pageNumber: number) => void;
    /**
     * A callback function that is triggered when the page size changes. The new page size is passed as an argument.
     */
    onPageSizeChange?: (size: number) => void;
    /**
     * A callback function that is triggered whenever the row selection changes. An array of the selected row data is passed as an argument.
     */
    onRowSelect?: (selectedRow: TanstackRow<Row>) => void;
    /**
     * A callback function that is triggered when a cell value is edited in editable mode.
     */
    onCellEdit?: (rowIndex: number, columnType: string, data: unknown) => void;
    /**
     * A callback function that is triggered when the "Save" button is clicked in editable mode. The updated data is passed as an argument.
     */
    onSave?: () => void;
    /**
     * A callback function that is triggered when a row is pinned. The ID of the pinned row is passed as an argument.
     */
    onRowPinToggle?: (rowId: string) => void;
    /**
     * A callback function for the tag action button on a row. The ID of the row is passed as an argument.
     */
    onRowTag?: (rowId: string) => void;
    /**
     * A callback function for the clock action button on a row. The ID of the row is passed as an argument.
     */
    onRowClock?: (rowId: string) => void;
    /**
     * A callback function for the reload action button on a row. The ID of the row is passed as an argument.
     */
    onRowReload?: (rowId: string) => void;
    /**
     * A callback function for the copy action button on a row. The ID of the row is passed as an argument.
     */
    onRowCopy?: (rowId: string) => void;
    /**
     * A callback function for the download action button on a row. The ID of the row is passed as an argument.
     */
    onRowDownload?: (rowId: string) => void;
    /**
     * A callback function for the show action button on a row. The ID of the row is passed as an argument.
     */
    onRowShow?: (rowId: string) => void;
    /**
     * A callback function that is triggered when a row is deleted. The ID of the deleted row is passed as an argument.
     */
    onRowDelete?: (rowId: string) => void;
    onEdit?: () => void;
    onCancel?: () => void;
}

interface ITableProps extends ITableActions {
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
     * - `rowCellRenderer` (function): A custom function to render the cell's content.
     *
     * For more information on column properties, see the official TanStack Table documentation: https://tanstack.com/table/v8/docs/api/core/column-def
     */
    columns: TableCol<Row>[];

    /**
     * The array of data objects to be displayed in the table. Each object represents a single row.
     */
    externalData: Row[];

    /**
     * Enables expandable rows, allowing for additional content to be revealed below a row when clicked.
     */
    expandable?: boolean;

    /**
     * Shows a checkbox for each row.
     */
    withCheckbox?: boolean;

    /**
     * An optional CSS class name to apply to the table container for custom styling.
     */
    className?: string;

    /**
     * An object defining optional bulk actions that appear when one or more rows are selected.
     */
    bulkActions?: BulkAction;

    /**
     * Enables the global search box (text input) located above the table.
     */
    withGlobalFilter?: boolean;

    /**
     * Custom placeholder text to be displayed in the global search input.
     */
    globalFilterPlaceholder?: string;

    /**
     * A boolean that determines whether the table header should remain fixed at the top during vertical scrolling.
     */
    withStickyHeader?: boolean;

    /**
     * Text label for the select all checkbox option.
     * Displays above individual filter options to allow bulk selection.
     */
    selectAllText?: string;

    /**
     * An array of numbers used to populate the page size dropdown, allowing users to change the number of rows displayed per page.
     */
    pageSizes?: number[];

    /**
     * Sets the default number of rows to display per page upon initial render. Defaults to `10`.
     */
    initialPageSize?: number;

    /**
     * Sets the default page index on initial render. Defaults to `0`.
     */
    initialPageIndex?: number;

    /**
     * Enables pagination controls at the bottom of the table. Defaults to `true`.
     */
    withPagination?: boolean;

    /**
     * Enables virtualized scrolling for rendering a large number of rows, improving performance.
     */
    withVirtualScroll?: boolean;

    /**
     * Displays an input field in the pagination control that allows users to manually enter a page number.
     */
    showInputPageField?: boolean;

    /**
     * Enables manual pagination, where the component expects the consumer to handle pagination logic (e.g., fetching data for the current page).
     */
    withManualPagination?: boolean;

    /**
     * Enables dynamic fetching of data for infinite scrolling or virtualized lists.
     */
    withDynamicFetch?: boolean;

    /**
     * A boolean indicating if there is a next page of data to be fetched for dynamic loading.
     */
    hasNextPage?: boolean;

    /**
     * A boolean indicating if the next page of data is currently being fetched.
     */
    isFetchingNextPage?: boolean;

    /**
     * A function to be called to fetch the next page of data for dynamic loading.
     */
    fetchNextPage?: () => void;

    /**
     * A boolean that, when `true`, displays a loading indicator over the table.
     */
    loading?: boolean;

    /**
     * The size of the loading indicator.
     */
    loaderSize?: ILoaderProps["size"];

    /**
     * The text to be displayed alongside the loading indicator.
     */
    loaderText?: string;

    /**
     * Disables the "Manage Columns" menu button.
     */
    isManageColumnsDisabled?: boolean;

    /**
     * Enables the "Manage Columns" menu button and its functionality.
     */
    withManageColumns?: boolean;
    /**
     * Custom title for the "Manage Columns" button.
     */
    manageColumnsTitle?: string;
    /**
     * A React node to be rendered as additional content in the table's header toolbar.
     */
    headerContent?: ReactNode;
    editableMode?: boolean;
    keepPinnedRows?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActions?: IEmptyProps["actions"];
    emptyAppearance?: IEmptyProps["appearance"];
}

export const TableContext = createContext<ITableActions>({});

const Table: FC<ITableProps> = ({
    columns,
    externalData,
    withCheckbox,
    expandable,
    onRowClick,
    onSelectAllRows,
    onManageColumns,
    onManageColumnRestore,
    className,
    onSortChange,
    withGlobalFilter,
    globalFilterPlaceholder,
    onGlobalFilterChange,
    onSave,
    bulkActions,
    pageSizes = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    showInputPageField,
    withManualPagination,
    initialPageSize = 10,
    initialPageIndex = 0,
    withPagination = true,
    withVirtualScroll,
    selectAllText,
    withStickyHeader,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loading,
    loaderSize,
    loaderText,
    withManageColumns,
    isManageColumnsDisabled,
    manageColumnsTitle = "Manage Columns",
    headerContent,
    onRowPinToggle,
    onRowTag,
    onRowClock,
    onRowReload,
    onRowCopy,
    onRowDownload,
    onRowShow,
    onRowDelete,
    onCellEdit,
    editableMode,
    onEdit,
    onCancel,
    keepPinnedRows,
    onRowSelect,
    emptyTitle,
    emptyDescription,
    emptyActions,
    emptyAppearance
}) => {
    const scrollbarContainerRef = useRef<ScrollbarRefType>(null);
    const tableHeadRef = React.useRef<HTMLTableSectionElement>(null);
    const tableFootRef = React.useRef<HTMLTableSectionElement>(null);
    const [data, setData] = useState<Row[]>(deepCloneWithFunctions(externalData));
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ["expand", "rowCheckbox"]
    });
    const [rowPinning, setRowPinning] = useState<RowPinningState>({
        top: [],
        bottom: []
    });
    const [orderedColumns, setOrderedColumns] = useState<IOrderedColumns[]>([]);

    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

    const handleRowClick = (row: TanstackRow<Row>) => {
        if (editableMode) return;
        onRowClick?.(row);
    };

    const memoizedTableContextValue = useMemo(
        () => ({
            onRowClick: handleRowClick,
            onSelectAllRows,
            onGlobalFilterChange,
            onManageColumns,
            onManageColumnRestore,
            onSortChange,
            onPageChange,
            onPageSizeChange,
            onRowSelect,
            onCellEdit,
            onSave,
            onRowPinToggle,
            onRowTag,
            onRowClock,
            onRowReload,
            onRowCopy,
            onRowDownload,
            onRowShow,
            onRowDelete,
            onEdit,
            onCancel
        }),
        [editableMode]
    );

    useEffect(() => {
        setData(externalData);
        setRowPinning({ ...rowPinning, top: externalData.filter((item) => item.isPinned).map((item) => item.id) });
        setSelectedRows(
            Object.fromEntries(externalData.filter((item) => item.isSelected).map((row) => [[row.id], true]))
        );
    }, [externalData]);

    useEffect(() => {
        const columnIds: string[] = [];
        const columnVisibilities: { [key: string]: boolean } = {};
        orderedColumns.forEach((item) =>
            item.columns.forEach((col) => {
                if (!col.columnDef.id) {
                    return;
                }
                columnIds.push(col.columnDef.id);
                columnVisibilities[col.columnDef.id] = !!(col.columnDef as TableCol<Row>).isVisible;
                col.toggleVisibility(!!(col.columnDef as TableCol<Row>).isVisible);
                if ((col.columnDef as TableCol<Row>).isPinned) col.pin("left");
            })
        );

        setColumnOrder(columnIds);
    }, [orderedColumns]);

    const table = useReactTable<Row>({
        data,
        columns,
        initialState: {
            sorting,
            columnPinning,
            ...(withPagination &&
                !withVirtualScroll && {
                    pagination: { pageSize: initialPageSize, pageIndex: initialPageIndex }
                })
        },
        state: {
            columnOrder,
            expanded,
            rowPinning,
            sorting,
            columnPinning,
            columnVisibility,
            globalFilter,
            columnFilters,
            rowSelection: selectedRows
        },
        getRowId: (row) => row.id,
        ...(withManualPagination && { manualPagination: withManualPagination }),
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        keepPinnedRows,
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        enableRowPinning: true,
        ...(withPagination &&
            !withVirtualScroll && {
                getPaginationRowModel: getPaginationRowModel()
            }),
        getSortedRowModel: getSortedRowModel(),
        getRowCanExpand: (row) => !!row.original.expandedData,
        enableGlobalFilter: withGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: (e) => {
            setSorting(e);
            onSortChange?.(sorting);
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onExpandedChange: setExpanded,
        onRowPinningChange: setRowPinning,
        onColumnOrderChange: setColumnOrder,
        onRowSelectionChange: setSelectedRows
    });

    useEffect(() => {
        if (!table) return;
        const cols: IOrderedColumns[] = [];
        table.getHeaderGroups().forEach((headerGroup) => {
            headerGroup.headers.forEach((header) => {
                if (header.getContext().column.columns.length && header.getContext().column.columnDef.header) {
                    cols.push({
                        id: header.column.id,
                        title: (header.column.columnDef as TableCol<Row>).header || null,
                        columns: header.column.columns.sort((a, b) => {
                            return (a.columnDef as TableCol<Row>).order - (b.columnDef as TableCol<Row>).order;
                        })
                    });
                } else {
                    if (headerGroup.depth > 0) return;

                    if (!cols.length) {
                        cols.push({
                            id: headerGroup.id,
                            title: null,
                            columns: headerGroup.headers
                                .map((item) => item.column)
                                .sort((a, b) => {
                                    return (a.columnDef as TableCol<Row>).order - (b.columnDef as TableCol<Row>).order;
                                })
                        });
                    }
                }
            });
        });
        setOrderedColumns(cols);
    }, [columns]);

    const handlePageChange = (pageNumber: number) => {
        table.setPageIndex(pageNumber - 1);
        onPageChange?.(pageNumber);
    };

    const handlePageSizeChange = (size: number) => {
        table.setPageSize(size);
        onPageSizeChange?.(size);
    };

    const onGlobalFilterInputChange = (value: string) => {
        setGlobalFilter(value);
    };

    if (!columns.length) return null;

    const rowCount = table.getRowModel().rows.length;
    const columnCount = table.getVisibleFlatColumns().length;
    const selectedRowCount = table.getSelectedRowModel().rows.length;

    return (
        <TableContext.Provider value={memoizedTableContextValue}>
            <div className={classNames("dataTable")}>
                <Toolbar
                    isGrouped={table.getHeaderGroups().length > 1}
                    orderedColumns={orderedColumns}
                    manageColumnsTitle={manageColumnsTitle}
                    withManageColumns={withManageColumns}
                    isManageColumnsDisabled={isManageColumnsDisabled}
                    withCheckbox={withCheckbox}
                    editableMode={editableMode}
                    headerContent={headerContent}
                    withGlobalFilter={withGlobalFilter}
                    globalFilter={globalFilter}
                    globalFilterPlaceholder={globalFilterPlaceholder}
                    bulkActions={bulkActions}
                    selectedRowsLength={selectedRowCount}
                    onRowsDeselect={() => table.resetRowSelection()}
                    globalFilterSetter={onGlobalFilterInputChange}
                    visibleColumns={columnVisibility}
                />
                <Scrollbar ref={scrollbarContainerRef}>
                    <table
                        className={classNames("table", className)}
                        role="table"
                        aria-label={className || "Data table"}
                        aria-rowcount={rowCount > 0 ? rowCount : undefined}
                        aria-colcount={columnCount}
                    >
                        <THead
                            ref={tableHeadRef}
                            table={table}
                            expandable={expandable}
                            withCheckbox={withCheckbox}
                            withStickyHeader={withStickyHeader}
                            selectAllText={selectAllText}
                            rowCount={rowCount}
                        />
                        <TBody
                            table={table}
                            expandable={expandable}
                            withCheckbox={withCheckbox}
                            editableMode={editableMode}
                            scrollbarContainerRef={scrollbarContainerRef.current}
                            loaderSize={loaderSize}
                            loaderText={loaderText}
                            loading={loading}
                            withVirtualScroll={withVirtualScroll}
                            withDynamicFetch={withDynamicFetch}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            hasNextPage={hasNextPage}
                            emptyTitle={emptyTitle}
                            emptyDescription={emptyDescription}
                            emptyActions={emptyActions}
                            emptyAppearance={emptyAppearance}
                            tableHeadRef={tableHeadRef.current}
                            tableFootRef={tableFootRef.current}
                        />
                        {table.getRowModel().rows.length > 0 && (
                            <TFoot ref={tableFootRef} table={table} withCheckbox={withCheckbox} />
                        )}
                    </table>
                </Scrollbar>
            </div>

            {withPagination && !withVirtualScroll && table.getRowModel().rows.length > 0 && (
                <div className="dataTable__pagination">
                    <div className="dataTable__pagination_controls">
                        <Pagination
                            current={initialPageIndex + 1}
                            totalItems={data.length}
                            currentPageItemsLength={initialPageSize}
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
        </TableContext.Provider>
    );
};

export { ITableProps, Table as default };
