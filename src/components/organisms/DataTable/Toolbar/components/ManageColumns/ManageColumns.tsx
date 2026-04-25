import React, { useRef } from "react";
import { Column } from "@tanstack/react-table";

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
     * Button label used to display the popover.
     * @default "Manage columns"
     */
    label?: string;
    /**
     * Indicates whether the manage columns button should be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * TanStack runtime columns to be displayed in the popover.
     */
    columns?: Column<TData>[];
    /**
     * Current committed column visibility state.
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
     * Callback function triggered when the popover is toggled.
     */
    onToggle?: (open: boolean) => void;
    /**
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    texts?: ITableManageColumnsTexts;
}

const ManageColumns = <TData,>({
    label = "Manage columns",
    disabled = false,
    columns = [],
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
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
        openPopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleRestoreDefaults,
        handleToggleColumnVisibility
    } = useManageColumns<TData>({
        columns,
        columnVisibility,
        defaultColumnVisibility,
        onApplyColumnVisibility,
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
                {label}
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
                onSave={handleSave}
                onCancel={handleCancel}
                onRestoreDefaults={handleRestoreDefaults}
                texts={texts}
            />
        </>
    );
};

export default ManageColumns;
