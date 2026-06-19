import React, { createContext, ReactNode, useContext } from "react";
import { Table } from "@tanstack/react-table";

import { ColumnVisibilityState, ManageColumnsConfig } from "./types";

interface IDataTableContext<TData> {
    table: Table<TData>;
    manageColumnsConfig: ManageColumnsConfig;
    initialColumnVisibility: ColumnVisibilityState;
}

const DataTableContext = createContext<IDataTableContext<object> | null>(null);

export const DataTableProvider = ({ children, value }: { children: ReactNode; value: IDataTableContext<object> }) => {
    return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>;
};

export const useDataTableContext = () => {
    const context = useContext(DataTableContext);
    if (!context) {
        throw new Error("useDataTableContext must be used within a DataTableProvider");
    }
    return context;
};
