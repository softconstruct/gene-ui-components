import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
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
    Actions,
    IBulkActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
    IRowSelectionInfo,
    Row,
    TableColumns
} from "@components/organisms/Table/types";

// Styles
import "./Table.scss";

interface ITableActionHandlers {
    onSort?: (event: SortingState) => void;
    onGlobalFilter?: (event: string) => void;
    onColumnFilter?: (event: ColumnFiltersState) => void;
}

interface ITableProps extends ITableActionHandlers {
    data: Row[];
    columns: TableColumns<Row>[];
    rowSelectionInfo?: IRowSelectionInfo;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
    editActions?: Actions;
    headerContent?: ReactNode;
    selectAllText?: string;
    withToolbar?: boolean;
    withPagination?: boolean;
    withVirtualScroll?: boolean;
    withStickyHeader?: boolean;
    withStickyFooter?: boolean;
    withManualSorting?: boolean;
    withManualFiltering?: boolean;
    withFilterFromLeafRows?: boolean;
    columnResizeDirection?: "ltr" | "rtl";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using `BEM` conventions.
     */
    className?: string;
}

export const TableContext = createContext<ITableActionHandlers>({} as ITableActionHandlers);

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets. Data tables are essential for presenting information such as reports, inventories, or user data in a clear, sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 */
const Table: FC<ITableProps> = ({
    data,
    columns,
    rowSelectionInfo,
    manageColumnsInfo,
    bulkActions,
    editActions,
    globalFilterInfo,
    headerContent,
    selectAllText,
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
    const cols = createColumns(columns);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        columns: cols,
        data,
        state: {
            sorting,
            globalFilter,
            columnFilters
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange",
        columnResizeDirection,
        filterFromLeafRows: withFilterFromLeafRows,
        manualSorting: withManualSorting,
        manualFiltering: withManualFiltering,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters
    });

    const memoizedTableContextValue = useMemo<ITableActionHandlers>(() => ({}), []);

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
