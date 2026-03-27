import React, { ReactElement, useState } from "react";
import { CellContext, ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";

import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
// Components
import Pagination, { IPaginationProps } from "@components/molecules/Pagination";
// Constants
import { DEFAULT_ERROR_TEXTS } from "@components/molecules/Table/constants";
// Hooks
import { useTablePagination } from "@components/molecules/Table/hooks/useTablePagination";
import TableBody from "@components/molecules/Table/TableBody/TableBody";
import TableHeader from "@components/molecules/Table/TableHeader/TableHeader";
// Types
import { ITableErrorTexts } from "@components/molecules/Table/types";

// Styles
import "./Table.scss";

/**
 * Props for the {@link Table} component.
 * @template TData - The shape of the overall row data object.
 */
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
     * An object with error texts, used for various cases (no data, no result found).
     */
    errorTexts?: ITableErrorTexts;
}

const defaultColumn = {
    cell: <TData, TValue>({ getValue }: CellContext<TData, TValue>) => (
        <Text className="tableBodyCell__text" as="span" variant="labelMediumMedium">
            {getValue() as string}
        </Text>
    )
};

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets.
 * * Data tables are essential for presenting information such as reports, inventories, or user data in a clear,
 * sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns The fully assembled Table component including headers, body, and optional pagination.
 */
const Table = <TData,>({
    className,
    data = [] as TData[],
    columns = [],
    pagination = true,
    loading: externalLoading = false,
    loadingText = "Loading...",
    errorTexts = DEFAULT_ERROR_TEXTS
}: ITableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    return (
        <div className={classNames("dataTable", className)}>
            <Scrollbar>
                <table className={classNames("dataTable__table table")}>
                    <TableHeader headerGroups={table.getHeaderGroups()} />
                    <TableBody
                        loading={isTableLoading}
                        loadingText={loadingText}
                        rows={table.getRowModel().rows}
                        errorTexts={errorTexts}
                    />
                </table>
            </Scrollbar>
            {paginationProps && <Pagination className="dataTable__pagination" {...paginationProps} />}
        </div>
    );
};

export { ITableProps, Table as default };
