import React from "react";
import { Column, ColumnOrderState, ColumnPinningState } from "@tanstack/react-table";

// Components
import ManageColumns from "@components/organisms/DataTable/Toolbar/components/ManageColumns/ManageColumns";
import { ColumnVisibilityState, ManageColumnsConfig } from "@components/organisms/DataTable/types";

// Styles
import "./Toolbar.scss";

interface IToolbarProps<TData> {
    /**
     * An array of all leaf columns from the TanStack table instance.
     * These are the actual renderable columns passed down to the manage columns popover.
     */
    columns: Column<TData>[];
    /**
     * The current visibility state of the table's columns.
     * This state is used to determine which columns are visible and which are hidden.
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
     * Configuration object for managing columns.
     * This object allows fine-grained control over the visibility, order, and position of columns.
     */
    manageColumnsConfig: ManageColumnsConfig;
}

const Toolbar = <TData,>({
    columns,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning,
    columnOrder,
    defaultColumnOrder,
    onApplyColumnOrder,
    manageColumnsConfig
}: IToolbarProps<TData>) => {
    const { available: isManageColumnsAvailable, enabled: isManageColumnsEnabled } = manageColumnsConfig;
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
                    disabled={!isManageColumnsEnabled}
                    manageColumnsConfig={manageColumnsConfig}
                />
            </div>
        </div>
    );
};

export default Toolbar;
