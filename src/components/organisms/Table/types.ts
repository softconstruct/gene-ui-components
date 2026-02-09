import { FC, JSX, ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { IMenuItemProps } from "@components/molecules/Menu";
import { ISwitchProps } from "@components/molecules/Switch";
import { IManageColumnsProps } from "@components/organisms/Table/ManageColumns";

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
    id?: string;
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

export interface IActionConfig {
    label: string;
    onClick?: () => void;
    ariaLabel?: string;
    disabled?: boolean;
}

type ActionMap<T extends string> = Partial<Record<T, IActionConfig>>;

type ActionKey = "primary" | "secondary" | "tertiary";

export type Actions = ActionMap<ActionKey>;

export interface IGlobalFilterInfo {
    onChange?: (value: string) => void;
    placeholder?: string;
    withGlobalFilter?: boolean;
    withManualFiltering?: boolean;
}

export interface IBulkActions extends Omit<IActionConfig, "onClick"> {
    onChange: (item: IMenuItemProps) => void;
    list: IMenuItemProps[];
}

export interface IManageColumnsInfo {
    manageColumns: IManageColumnsProps;
    manageColumnsTitle?: string;
    isManageColumnsDisabled?: boolean;
}
