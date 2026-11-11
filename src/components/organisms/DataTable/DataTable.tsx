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

// Constants, context & helpers
import { EXPANDER_COLUMN_ID, INITIAL_PAGE_SIZE } from "./constants";
import { DataTableProvider, DirModeContext, IDataTableContext } from "./context";
import { adaptColumns, DefaultCellComponent, withExpanderColumn } from "./helper";
// Hooks
import { useTablePagination } from "./hooks/useTablePagination";
// Sub-components
import TableBody from "./TableBody/TableBody";
import TableHeader from "./TableHeader/TableHeader";
import Toolbar from "./Toolbar/Toolbar";
// Types
import {
    ColumnVisibilityState,
    DataTableColumn,
    DataTableEditDefaults,
    DataTableEditValues,
    DataTableGetRowStatus,
    DataTableRenderExpandedRow,
    DataTableRowExpandChangeHandler,
    IDataTableCellChangePayload,
    IDataTableEditConfig,
    IDataTableRowAction,
    ITableNoDataTexts,
    ManageColumnsConfig,
    ResolvedManageColumnsConfig
} from "./types";

// Styles
import "./DataTable.scss";

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
     * @default false
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
    /**
     * Configuration object for edit mode.
     * Providing it renders the Edit button in the toolbar and lets the columns marked `editable` be edited;
     * omitting it leaves the table read-only.
     * Both the mode and the edited values are owned by the consumer: `editing` says whether the table
     * is in edit mode, and the drafts are passed back through `editValues`.
     *
     * @example
     * ```tsx
     * <DataTable
     *   editConfig={{
     *     editing: isEditing,
     *     onEditStart: () => setIsEditing(true),
     *     onCellChange: ({ rowId, columnId, value }) => updateDraft(rowId, columnId, value),
     *     onSave: (values) => api.save(values),
     *     onCancel: () => {
     *       clearDrafts();
     *       setIsEditing(false);
     *     }
     *   }}
     *   editValues={drafts}
     * />
     * ```
     */
    editConfig?: IDataTableEditConfig<TData>;
    /**
     * Draft values displayed by the editing cells, keyed by row id.
     * Providing them makes the drafts controlled: keep them up to date from `onCellChange`.
     * Omitting them lets the table hold the drafts itself and report them through `onSave`.
     * Sparse: a cell without an entry falls back to its value from `data`,
     * which keeps the drafts out of sorting, filtering and pagination.
     *
     * @example
     * ```tsx
     * editValues={{ "12": { firstName: "Jane" } }}
     * ```
     */
    editValues?: DataTableEditValues<TData>;
    /**
     * Resolves a stable, unique id for a row from its data.
     * Every row-bound state is keyed by it: expanded rows and the edit mode drafts.
     *
     * @example
     * ```tsx
     * <DataTable getRowId={(row) => String(row.id)} />
     * ```
     */
    getRowId: (originalRow: TData, index: number) => string;
}

const EMPTY_DATA: never[] = [];
const EMPTY_EDIT_VALUES = {};
const DEFAULT_MANAGE_COLUMNS_CONFIG = {
    disabled: false,
    visible: false,
    texts: {
        label: "Manage columns",
        searchPlaceholder: "Search",
        selectAllColumns: "All Columns",
        noResultsFound: "No results found",
        restoreDefaultsButton: "Restore defaults",
        cancelButton: "Cancel",
        saveButton: "Save"
    }
} satisfies ResolvedManageColumnsConfig;

const DEFAULT_EDIT_CONFIG = {
    saveDisabled: false,
    loading: false,
    texts: {
        editButton: "Edit",
        saveButton: "Save",
        cancelButton: "Cancel"
    }
} satisfies DataTableEditDefaults;

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
    data = EMPTY_DATA,
    columns = EMPTY_DATA,
    pagination = false,
    loading: isTableLoading = false,
    sticky = true,
    loadingText,
    noDataTexts,
    noDataAvailableActions,
    manualPagination = false,
    renderExpandedRow,
    onRowExpandChange,
    rowActions,
    getRowStatus,
    manageColumnsConfig = DEFAULT_MANAGE_COLUMNS_CONFIG,
    editConfig,
    editValues,
    getRowId
}: IDataTableProps<TData>): ReactElement => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [internalDrafts, setInternalDrafts] = useState<DataTableEditValues<TData>>(EMPTY_EDIT_VALUES);
    const activeDrafts = editValues ?? internalDrafts;

    const isEditing = Boolean(editConfig?.editing);
    const editStateRef = useRef({ editConfig, editValues, activeDrafts });
    editStateRef.current = { editConfig, editValues, activeDrafts };

    useEffect(() => {
        if (!isEditing) setInternalDrafts(EMPTY_EDIT_VALUES);
    }, [isEditing]);

    const handleEditSave = useCallback(() => {
        const currentEditState = editStateRef.current;
        currentEditState.editConfig?.onSave(currentEditState.activeDrafts);
    }, []);

    const handleCellChange = useCallback((payload: IDataTableCellChangePayload<TData>) => {
        const currentEditState = editStateRef.current;

        if (currentEditState.editValues === undefined) {
            setInternalDrafts((previous) => ({
                ...previous,
                [payload.rowId]: { ...previous[payload.rowId], [payload.columnId]: payload.value }
            }));
        }

        currentEditState.editConfig?.onCellChange?.(payload);
    }, []);

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

            acc[column.id] = column.meta?.defaultVisible ?? true;
            return acc;
        }, {});
    }, [tableColumns]);

    const initialColumnPinning = useMemo<ColumnPinningState>(
        () => ({
            left: tableColumns
                .filter((column) => column.meta?.defaultPinned && column.id)
                .map((column) => column.id as string),
            right: []
        }),
        [tableColumns]
    );

    const [columnVisibilityOverrides, setColumnVisibilityOverrides] = useState<ColumnVisibilityState>({});
    const [userColumnPinning, setUserColumnPinning] = useState<ColumnPinningState | null>(null);

    const columnVisibility = useMemo<ColumnVisibilityState>(
        () => ({ ...initialColumnVisibility, ...columnVisibilityOverrides }),
        [initialColumnVisibility, columnVisibilityOverrides]
    );

    const resolveColumnPinning = useCallback(
        (pinning: ColumnPinningState | null): ColumnPinningState => {
            const { left = [], right = [] } = pinning ?? initialColumnPinning;
            const leftWithoutExpander = left.filter((id) => id !== EXPANDER_COLUMN_ID);
            return {
                // The expander is always the first pinned column
                left: isExpandable ? [EXPANDER_COLUMN_ID, ...leftWithoutExpander] : leftWithoutExpander,
                right
            };
        },
        [initialColumnPinning, isExpandable]
    );

    const columnPinning = useMemo(
        () => resolveColumnPinning(userColumnPinning),
        [resolveColumnPinning, userColumnPinning]
    );

    const handleColumnVisibilityChange = useCallback(
        (updaterOrValue: ColumnVisibilityState | ((old: ColumnVisibilityState) => ColumnVisibilityState)) => {
            setColumnVisibilityOverrides((prevOverrides) =>
                typeof updaterOrValue === "function"
                    ? updaterOrValue({ ...initialColumnVisibility, ...prevOverrides })
                    : updaterOrValue
            );
        },
        [initialColumnVisibility]
    );

    const handleColumnPinningChange = useCallback(
        (updaterOrValue: ColumnPinningState | ((old: ColumnPinningState) => ColumnPinningState)) => {
            setUserColumnPinning((prevPinning) => {
                const { left = [], right = [] } =
                    typeof updaterOrValue === "function"
                        ? updaterOrValue(resolveColumnPinning(prevPinning))
                        : updaterOrValue;
                return { left: left.filter((id) => id !== EXPANDER_COLUMN_ID), right };
            });
        },
        [resolveColumnPinning]
    );

    const table = useReactTable({
        data: data ?? EMPTY_DATA,
        columns: tableColumns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        manualPagination,
        getRowId,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        onColumnVisibilityChange: handleColumnVisibilityChange,
        onColumnPinningChange: handleColumnPinningChange,
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

    const pageCount = table.getPageCount();
    const { pageIndex } = table.getState().pagination;
    useEffect(() => {
        if (!manualPagination && pageCount > 0 && pageIndex >= pageCount) {
            table.setPageIndex(pageCount - 1);
        }
    }, [manualPagination, pageCount, pageIndex, table]);

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = !isTableLoading && paginationProps && paginationProps.totalPages > 0;

    const isTableDataEmpty = isTableLoading || !data?.length;

    const headerGroups = table.getHeaderGroups();
    const leafColumns = headerGroups[headerGroups.length - 1]?.headers.map(({ column }) => column) ?? [];
    const { columnSizing } = table.getState();
    const areColumnsSized =
        leafColumns.length > 0 &&
        leafColumns.every(
            (column) => column.columnDef.meta?.explicitSize !== undefined || columnSizing[column.id] !== undefined
        );

    const [dirMode, setDirMode] = useState(() => (typeof document === "undefined" ? "ltr" : document.dir || "ltr"));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDirMode(document.dir || "ltr");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["dir"]
        });

        return () => observer.disconnect();
    }, []);

    const contextValue = useMemo<IDataTableContext<TData>>(
        () => ({
            table,
            manageColumnsConfig: {
                ...DEFAULT_MANAGE_COLUMNS_CONFIG,
                ...manageColumnsConfig,
                texts: { ...DEFAULT_MANAGE_COLUMNS_CONFIG.texts, ...manageColumnsConfig.texts }
            },
            editConfig: editConfig
                ? {
                      ...DEFAULT_EDIT_CONFIG,
                      ...editConfig,
                      texts: { ...DEFAULT_EDIT_CONFIG.texts, ...editConfig.texts },
                      onSave: handleEditSave
                  }
                : null,
            initialColumnVisibility,
            initialColumnPinning
        }),
        [table, manageColumnsConfig, editConfig, handleEditSave, initialColumnVisibility, initialColumnPinning]
    );

    return (
        <DataTableProvider value={contextValue}>
            <DirModeContext.Provider value={dirMode}>
                <div className={classNames("dataTable", className)}>
                    <Toolbar isTableLoading={isTableLoading} />
                    <Scrollbar>
                        <table
                            className={classNames("dataTable__table", {
                                dataTable__noDataToDisplay: isTableDataEmpty,
                                dataTable__table_sized: areColumnsSized
                            })}
                            style={areColumnsSized ? { width: `${table.getTotalSize()}px` } : undefined}
                        >
                            <colgroup>
                                {leafColumns.map((column) => (
                                    <col
                                        key={column.id}
                                        style={areColumnsSized ? { width: `${column.getSize()}px` } : undefined}
                                    />
                                ))}
                            </colgroup>
                            <TableHeader
                                sticky={sticky}
                                headerGroups={headerGroups}
                                hasRowActions={Boolean(rowActions?.length)}
                                areColumnsSized={areColumnsSized}
                            />
                            <TableBody
                                loading={isTableLoading}
                                loadingText={loadingText}
                                rows={table.getRowModel().rows}
                                noDataTexts={noDataTexts}
                                noDataAvailableActions={noDataAvailableActions}
                                rowActions={rowActions}
                                getRowStatus={getRowStatus}
                                renderExpandedRow={renderExpandedRow}
                                isEditing={isEditing}
                                isEditDisabled={editConfig?.loading}
                                editValues={activeDrafts}
                                onCellChange={handleCellChange}
                            />
                        </table>
                    </Scrollbar>
                    {shouldShowPagination && (
                        <Pagination className="dataTable__pagination" {...paginationProps} disabled={isTableLoading} />
                    )}
                </div>
            </DirModeContext.Provider>
        </DataTableProvider>
    );
};

export { IDataTableProps, DataTable as default };
