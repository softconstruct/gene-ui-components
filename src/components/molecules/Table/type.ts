import { ColumnDef } from "@tanstack/react-table";

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    sortable?: boolean;
    editable?: boolean;
    copyable?: boolean;
};
