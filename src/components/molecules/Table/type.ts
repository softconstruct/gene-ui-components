import { ReactNode } from "react";
import { Column, ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

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
    header: () => ReactNode | string;
    footer?: (props: HeaderContext<RowData, unknown>) => ReactNode;
    type: CellType;
    order: number;
    isVisible?: boolean;
    withCheckbox?: boolean;
    sortable?: boolean;
    editable?: boolean;
    copyable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
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

export interface BulkAction {
    id: string;
    label: string;
    icon?: ReactNode;
    action: (selectedRows: string[]) => void;
    variant?: "default" | "danger" | "success";
}

export interface IOrderedColumns {
    id: string;
    title: () => ReactNode | string;
    isVisible?: boolean;
    order?: number;
    columns: Column<RowData, unknown>[];
}
