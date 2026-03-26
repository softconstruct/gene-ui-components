import { FC, JSX, ReactNode } from "react";
import { ColumnDef, ColumnPinningState, Row as RowData, VisibilityState } from "@tanstack/react-table";
import { HeaderContext } from "@tanstack/table-core/build/lib/core/headers";

import { IconProps } from "@geneui/icons";

// Components
import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { IMenuItemProps } from "@components/molecules/Menu";
import { ISwitchProps } from "@components/molecules/Switch";
import { ITextFieldProps } from "@components/molecules/TextField";
import { IManageColumnsProps } from "@components/organisms/Table/ManageColumns";

import type { TableColumns } from "./table-columns";

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

export type RowActionTypes = "pin" | "pinFilled" | "tag" | "clock" | "reload" | "copy" | "download" | "show" | "delete";

export interface IActionConfig {
    label: string;
    onClick?: () => void;
    ariaLabel?: string;
    disabled?: boolean;
}

export type Row = TRowCells & {
    id: string | number;
    isPinned?: boolean;
    isSelected?: boolean;
    rowStatus?: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData?: () => ReactNode | null;
};

export interface IRowAction extends Omit<Partial<IActionConfig>, "onClick"> {
    id?: string;
    type: RowActionTypes;
    onClick: (row: RowData<Row>) => void;
}

export type BaseTableColumn<T> = ColumnDef<T extends object ? T : never> & {
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
    columns?: TableColumns<T>[];
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
};

export type { TableColumns } from "./table-columns";

export type ManageColumnsSavedDataType = {
    visibilityColumns: VisibilityState;
    pinnedColumns: ColumnPinningState["left"];
    columnsOrdering: string[];
};

export interface IRowSelectionInfo {
    selectedRowsLabel?: string;
    selectedRowsLength?: number;
    deselectTitle?: string;
    onRowsDeselect?: () => void;
}

interface IEditPrimaryActionConfig extends Omit<IActionConfig, "onClick"> {
    onClick?: (data: Row[]) => void;
}

interface IManageColumnsPrimaryActionConfig extends Omit<IActionConfig, "onClick"> {
    onClick?: (data: ManageColumnsSavedDataType) => void;
}

interface BaseActionsType {
    secondary?: IActionConfig;
    tertiary?: IActionConfig;
}

export interface IEditActions extends BaseActionsType {
    primary?: IEditPrimaryActionConfig;
}

export interface IManageColumnsActions extends BaseActionsType {
    primary?: IManageColumnsPrimaryActionConfig;
}

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

export type EditableCellType = "Text" | "Number" | "LongText" | "Checkbox" | "Switch" | "Dropdown";

export interface ICellProps {
    type: CellType | EditableCellType;
    dataKey?: string;
    data?: RowData<Row>;
    value?: unknown;
    rowId?: string | number;
    editMode?: boolean;
    onChange?: (value: string | number | boolean) => void;
    inputType?: ITextFieldProps["type"];
    options?: { value: string; label: string }[];
    renderer?: (data?: RowData<Row>, editMode?: boolean, onChange?: (value: string | number) => void) => JSX.Element;
}
