import React, { ReactElement, useState } from "react";
import { CellContext, ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";

// Components
import { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
// Hooks
import { useTablePagination } from "@components/molecules/DataTable/hooks/useTablePagination";
import TableBody from "@components/molecules/DataTable/TableBody/TableBody";
import TableHeader from "@components/molecules/DataTable/TableHeader/TableHeader";
// Types
import { ITableNoDataTexts } from "@components/molecules/DataTable/types";
import Pagination, { IPaginationProps } from "@components/molecules/Pagination";

// Styles
import "./DataTable.scss";

/**
 * Props for the {@link DataTable} component.
 * @template TData - The shape of the overall row data object.
 */
interface IDataTableProps<TData> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Set sticky header.
     */
    sticky?: boolean;
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
    data?: TData[] | null;
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
 * Data tables are essential for presenting information such as reports, inventories, or user data in a clear,
 * sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns The fully assembled DataTable component including headers, body, and optional pagination.
 */
const DataTable = <TData,>({
    className,
    data = [],
    columns = [],
    pagination = true,
    loading: externalLoading = false,
    sticky = true,
    loadingText,
    noDataTexts,
    noDataAvailableActions
}: IDataTableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);

    const table = useReactTable({
        data: data ?? [],
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = paginationProps && data && data.length > 0;

    return (
        <div className={classNames("dataTable", className)}>
            <Scrollbar>
                <table className={classNames("dataTable__table")}>
                    <TableHeader sticky={sticky} headerGroups={table.getHeaderGroups()} />
                    <TableBody
                        loading={isTableLoading}
                        loadingText={loadingText}
                        rows={table.getRowModel().rows}
                        noDataTexts={noDataTexts}
                        noDataAvailableActions={noDataAvailableActions}
                    />
                </table>
            </Scrollbar>
            {shouldShowPagination && <Pagination className="dataTable__pagination" {...paginationProps} />}
        </div>
    );
};

export { IDataTableProps, DataTable as default };
