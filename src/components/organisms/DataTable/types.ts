import { FC, MouseEvent, ReactNode } from "react";

import { IconProps } from "@geneui/icons";

import { IManageColumnsDiffPayload } from "@components/organisms/DataTable/hooks/useManageColumns";

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
     * Lean cell renderer (no TanStack CellContext exposure).
     */
    renderCell?: (args: DataTableRenderCellArgs<TData, ReactNode>) => ReactNode;
};

export type ColumnVisibilityState = Record<string, boolean>;

export type ManageColumnsConfig = {
    /**
     * Whether the manage columns are in loading state.
     * Will disable all actions
     */
    loading?: boolean;
    /**
     * Whether the manage columns modal is open.
     */
    open?: boolean;
    /**
     * Whether the manage columns button is visible but disabled.
     */
    enabled?: boolean;
    /**
     * Whether the manage columns button is available.
     */
    available?: boolean;
    /**
     * Callback function which triggers when the save button is clicked.
     */
    onSave?: (diff: IManageColumnsDiffPayload) => void;
    /**
     * Texts to be displayed in the manage columns modal.
     */
    texts?: {
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
    };
    /**
     * Callback function which triggers when the column is getting pinned.
     */
    onColumnPin?: () => void;
    /**
     * Callback function which triggers when the column is getting reordered.
     */
    onColumnOrderChange?: () => void;
    /**
     * Callback function which triggers when the column visibility is getting changed.
     */
    onColumnVisibilityChange?: () => void;
    /**
     * Callback function which triggers when the restore button is clicked.
     */
    onRestoreDefaults?: () => void;
    /**
     * Callback function which triggers when the search input is changed.
     */
    onSearch?: (searchValue?: string) => void;
    /**
     * Callback function which triggers when the select all columns visibility is getting changed.
     */
    onSelectAllColumnsVisibility?: () => void;
    /**
     * List of column ids that should be disabled for hiding.
     */
    disabledColumns?: string[];
};
