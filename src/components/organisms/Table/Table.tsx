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
import {
    EditBuffer,
    IBulkActions,
    IEditActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
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
}

interface ITableProps {
    data: Row[];
    columns: TableColumns<Row>[];
    pinnedColumns?: string[];
    columnOrder?: string[];
    columnVisibility?: VisibilityState;
    rowSelectionInfo?: IRowSelectionInfo;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
    editActions?: IEditActions;
    headerContent?: ReactNode;
    selectAllText?: string;
    editMode?: boolean;
    resizable?: boolean;
    withToolbar?: boolean;
    withPagination?: boolean;
    withVirtualScroll?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    estimateSize?: number;
    overscan?: number;
    withStickyHeader?: boolean;
    withStickyFooter?: boolean;
    withManualSorting?: boolean;
    withManualFiltering?: boolean;
    withFilterFromLeafRows?: boolean;
    onColumnSizingChange?: (columnData: ColumnSizingState) => void;
    onColumnSizingRestore?: (columnData: ColumnSizingState) => void;
    columnResizeMode?: "onEnd" | "onChange";
    columnResizeDirection?: "ltr" | "rtl";
    onSort?: (event: SortingState) => void;
    onGlobalFilter?: (event: string) => void;
    onColumnFilter?: (event: ColumnFiltersState) => void;
    defaultColumnSizes?: {
        size?: number;
        minSize?: number;
        maxSize?: number;
    };
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
     * A callback function that is triggered when the current page changes. The new page number is passed as an argument.
     */
    onPageChange?: (pageNumber: number) => void;
    /**
     * A callback function that is triggered when the page size changes. The new page size is passed as an argument.
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
            pinnedColumns: table.getState().columnPinning.left
        }),
        [table, columnVisibility, columnOrder]
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

    const rows = [...table.getTopRows(), ...table.getCenterRows()];

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
                        {withVirtualScroll ? (
                            <VirtualizedBody
                                rows={rows}
                                scrollElement={scrollElement}
                                hasMore={hasMore}
                                onLoadMore={onLoadMore}
                                overscan={overscan}
                                estimateSize={estimateSize}
                            />
                        ) : (
                            <TBody rows={rows} />
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
