import React, { ReactElement, useCallback, useMemo, useState } from "react";
import {
    CellContext,
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
import { INITIAL_PAGE_SIZE } from "@components/organisms/DataTable/constants";
import { DefaultCellComponent, TableColumnsAdapter } from "@components/organisms/DataTable/helper";
// Hooks
import { useTablePagination } from "@components/organisms/DataTable/hooks/useTablePagination";
import TableBody from "@components/organisms/DataTable/TableBody/TableBody";
import TableHeader from "@components/organisms/DataTable/TableHeader/TableHeader";
// Types
import {
    DataTableColumn,
    DataTableRowExpandChangeHandler,
    IDataTableRowAction,
    ITableData,
    ITableNoDataTexts
} from "@components/organisms/DataTable/types";

// Styles
import "./DataTable.scss";

/**
 * Props for the {@link DataTable} component.
 * @template TData - The shape of the overall row data object.
 */
interface IDataTableProps<TData extends ITableData> {
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
     * @default true
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
     * Enables expandable rows, allowing for additional content to be revealed below a row when clicked.
     */
    expandable?: boolean;
    /**
     * Callback invoked when a row is expanded or collapsed.
     * Receives the resulting row state and the toggled row data.
     *
     * @param isExpanded - Indicates whether the row became expanded (`true`) or collapsed (`false`).
     * @param rowData - Full row object for the toggled row.
     *
     * @example
     * ```tsx
     * <DataTable
     *   expandable={true}
     *   onRowExpandChange={(isExpanded, rowData) => {
     *     console.log(isExpanded, rowData);
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
}

const defaultColumn = {
    cell: <TData, TValue>({ getValue }: CellContext<TData, TValue>) => (
        <DefaultCellComponent value={String(getValue() ?? "")} />
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
const DataTable = <TData extends ITableData>({
    className,
    data = [],
    columns = [],
    pagination = false,
    loading: externalLoading = false,
    sticky = true,
    loadingText,
    noDataTexts,
    noDataAvailableActions,
    manualPagination = false,
    expandable = false,
    onRowExpandChange,
    rowActions
}: IDataTableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const handleExpandedChange = useCallback(
        (updaterOrValue: ExpandedState | ((old: ExpandedState) => ExpandedState)) => {
            setExpanded((prevState) => {
                const newState = typeof updaterOrValue === "function" ? updaterOrValue(prevState) : updaterOrValue;
                return newState;
            });
        },
        []
    );

    const tableColumns = useMemo(
        () => TableColumnsAdapter(columns, expandable, onRowExpandChange),
        [columns, expandable, onRowExpandChange]
    );

    const initialPageSize =
        typeof pagination === "object" && (pagination.pageSize || pagination.rowsPerPageOptions?.length)
            ? pagination.pageSize || pagination?.rowsPerPageOptions?.[0]
            : INITIAL_PAGE_SIZE;

    const table = useReactTable({
        data: data ?? [],
        columns: tableColumns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        manualPagination,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: handleExpandedChange,
        initialState: {
            ...(pagination && {
                pagination: { pageSize: initialPageSize }
            })
        },
        state: {
            expanded
        }
    });

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = !isTableLoading && paginationProps && paginationProps.totalPages > 0;

    const isTableDataEmpty = isTableLoading || !data?.length;

    return (
        <div className={classNames("dataTable", className)}>
            <Scrollbar>
                <table
                    className={classNames("dataTable__table", {
                        dataTable__noDataToDisplay: isTableDataEmpty
                    })}
                >
                    <TableHeader sticky={sticky} headerGroups={table.getHeaderGroups()} />
                    <TableBody
                        loading={isTableLoading}
                        loadingText={loadingText}
                        rows={table.getRowModel().rows}
                        noDataTexts={noDataTexts}
                        noDataAvailableActions={noDataAvailableActions}
                        rowActions={rowActions}
                    />
                </table>
            </Scrollbar>
            {shouldShowPagination && (
                <Pagination className="dataTable__pagination" {...paginationProps} disabled={isTableLoading} />
            )}
        </div>
    );
};

export { IDataTableProps, DataTable as default };
