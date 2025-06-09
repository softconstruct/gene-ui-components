import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";

export type TableCol<T> = ColumnDef<T extends object ? T : never> & {
    header: () => ReactNode;
    footer?: () => ReactNode;
    type: string;
    withCheckbox: boolean;
    sortable?: boolean;
    editable?: boolean;
    copyable?: boolean;
    columns?: TableCol<any>[];
};

export type RowActions = {
    pin: (rowId: string) => void;
    tag: (rowId: string) => void;
    clock: (rowId: string) => void;
    reload: (rowId: string) => void;
    copy: (rowId: string) => void;
    download: (rowId: string) => void;
    show: (rowId: string) => void;
    delete: (rowId: string) => void;
};
