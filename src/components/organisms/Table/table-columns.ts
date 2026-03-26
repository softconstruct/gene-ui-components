import type { Row as RowData } from "@tanstack/react-table";
import type { JSX, ReactElement } from "react";

import type { IconProps } from "@geneui/icons";

import type { IPillProps } from "@components/atoms/Pill";

import type { BaseTableColumn, CellType, Row } from "./types";

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
