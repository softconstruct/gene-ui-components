import React, { Context, createContext, Provider, ReactNode, useContext } from "react";
import { ColumnPinningState, Table } from "@tanstack/react-table";

import { ColumnVisibilityState, ResolvedManageColumnsConfig } from "./types";

export interface IDataTableContext<TData> {
    table: Table<TData>;
    manageColumnsConfig: ResolvedManageColumnsConfig;
    initialColumnVisibility: ColumnVisibilityState;
    initialColumnPinning: ColumnPinningState;
    dirMode: string;
}

const DataTableContext = createContext<IDataTableContext<unknown> | null>(null);

interface IDataTableProviderProps<TData> {
    children: ReactNode;
    value: IDataTableContext<TData>;
}

export const DataTableProvider = <TData,>({ children, value }: IDataTableProviderProps<TData>) => {
    const DataTableContextProvider = DataTableContext.Provider as Provider<IDataTableContext<TData> | null>;
    return <DataTableContextProvider value={value}>{children}</DataTableContextProvider>;
};

export const useDataTableContext = <TData,>() => {
    const TableContext = DataTableContext as Context<IDataTableContext<TData> | null>;
    const context = useContext(TableContext);

    if (!context) {
        throw new Error("useDataTableContext must be used within a DataTableProvider");
    }

    return context;
};

/**
 * Rendered width (px) of the column a body cell belongs to.
 * Provided by every body cell so that the default cell renderer can re-check its
 * truncation when the column changes width — it is rendered through TanStack's
 * `flexRender`, so it cannot receive the width as a prop.
 */
export const CellWidthContext = createContext<number | undefined>(undefined);

export const useCellWidth = () => useContext(CellWidthContext);
