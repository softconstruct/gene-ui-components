import { ReactNode } from "react";

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
