import React from "react";
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
}

const Toolbar = <TData,>({
    columns,
    isManageColumnsEnabled,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    manageColumnsTexts
}: IToolbarProps<TData>) => {
    const shouldRenderToolbar = isManageColumnsEnabled;

    if (!shouldRenderToolbar) return null;

    return (
        <div className="tableToolbar">
            <ManageColumns
                columns={columns}
                columnVisibility={columnVisibility}
                defaultColumnVisibility={defaultColumnVisibility}
                onApplyColumnVisibility={onApplyColumnVisibility}
                texts={manageColumnsTexts}
            />
        </div>
    );
};

export default Toolbar;
