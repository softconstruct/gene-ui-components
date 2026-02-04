import { FC, JSX, ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
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

export type Cell =
    | string
    | number
    | boolean
    | null
    | unknown
    | IPillProps
    | ICheckboxProps
    | ISwitchProps
    | FC<IconProps>;

export type TableRowCells = {
    [K in string]?: Cell;
};

export type Row = TableRowCells & {
    id: string | number;
    isPinned?: boolean;
    isSelected?: boolean;
    rowStatus?: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData?: () => ReactNode | null;
};

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    id: string;
    header?: string | null;
    footer?: (props: HeaderContext<T extends object ? T : never, unknown>) => ReactNode;
    type: CellType;
    dataKey: string;
    order: number;
    disabled?: boolean;
    isPinned?: boolean;
    isVisible?: boolean;
    isCheckboxDisabled?: boolean;
    enableSorting?: boolean;
    isSortingDisabled?: boolean;
    rowCellRenderer?: (data?: Cell, editMode?: boolean, onChange?: (value: string | number) => void) => JSX.Element;
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

export interface IRowSelectionInfo {
    selectedRowsLabel?: string;
    selectedRowsLength?: number;
    deselectTitle?: string;
    onRowsDeselect?: () => void;
}

export interface IEditActions {
    primaryAction?: () => void;
    primaryActionTitle?: string;
    secondaryActionTitle?: string;
    secondaryAction?: () => void;
    onEdit?: () => void;
    editButtonTitle?: string;
}

export interface IGlobalFilterInfo {
    onChange?: (value: string) => void;
    placeholder?: string;
    withGlobalFilter?: boolean;
    withManualFiltering?: boolean;
}
