import React from "react";
import { Column, ColumnOrderState, ColumnPinningState } from "@tanstack/react-table";

// Components
import ManageColumns from "@components/organisms/DataTable/Toolbar/components/ManageColumns/ManageColumns";
import { ColumnVisibilityState, ITableManageColumnsTexts } from "@components/organisms/DataTable/types";

// Styles
import "./Toolbar.scss";

interface IToolbarProps<TData> {
    /**
     * An array of all leaf columns from the TanStack table instance.
     * These are the actual renderable columns passed down to the manage columns popover.
     */
    columns: Column<TData>[];
    /**
     * Determines whether the "Manage columns" feature is enabled.
     * If false, the toolbar will not render any column management UI.
     */
    isManageColumnsEnabled: boolean;

    columnVisibility: ColumnVisibilityState;
    /**
     * The initial or default visibility state of the table's columns.
     * Used by the child components to restore columns to their original state.
     */
    defaultColumnVisibility: ColumnVisibilityState;
    /**
     * Callback function triggered when the user commits a new column visibility state.
     * @param nextVisibility - The new visibility state to be applied to the table.
     */
    onApplyColumnVisibility: (nextVisibility: ColumnVisibilityState) => void;

    columnPinning: ColumnPinningState;
    /**
     * The initial or default column pinning state of the table.
     * Used by the child components to restore columns to their original state.
     */
    defaultColumnPinning: ColumnPinningState;
    /**
     * Callback function triggered when the user commits a new column pinning state.
     * @param nextPinning
     */
    onApplyColumnPinning: (nextPinning: ColumnPinningState) => void;

    columnOrder: ColumnOrderState;
    defaultColumnOrder: ColumnOrderState;
    onApplyColumnOrder: (nextOrder: ColumnOrderState) => void;

    manageColumnsTexts?: ITableManageColumnsTexts;
}

const Toolbar = <TData,>({
    columns,
    isManageColumnsEnabled,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning,
    columnOrder,
    defaultColumnOrder,
    onApplyColumnOrder,
    manageColumnsTexts
}: IToolbarProps<TData>) => {
    return (
        <div className="tableToolbar">
            <ManageColumns
                columns={columns}
                columnVisibility={columnVisibility}
                defaultColumnVisibility={defaultColumnVisibility}
                onApplyColumnVisibility={onApplyColumnVisibility}
                columnPinning={columnPinning}
                defaultColumnPinning={defaultColumnPinning}
                onApplyColumnPinning={onApplyColumnPinning}
                columnOrder={columnOrder}
                defaultColumnOrder={defaultColumnOrder}
                onApplyColumnOrder={onApplyColumnOrder}
                texts={manageColumnsTexts}
                disabled={!isManageColumnsEnabled}
            />
        </div>
    );
};

export default Toolbar;
