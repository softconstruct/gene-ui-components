import { ColumnDef } from "@tanstack/table-core";

export interface ITableNoDataTexts {
    noDataAvailableTitle?: string;
    noDataAvailableText?: string;
}

export type TableColumn<T> = ColumnDef<T extends object ? T : never> & {
    subRows?: TableColumn<T>[];
};
