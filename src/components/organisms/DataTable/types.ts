import { FC, MouseEvent, ReactNode } from "react";
import { ColumnOrderState, ColumnPinningState, RowData } from "@tanstack/react-table";

import { IconProps } from "@geneui/icons";

export interface ITableNoDataTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
}

export type DataTableRowStatus = "default" | "zebra" | "red" | "green" | "highlighted";

export type DataTableGetRowStatus<TData> = (row: TData) => DataTableRowStatus | undefined;
export type DataTableRenderExpandedRow<TData> = (row: TData) => ReactNode;

export interface DataTableRowExpandChangePayload<TData> {
    /**
     * Whether the row became expanded (`true`) or collapsed (`false`).
     */
    isExpanded: boolean;
    /**
     * The full row data object for the toggled row.
     */
    row: TData;
    /**
     * Stable row id assigned by the table (matches `Row.id` from TanStack Table).
     */
    rowId: string;
}

export type DataTableRowExpandChangeHandler<TData> = (payload: DataTableRowExpandChangePayload<TData>) => void;

export type DataTableRenderCellArgs<TData, TValue> = {
    value: TValue;
    row: TData;
    rowId: string;
};

export interface IDataTableRowAction<TData> {
    Icon: FC<IconProps>;
    title?: string;
    disabled?: boolean | ((row: TData) => boolean);
    /**
     * Row-aware click handler: receives the row data and the originating mouse event.
     */
    onClick: (row: TData, e: MouseEvent) => void;
}

/**
 * Public DataTable column type (Gene UI).
 * Kept intentionally small: only the props used by the current DataTable implementation.
 */
export type DataTableColumn<TData> = {
    /**
     * Column id. Needed for display-only columns (without accessorKey).
     */
    id?: string;
    /**
     * Key from a row object used to get cell values.
     */
    accessorKey?: keyof TData & string;
    /**
     * Column header label.
     */
    header?: string;
    /**
     * Column width in px.
     */
    size?: number;
    /**
     * Whether the column is visible by default.
     * @default true
     */
    defaultVisible?: boolean;
    /**
     * Whether the column is pinned (to the left) by default.
     * Also used as the baseline for the manage-columns "Restore defaults" action.
     * @default false
     */
    defaultPinned?: boolean;
    /**
     * Lean cell renderer (no TanStack CellContext exposure).
     * IMPORTANT: For optimal performance on large tables, ensure this function is memoized
     * (e.g., using `useCallback` or defined outside the component) to avoid unnecessary cell re-renders.
     */
    renderCell?: (args: DataTableRenderCellArgs<TData, ReactNode>) => ReactNode;
};

export type ColumnVisibilityState = Record<string, boolean>;

/**
 * Changes applied by the manage-columns Save action, passed to `ManageColumnsConfig.onSave`.
 * `pinningChanges` and `orderChanges` are `null` when the pinning or the order did not change.
 */
export interface IManageColumnsDiffPayload {
    visibilityChanges: Record<string, boolean>;
    pinningChanges: ColumnPinningState | null;
    orderChanges: ColumnOrderState | null;
}

export interface IManageColumnsTexts {
    /** Text for the save button * */
    saveButton?: string;
    /** Text for the cancel button * */
    cancelButton?: string;
    /** Text for the restore-to-defaults button * */
    restoreDefaultsButton?: string;
    /** Placeholder text for the search field input * */
    searchPlaceholder?: string;
    /** Text for the manage columns button * */
    label?: string;
    /** Text for the select/deselect all columns button * */
    selectAllColumns?: string;
    /** Title text to display when there are no results after search * */
    noResultsFound?: string;
    /** Description text to display when there are no results to display after search * */
    noResultsFoundDescription?: string;
}

export type ManageColumnsConfig = {
    /**
     * Whether the manage columns are in loading state.
     * Will disable all actions
     */
    loading?: boolean;
    /**
     * Controls whether the manage columns popover is open.
     * When provided, the popover is controlled: update it from `onOpenChange`.
     */
    open?: boolean;
    /**
     * Callback fired when the popover requests to open or close
     * (button click, Save, Cancel, click outside).
     * Required to close the popover when `open` is controlled.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Whether the manage columns button is interactive.
     * When `true` the button is rendered in a disabled state.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the manage columns button is rendered at all.
     * @default false
     */
    visible?: boolean;
    /**
     * Callback function which triggers when the save button is clicked.
     */
    onSave?: (diff: IManageColumnsDiffPayload) => void;
    /**
     * Texts to be displayed in the manage columns modal.
     */
    texts?: IManageColumnsTexts;
    /**
     * Callback function which triggers when a column's pin is toggled in the popover.
     * The change is a draft: it is applied to the table (and reported by `onSave`) only on Save.
     * @param columnId - Id of the toggled column.
     * @param isPinned - Whether the column is pinned after the toggle.
     */
    onColumnPin?: (columnId: string, isPinned: boolean) => void;
    /**
     * Callback function which triggers when a column is dropped at a new position in the popover.
     * The change is a draft: it is applied to the table (and reported by `onSave`) only on Save.
     * @param columnOrder - Ids of all managed columns in their new draft order, as listed in the popover.
     * Pinned columns are moved to the top only on Save.
     */
    onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
    /**
     * Callback function which triggers when a column's checkbox is toggled in the popover.
     * The change is a draft: it is applied to the table (and reported by `onSave`) only on Save.
     * @param columnId - Id of the toggled column.
     * @param isVisible - Whether the column is visible after the toggle.
     */
    onColumnVisibilityChange?: (columnId: string, isVisible: boolean) => void;
    /**
     * Callback function which triggers when the restore button is clicked.
     * The defaults are a draft: they are applied to the table (and reported by `onSave`) only on Save.
     */
    onRestoreDefaults?: () => void;
    /**
     * Callback function which triggers when the search input is changed.
     * @param searchValue - The current value of the search input.
     */
    onSearch?: (searchValue: string) => void;
    /**
     * Callback function which triggers when the select all columns checkbox is toggled.
     * The change is a draft: it is applied to the table (and reported by `onSave`) only on Save.
     * @param isVisible - Whether the columns are visible after the toggle.
     * @param columnIds - Ids of the columns the toggle applied to: the listed (search-matched) columns,
     * without the `disabledColumns`.
     */
    onSelectAllColumnsVisibility?: (isVisible: boolean, columnIds: string[]) => void;
    /**
     * List of column ids that should be disabled for hiding.
     */
    disabledColumns?: string[];
};

/**
 * `ManageColumnsConfig` after the DataTable merged it with its defaults.
 * Flags and texts that have a default are guaranteed to be defined.
 */
export type ResolvedManageColumnsConfig = Omit<ManageColumnsConfig, "disabled" | "visible" | "texts"> &
    Required<Pick<ManageColumnsConfig, "disabled" | "visible">> & {
        texts: Required<Omit<IManageColumnsTexts, "noResultsFoundDescription">> &
            Pick<IManageColumnsTexts, "noResultsFoundDescription">;
    };

declare module "@tanstack/react-table" {
    // eslint-disable-next-line
    interface ColumnMeta<TData extends RowData, TValue> {
        explicitSize?: number;
        defaultVisible?: boolean;
        defaultPinned?: boolean;
    }
}
