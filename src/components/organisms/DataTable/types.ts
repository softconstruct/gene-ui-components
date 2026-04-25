import { FC, MouseEvent, ReactNode } from "react";

import { IconProps } from "@geneui/icons";

export interface ITableNoDataTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
}

export interface ITableData {
    expandedRow?: ReactNode;
}

export type DataTableRowExpandChangeHandler<TData extends ITableData> = (
    isExpanded: boolean,
    rowData: TData & ITableData
) => void;

export type DataTableRenderCellArgs<TData, TValue> = {
    value: TValue;
    row: TData & ITableData;
    rowId: string;
};

export interface IDataTableRowAction<TData extends ITableData> {
    Icon: FC<IconProps>;
    title?: string;
    disabled?: boolean | ((row: TData & ITableData) => boolean);
    /**
     * Row-aware click handler: receives the row data and the originating mouse event.
     */
    onClick: (row: TData & ITableData, e: MouseEvent) => void;
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

export interface ITableManageColumnsTexts {
    saveText?: string;
    cancelText?: string;
    restoreDefaultsText?: string;
    searchPlaceholder?: string;
}
