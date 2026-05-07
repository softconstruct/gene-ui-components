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
    ITableManageColumnsTexts,
    ITableNoDataTexts
} from "@components/organisms/DataTable/types";

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
     * Enables the ability to manage columns by dragging and dropping them in the desired order.
     */
    isManageColumnsEnabled?: boolean;
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
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    manageColumnsTexts?: ITableManageColumnsTexts;
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
    isManageColumnsEnabled = false,
    manageColumnsTexts
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

    // Keep the latest `onRowExpandChange` in a ref so the column model isn't
    // rebuilt every render when consumers pass an inline (un-memoized) handler.
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

    const handleApplyColumnVisibility = useCallback((nextVisibility: ColumnVisibilityState) => {
        setColumnVisibility(nextVisibility);
    }, []);

    const handleApplyColumnPinning = useCallback((nextPinning: ColumnPinningState) => {
        setColumnPinning(nextPinning);
    }, []);

    const handleApplyColumnOrder = useCallback((nextOrder: ColumnOrderState) => {
        setColumnOrder(nextOrder);
    }, []);

    const leafColumns = table.getAllLeafColumns();
    const defaultColumnOrder = useMemo(() => leafColumns.map((c) => c.id), [leafColumns]);

    return (
        <div className={classNames("dataTable", className)}>
            <Toolbar
                isManageColumnsEnabled={isManageColumnsEnabled}
                columns={leafColumns}
                columnVisibility={columnVisibility}
                defaultColumnVisibility={initialColumnVisibility}
                onApplyColumnVisibility={handleApplyColumnVisibility}
                columnPinning={columnPinning}
                defaultColumnPinning={{ left: [], right: [] }}
                onApplyColumnPinning={handleApplyColumnPinning}
                columnOrder={columnOrder}
                defaultColumnOrder={defaultColumnOrder}
                onApplyColumnOrder={handleApplyColumnOrder}
                manageColumnsTexts={manageColumnsTexts}
            />
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
    );
};

export { IDataTableProps, DataTable as default };
