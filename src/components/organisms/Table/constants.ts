import { FunctionComponent } from "react";

import { ArrowDown, ArrowUp, ArrowUpDown } from "@geneui/icons";

import HeaderCheckboxCell, { IHeaderCheckboxCellProps } from "@components/organisms/Table/HeaderCheckboxCell";
import HeaderExpandCell, { IHeaderExpandCellProps } from "@components/organisms/Table/HeaderExpandCell";

import { ExpandAndCheckboxTypes } from "./types";

export const DISPLAY_COLUMN_TYPES = ["Empty", "Expand", "RowCheckbox"];

export const DISPLAY_COLUMN_MAP: Record<
    ExpandAndCheckboxTypes,
    FunctionComponent<IHeaderExpandCellProps | IHeaderCheckboxCellProps>
> = {
    Empty: () => `<div className="table__content table__content_empty" />`,
    Expand: HeaderExpandCell,
    RowCheckbox: HeaderCheckboxCell
};

export const CellClassNames: { [key: string]: string } = {
    Empty: "table__content_empty",
    Graph: "table__content_graph",
    Text: "table__content_text table__content_text_string",
    Number: "table__content_text table__content_text_numeric",
    LongText: "table__content_text table__content_text_string table__content_textArea",
    Dropdown: "table__content_text table__content_text_string table__content_dropdown",
    Status: "table__content_status",
    Pill: "table__content_pill",
    Icon: "table__content_icon",
    Flag: "table__content_icon",
    Checkbox: "table__content_check table__content_check_checkbox",
    Switch: "table__content_switch"
};

export const SortingIcons = {
    asc: ArrowUp,
    desc: ArrowDown,
    false: ArrowUpDown
};
