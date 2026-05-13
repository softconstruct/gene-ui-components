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

    /**
     * The initial or default column order state of the table.
     * Used by the child components to restore columns to their original state.
     */
    columnOrder: ColumnOrderState;
    /**
     * Callback function triggered when the user commits a new column order state.
     * @param nextOrder
     */
    defaultColumnOrder: ColumnOrderState;
    /**
     * Callback function triggered when the user commits a new column order state.
     * @param nextOrder
     */
    onApplyColumnOrder: (nextOrder: ColumnOrderState) => void;
    /**
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    manageColumnsTexts?: ITableManageColumnsTexts;
    /**
     * Indicates whether the Manage Columns feature is available.
     * If false, the toolbar will not render the Manage Columns button.
     */
    isManageColumnsAvailable?: boolean;
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
    manageColumnsTexts,
    isManageColumnsAvailable
}: IToolbarProps<TData>) => {
    if (!isManageColumnsAvailable) return null;
    return (
        <div className="tableToolbar">
            <div className="tableToolbar__actions">
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
        </div>
    );
};

export default Toolbar;
