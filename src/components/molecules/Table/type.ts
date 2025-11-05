import { FC, JSX, ReactNode } from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { IMenuItemProps } from "@components/molecules/Menu";
import { ISwitchProps } from "@components/molecules/Switch";

export type CellType =
    | "Group"
    | "Empty"
    | "Expand"
    | "RowCheckbox"
    | "Graph"
    | "Text"
    | "Number"
    | "LongText"
    | "Dropdown"
    | "Status"
    | "Pill"
    | "Icon"
    | "Flag"
    | "Checkbox"
    | "Switch";

export type Cell = string | number | boolean | IPillProps | ICheckboxProps | ISwitchProps | FC<IconProps>;

export type TableRowCells = {
    [K in CellType]?: Cell;
};

export type Row = TableRowCells & {
    id: string;
    isPinned: boolean;
    isSelected: boolean;
    rowStatus: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData: () => ReactNode | null;
};

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    id: string;
    header?: string | null;
    footer?: (props: HeaderContext<T extends object ? T : never, unknown>) => ReactNode;
    type: CellType;
    order: number;
    disabled?: boolean;
    isPinned?: boolean;
    isVisible?: boolean;
    isCheckboxDisabled?: boolean;
    enableSorting?: boolean;
    isSortingDisabled?: boolean;
    rowCellRenderer?: (data?: Cell) => JSX.Element;
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
    columns?: TableCol<T>[];
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
};

export interface BulkAction {
    label: string;
    onChange: (item: IMenuItemProps) => void;
    disabled?: boolean;
    list: IMenuItemProps[];
}

export interface IOrderedColumns<T = Row> {
    id: string;
    title?: string | null;
    isVisible?: boolean;
    isPinned?: boolean;
    order?: number;
    columns: Column<T extends object ? T : never, unknown>[];
}

export type OrderType = {
    order: number;
    isPinned: boolean;
};

export interface IManageColumnsData {
    groupId?: string;
    columns: {
        [key: string]: OrderType;
    };
}
