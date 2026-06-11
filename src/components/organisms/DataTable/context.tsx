import React, { createContext, useContext } from "react";
import { Table } from "@tanstack/react-table";

import { useManageColumns } from "./hooks/useManageColumns";
import { ColumnVisibilityState, ManageColumnsConfig } from "./types";

interface IDataTableContext<TData> {
    table: Table<TData>;
    manageColumnsConfig: ManageColumnsConfig;
    initialColumnVisibility: ColumnVisibilityState;
}

const DataTableContext = createContext<IDataTableContext<unknown> | null>(null);

export const DataTableProvider = <TData,>({
    children,
    value
}: {
    children: React.ReactNode;
    value: IDataTableContext<TData>;
}) => {
    return (
        <DataTableContext.Provider value={value as unknown as IDataTableContext<unknown>}>
            {children}
        </DataTableContext.Provider>
    );
};

export const useDataTableContext = <TData,>() => {
    const context = useContext(DataTableContext);
    if (!context) {
        throw new Error("useDataTableContext must be used within a DataTableProvider");
    }
    return context as unknown as IDataTableContext<TData>;
};

type UseManageColumnsReturnType<TData> = ReturnType<typeof useManageColumns<TData>>;
const ManageColumnsContext = createContext<UseManageColumnsReturnType<unknown> | null>(null);

export const ManageColumnsProvider = <TData,>({
    children,
    value
}: {
    children: React.ReactNode;
    value: UseManageColumnsReturnType<TData>;
}) => {
    return (
        <ManageColumnsContext.Provider value={value as unknown as UseManageColumnsReturnType<unknown>}>
            {children}
        </ManageColumnsContext.Provider>
    );
};

export const useManageColumnsContext = <TData,>() => {
    const context = useContext(ManageColumnsContext);
    if (!context) {
        throw new Error("useManageColumnsContext must be used within a ManageColumnsProvider");
    }
    return context as unknown as UseManageColumnsReturnType<TData>;
};
