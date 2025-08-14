import { FC, JSX, ReactNode } from "react";
import { Column, ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { IMenuItemProps } from "@components/molecules/Menu";
import { ISwitchProps } from "@components/molecules/Switch";

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

export type Cell = {
    type: CellType;
    data: string | number | boolean | IPillProps | ICheckboxProps | ISwitchProps | FC<IconProps>;
};

type TableRowCells = {
    [K in CellType]?: Cell;
};

export type Row = TableRowCells & {
    id: string;
    isPinned: boolean;
    rowStatus: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData: () => ReactNode | null;
};

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    id: string;
    header?: string | null;
    footer?: (props: HeaderContext<Row, unknown>) => ReactNode;
    type: CellType;
    order: number;
    disabled?: boolean;
    isPinned?: boolean;
    isVisible?: boolean;
    isCheckboxDisabled?: boolean;
    enableSorting?: boolean;
    isSortingDisabled?: boolean;
    rowCellRenderer?: (data?: any) => JSX.Element;
    editable?: boolean;
    isEditDisabled?: boolean;
    copyable?: boolean;
    isCopyDisabled?: boolean;
    enableColumnFilter?: boolean;
    isColumnFilterDisabled?: boolean;
    enablePopoverFilter?: boolean;
    isPopoverFilterDisabled?: boolean;
    filterOptions?: string[];
    resizable?: boolean;
    columns?: TableCol<Row>[];
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
};

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

export interface BulkActionList {
    id?: string | number;
    label: string;
    action: (selectedRows: Row) => void;
}

export interface BulkAction {
    label: string;
    onChange: (item: IMenuItemProps) => void;
    disabled?: boolean;
    list: IMenuItemProps[];
}

export interface IOrderedColumns {
    id: string;
    title?: string | null;
    isVisible?: boolean;
    isPinned?: boolean;
    order?: number;
    columns: Column<Row, unknown>[];
}
