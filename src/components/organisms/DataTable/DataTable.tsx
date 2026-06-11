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
import { INITIAL_PAGE_SIZE } from "@components/organisms/DataTable/constants";
import { adaptColumns, DefaultCellComponent, withExpanderColumn } from "@components/organisms/DataTable/helper";
// Hooks
import { useTablePagination } from "@components/organisms/DataTable/hooks/useTablePagination";
import TableBody from "@components/organisms/DataTable/TableBody/TableBody";
import TableHeader from "@components/organisms/DataTable/TableHeader/TableHeader";
import Toolbar from "@components/organisms/DataTable/Toolbar/Toolbar";
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
} from "@components/organisms/DataTable/types";

// Styles
import "./DataTable.scss";

// Context
import { DataTableProvider } from "./context";

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
}

const DataTable = <TData,>({
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
    renderExpandedRow,
    onRowExpandChange,
    rowActions,
    getRowStatus,
    manageColumnsConfig = {}
}: IDataTableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: [], right: [] });
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

    const handleExpandedChange = useCallback(
        (updaterOrValue: ExpandedState | ((old: ExpandedState) => ExpandedState)) => {
            setExpanded((prevState) => {
                const newState = typeof updaterOrValue === "function" ? updaterOrValue(prevState) : updaterOrValue;
                return newState;
            });
        },
        []
    );

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

            acc[column.id] = (column as { defaultVisible?: boolean }).defaultVisible ?? true;
            return acc;
        }, {});
    }, [tableColumns]);

    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibility);

    const table = useReactTable({
        data: data ?? [],
        columns: tableColumns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        manualPagination,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: handleExpandedChange,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
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

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = !isTableLoading && paginationProps && paginationProps.totalPages > 0;

    const isTableDataEmpty = isTableLoading || !data?.length;

    return (
        <DataTableProvider value={{ table, manageColumnsConfig, initialColumnVisibility }}>
            <div className={classNames("dataTable", className)}>
                <Toolbar />
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
