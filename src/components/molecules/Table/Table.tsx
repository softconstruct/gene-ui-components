import React, { ReactElement, useState } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";

// Components
import Pagination, { IPaginationProps } from "@components/molecules/Pagination";
import TableBody from "@components/molecules/Table/TableBody/TableBody";
import TableHeader from "@components/molecules/Table/TableHeader/TableHeader";

// Hooks
import { useTablePagination } from "@components/molecules/Table/hooks/useTablePagination";

// Styles
import "./Table.scss";

import "./DeleteMe.scss";

interface ITableProps<TData> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Defines the pagination of the Table component.
     * Whether set `true` will display the raw pagination.
     * Can accept also config object with custom handlers and data.
     *
     * @default false
     */
    pagination?: boolean | IPaginationProps;
    /**
     * Data record array to be displayed.
     *
     * @default []
     */
    data?: TData[];
    /**
     * Columns of table.
     *
     * @default []
     */
    columns: ColumnDef<TData>[];
    /**
     * Toggles the loading state of the table.
     */
    loading?: boolean;
    /**
     * Info text displayed under loading spinner.
     */
    loadingText?: string;
    /**
     *
     */
    errorTexts?: any;
}

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets.
 * Data tables are essential for presenting information such as reports, inventories, or user data in a clear,
 * sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 */
const Table = <TData extends Record<string, unknown>>({
    className,
    data = [],
    columns = [],
    pagination = false,
    loading: externalLoading = false,
    loadingText = "Loading...",
    errorTexts = {
        noDataAvailableTitle: "No data available",
        noResultFoundTitle: "No results found",
        noDataAvailableText: "No data is available for display at this moment.",
        noResultFoundText: "No results were found matching your criteria."
    }
}: ITableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    return (
        <div className={classNames("dataTable", className)}>
            <table className={classNames("dataTable__table")}>
                <TableHeader headerGroups={table.getHeaderGroups()} />
                <TableBody
                    loading={isTableLoading}
                    loadingText={loadingText}
                    rows={table.getRowModel().rows}
                    errorTexts={errorTexts}
                />
            </table>
            {paginationProps && <Pagination className="dataTable__pagination" {...paginationProps} />}
        </div>
    );
};

export { ITableProps, Table as default };
