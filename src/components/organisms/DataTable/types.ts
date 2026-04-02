import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/table-core";

export interface ITableNoDataTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
}

export type TableColumn<T> = ColumnDef<T extends object ? T : never> & {
    expandedData?: ReactNode;
};
