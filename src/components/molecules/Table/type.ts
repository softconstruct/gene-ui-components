import { FC, ReactNode } from "react";
import { Column, ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { IMenuItemProps } from "@components/molecules/Menu";

export type CellType =
    | "empty"
    | "expand"
    | "rowCheckbox"
    | "graph"
    | "text"
    | "number"
    | "longText"
    | "dropdown"
    | "status"
    | "pill"
    | "icon"
    | "flag"
    | "checkbox"
    | "switch";

export type RowData = Record<string, any>;

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    id: string;
    header: string | null;
    footer?: (props: HeaderContext<RowData, unknown>) => ReactNode;
    type: CellType;
    order: number;
    isVisible?: boolean;
    withCheckbox?: boolean;
    enableSorting?: boolean;
    editable?: boolean;
    copyable?: boolean;
    enableColumnFilter?: boolean;
    enablePopoverFilter?: true;
    filterOptions?: string[];
    resizable?: boolean;
    columns?: TableCol<RowData>[];
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
};

export type RowActions = {
    pin?: (rowId: string) => void;
    tag?: (rowId: string) => void;
    clock?: (rowId: string) => void;
    reload?: (rowId: string) => void;
    copy?: (rowId: string) => void;
    download?: (rowId: string) => void;
    show?: (rowId: string) => void;
    delete?: (rowId: string) => void;
};

export type TableSize = "small" | "medium" | "large";
export type TableVariant = "default" | "striped" | "bordered";

export type LoadingState = "idle" | "loading" | "error" | "success";

export type SelectionMode = "single" | "multiple" | "none";

export interface TableState {
    sorting: SortingState;
    pagination: PaginationState;
    globalFilter: string;
    columnVisibility: Record<string, boolean>;
}

export interface TableCallbacks<T = any> {
    onSortChange?: (sorting: SortingState) => void;
    onPageChange?: (pagination: PaginationState) => void;
    onRowSelect?: (selectedRows: T[]) => void;
    onRowClick?: (row: T) => void;
    onCellEdit?: (rowIndex: number, columnId: string, value: any) => void;
    onSave?: (data: T[]) => void;
    onGlobalFilterChange?: (filter: string) => void;
}

export type Cell = {
    type:
        | "graph"
        | "text"
        | "number"
        | "longText"
        | "dropdown"
        | "status"
        | "pill"
        | "icon"
        | "flag"
        | "checkbox"
        | "switch";
    data: string | number | boolean | IPillProps | FC<IconProps>;
    rowCellRenderer: (Element: ReactNode) => ReactNode;
};

type TableRowCells = {
    [K in CellType]?: Cell;
};

export type Row = TableRowCells & {
    rowStatus: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData: () => ReactNode | null;
};

export interface BulkActionList {
    id?: string | number;
    label: string;
    action: (selectedRows: Row) => void;
}

export interface BulkAction {
    label: string;
    onChange: (item: IMenuItemProps) => void;
    list: IMenuItemProps[];
}

export interface IOrderedColumns {
    id: string;
    title: string | null;
    isVisible?: boolean;
    order?: number;
    columns: Column<RowData, unknown>[];
}
