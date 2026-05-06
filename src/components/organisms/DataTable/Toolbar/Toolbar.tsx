import React from "react";
import { ColumnPinningState } from "@tanstack/react-table";
import { Column } from "@tanstack/table-core";

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
    /**
     * The current, committed visibility state of the table's columns.
     */
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
    /**
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    manageColumnsTexts?: ITableManageColumnsTexts;
    /**
     * The current column pinning state of the table.
     */
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
}

const Toolbar = <TData,>({
    columns,
    isManageColumnsEnabled,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    manageColumnsTexts,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning
}: IToolbarProps<TData>) => {
    return (
        <div className="tableToolbar">
            <ManageColumns
                columns={columns}
                columnVisibility={columnVisibility}
                defaultColumnVisibility={defaultColumnVisibility}
                onApplyColumnVisibility={onApplyColumnVisibility}
                texts={manageColumnsTexts}
                disabled={!isManageColumnsEnabled}
                columnPinning={columnPinning}
                defaultColumnPinning={defaultColumnPinning}
                onApplyColumnPinning={onApplyColumnPinning}
            />
        </div>
    );
};

export default Toolbar;
