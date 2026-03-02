import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
    ColumnFiltersState,
    ColumnPinningState,
    FilterFn,
    getCoreRowModel,
    getFilteredRowModel,
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
    withToolbar?: boolean;
    withPagination?: boolean;
    withVirtualScroll?: boolean;
    withStickyHeader?: boolean;
    withStickyFooter?: boolean;
    withManualSorting?: boolean;
    withManualFiltering?: boolean;
    withFilterFromLeafRows?: boolean;
    columnResizeDirection?: "ltr" | "rtl";
    onSort?: (event: SortingState) => void;
    onGlobalFilter?: (event: string) => void;
    onColumnFilter?: (event: ColumnFiltersState) => void;
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
    withToolbar,
    withStickyHeader,
    withStickyFooter,
    withFilterFromLeafRows,
    columnResizeDirection = "ltr",
    withManualSorting,
    withManualFiltering,
    onSort,
    onGlobalFilter,
    onColumnFilter,
    className
}) => {
    const cols = useMemo(() => createColumns(columns), [columns]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
        state: {
            sorting,
            globalFilter,
            columnFilters,
            columnPinning: {
                left: pinnedColumns
            },
            ...(columnOrder && { columnOrder }),
            ...(columnVisibility && { columnVisibility })
        },
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
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange",
        columnResizeDirection,
        filterFromLeafRows: withFilterFromLeafRows,
        manualSorting: withManualSorting,
        manualFiltering: withManualFiltering,
        filterFns: {
            multiSelect: ((row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                const cellStr = cellValue != null ? String(cellValue) : "";

                if (Array.isArray(filterValue) && filterValue.length > 0) {
                    return filterValue.includes(cellValue);
                }
                if (typeof filterValue === "string" && filterValue.trim().length > 0) {
                    return cellStr.toLowerCase().includes(filterValue.trim().toLowerCase());
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
        [table.getHeaderGroups()]
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
                <table className={classNames("table", className)} role="table">
                    <THead
                        columns={table.getHeaderGroups()}
                        withStickyHeader={withStickyHeader}
                        selectAllText={selectAllText}
                    />
                    <TBody rows={rows} />
                    {hasFooters && <TFoot footer={table.getFooterGroups()} withStickyFooter={withStickyFooter} />}
                </table>
                {withPagination && !withVirtualScroll && (
                    <div className="dataTable__pagination">
                        <div className="dataTable__pagination_controls">
                            <Pagination
                                current={table.getState().pagination.pageIndex + 1}
                                totalPages={table.getPageCount()}
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
