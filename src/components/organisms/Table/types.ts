import { FC, JSX, ReactElement, ReactNode } from "react";
import { ColumnDef, Row as RowData } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

// Components
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

export type TRowCells = {
    [K in string]?: Cell;
};

export type Row = TRowCells & {
    id: string | number;
    isPinned?: boolean;
    isSelected?: boolean;
    rowStatus?: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData?: () => ReactNode | null;
};

type BaseTableColumn<T> = ColumnDef<T extends object ? T : never> & {
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
    enableColumnFilters?: boolean;
    isSortingDisabled?: boolean;
    renderer?: (data?: RowData<Row>, editMode?: boolean, onChange?: (value: string | number) => void) => JSX.Element;
    editable?: boolean;
    isEditDisabled?: boolean;
    copyable?: boolean;
    isCopyDisabled?: boolean;
    enableColumnFilter?: boolean;
    isColumnFilterDisabled?: boolean;
    enableSelectFilter?: boolean;
    isSelectFilter?: boolean;
    filterOptions?: string[];
    resizable?: boolean;
    columns?: BaseTableColumn<T>[];
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
};

type StatusOrPillColumn<T> = BaseTableColumn<T> & {
    type: "Status" | "Pill";
    renderer: (
        data?: RowData<Row>,
        editMode?: boolean,
        onChange?: (value: string | number) => void
    ) => ReactElement<IPillProps>;
};

type IconOrFlagColumn<T> = BaseTableColumn<T> & {
    type: "Icon" | "Flag";
    renderer: (
        data?: RowData<Row>,
        editMode?: boolean,
        onChange?: (value: string | number) => void
    ) => ReactElement<IconProps>;
};

type DefaultColumn<T> = BaseTableColumn<T> & {
    type: Exclude<CellType, "Status" | "Pill" | "Icon" | "Flag">;
    renderer?: (data?: RowData<Row>, editMode?: boolean, onChange?: (value: string | number) => void) => JSX.Element;
};

export type TableColumns<T> = StatusOrPillColumn<T> | IconOrFlagColumn<T> | DefaultColumn<T>;

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

export interface IPrimaryActionConfig extends Omit<IActionConfig, "onClick"> {
    onClick?: (savedData: Row[]) => void;
}

export type Actions = {
    primary?: IPrimaryActionConfig;
    secondary?: IActionConfig;
    tertiary?: IActionConfig;
};

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

export type HeaderActionsType = Extract<CellType, "Empty" | "Expand" | "RowCheckbox">;

export type RowId = string | number;
export type EditBuffer = Map<string, unknown>;
