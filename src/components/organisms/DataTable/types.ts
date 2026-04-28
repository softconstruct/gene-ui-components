import { FC, MouseEvent, ReactNode } from "react";

import { IconProps } from "@geneui/icons";

export interface ITableNoDataTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
}

export type DataTableRowStatus = "default" | "zebra" | "red" | "green" | "highlighted";

export type DataTableGetRowStatus<TData> = (row: TData) => DataTableRowStatus | undefined;
export type DataTableRenderExpandedRow<TData> = (row: TData, isExpanded: boolean) => ReactNode;

export type DataTableRowExpandChangeHandler<TData> = (isExpanded: boolean, rowData: TData) => void;

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
     * Key from row object used to get cell values.
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
     * Lean cell renderer (no TanStack CellContext exposure).
     */
    renderCell?: (args: DataTableRenderCellArgs<TData, ReactNode>) => ReactNode;
};
