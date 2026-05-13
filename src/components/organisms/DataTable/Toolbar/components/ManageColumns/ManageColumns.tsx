import React, { useRef } from "react";
import { Column, ColumnOrderState, ColumnPinningState } from "@tanstack/react-table";

import { Gear } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IPopoverRef } from "@components/atoms/Popover";
// Hooks
import { useManageColumns } from "@components/organisms/DataTable/hooks/useManageColumns";
import ManageColumnsPopover from "@components/organisms/DataTable/Toolbar/components/ManageColumns/components/ManageColumnsPopover/ManageColumnsPopover";
// Types
import { ColumnVisibilityState, ITableManageColumnsTexts } from "@components/organisms/DataTable/types";

import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./ManageColumns.scss";

interface IManageColumnsProps<TData> {
    /**
     * TanStack runtime columns to be displayed in the popover.
     */
    columns?: Column<TData>[];

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
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    texts?: ITableManageColumnsTexts;
    /**
     * Indicates whether the manage columns button should be disabled.
     * @default false
     */
    disabled?: boolean;
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
    texts
}: IManageColumnsProps<TData>) => {
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const {
        popoverOpen,
        propsForPopover,
        setPropsForPopover,
        columnsToRender,

        draftVisibility,
        draftPinning,

        openPopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleRestoreDefaults,
        handleToggleColumnVisibility,
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
        onToggle
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
                {texts?.buttonText ?? "Manage columns"}
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
                texts={texts}
            />
        </>
    );
};

export default ManageColumns;
