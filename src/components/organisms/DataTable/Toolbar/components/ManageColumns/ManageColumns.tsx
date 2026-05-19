import React, { useRef } from "react";
import { Column, ColumnOrderState, ColumnPinningState } from "@tanstack/react-table";

import { Gear } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IPopoverRef } from "@components/atoms/Popover";
import { useManageColumns } from "@components/organisms/DataTable/hooks/useManageColumns";
import ManageColumnsPopover from "@components/organisms/DataTable/Toolbar/components/ManageColumns/components/ManageColumnsPopover/ManageColumnsPopover";
// Types
import { ColumnVisibilityState, ManageColumnsConfig } from "@components/organisms/DataTable/types";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

interface IManageColumnsProps<TData> {
    /**
     * TanStack runtime columns to be displayed in the popover.
     */
    columns?: Column<TData>[];

    /**
     * Column visibility state used by the Manage Columns popover.
     * @default {}
     */
    columnVisibility: ColumnVisibilityState;
    /**
     * Initial/default column visibility state used by Restore defaults.
     */
    defaultColumnVisibility: ColumnVisibilityState;
    /**
     * Applies draft visibility to the actual table state.
     */
    onApplyColumnVisibility: (nextVisibility: ColumnVisibilityState) => void;

    /**
     * Column pinning state used by the Manage Columns popover.
     * @default { left: [], right: [] }
     */
    columnPinning: ColumnPinningState;
    /**
     * Initial/default column pinning state used by Restore defaults.
     */
    defaultColumnPinning: ColumnPinningState;
    /**
     * Applies draft pinning to the actual table state.
     * @param nextPinning
     */
    onApplyColumnPinning: (nextPinning: ColumnPinningState) => void;

    /**
     * Column order state used by the Manage Columns popover.
     * @default []
     */
    columnOrder: ColumnOrderState;
    /**
     * Initial/default column order state used by Restore defaults.
     */
    defaultColumnOrder: ColumnOrderState;
    /**
     * Applies draft order to the actual table state.
     * @param nextOrder
     */
    onApplyColumnOrder: (nextOrder: ColumnOrderState) => void;

    /**
     * Callback function triggered when the popover is opened or closed.
     * @param open
     */
    onToggle?: (open: boolean) => void;
    /**
     * Indicates whether the manage columns button should be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Configuration object for managing columns.
     * This object allows fine-grained control over the visibility, order, and position of columns.
     */
    manageColumnsConfig: ManageColumnsConfig;
}

const ManageColumns = <TData,>({
    disabled = false,
    columns = [],
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning,
    columnOrder,
    defaultColumnOrder,
    onApplyColumnOrder,
    onToggle,
    manageColumnsConfig
}: IManageColumnsProps<TData>) => {
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const { texts: manageColumnsTexts } = manageColumnsConfig;

    const {
        popoverOpen,
        propsForPopover,
        setPropsForPopover,
        columnsToRender,

        draftVisibility,
        draftPinning,

        allColumnsChecked,
        allColumnsIndeterminate,

        hasChanges,
        isDefaultState,

        openPopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleSearchClear,
        handleRestoreDefaults,
        handleToggleColumnVisibility,
        handleToggleAllColumnsVisibility,
        handleToggleColumnPinning,
        handleColumnReorder
    } = useManageColumns<TData>({
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
        onToggle,
        manageColumnsConfig
    });

    useClickOutside(() => {
        if (popoverOpen) {
            handleCancel();
        }
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    return (
        <>
            <Button
                disabled={disabled}
                onClick={openPopover}
                Icon={Gear}
                appearance="secondary"
                layout="outline"
                size="medium"
                {...propsForPopover}
            >
                {manageColumnsTexts?.buttonText ?? "Manage columns"}
            </Button>

            <ManageColumnsPopover
                popoverRef={popoverRef}
                setProps={setPropsForPopover}
                open={popoverOpen}
                onClose={handleCancel}
                onSearch={handleSearch}
                columns={columnsToRender}
                draftVisibility={draftVisibility}
                onColumnVisibilityChange={handleToggleColumnVisibility}
                draftPinning={draftPinning}
                onColumnPinningChange={handleToggleColumnPinning}
                onColumnReorder={handleColumnReorder}
                onSave={handleSave}
                onCancel={handleCancel}
                onRestoreDefaults={handleRestoreDefaults}
                manageColumnsConfig={manageColumnsConfig}
                handleSearchClear={handleSearchClear}
                allColumnsChecked={allColumnsChecked}
                allColumnsIndeterminate={allColumnsIndeterminate}
                onToggleAllColumns={handleToggleAllColumnsVisibility}
                hasChanges={hasChanges}
                isDefaultState={isDefaultState}
            />
        </>
    );
};

export default ManageColumns;
