import React, { createContext, useContext } from "react";
import { Table } from "@tanstack/react-table";

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
