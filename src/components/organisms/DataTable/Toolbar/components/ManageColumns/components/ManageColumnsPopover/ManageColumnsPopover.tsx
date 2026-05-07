import React, { ChangeEvent, Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { Column, ColumnPinningState } from "@tanstack/react-table";

import Button from "@components/atoms/Button";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";
import ManageColumnListItem from "@components/organisms/DataTable/Toolbar/components/ManageColumns/components/ListItem/ManageColumnListItem";
import { ColumnVisibilityState, ITableManageColumnsTexts } from "@components/organisms/DataTable/types";

// Styles
import "./ManageColumnsPopover.scss";

interface IManageColumnsPopoverProps<TData> {
    /**
     * Determines whether the popover is currently open and visible.
     */
    open: boolean;
    /**
     * Callback function triggered when the popover requests to be closed
     * (e.g., by pressing the escape key or clicking outside).
     */
    onClose: () => void;
    /**
     * Reference to the popover's internal elements, used for positioning
     * and detecting outside clicks.
     */
    popoverRef: RefObject<IPopoverRef>;
    /**
     * State setter function for injecting dynamic properties into the Popover component
     * (managed by the `useManageColumns` hook).
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * Callback function triggered when the user types in the search input field.
     * @param e - The change event from the input element.
     */
    onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     * The array of filtered TanStack Table columns to be displayed in the list.
     */
    columns: Column<TData>[];

    draftVisibility: ColumnVisibilityState;
    /**
     * Callback function triggered when a user toggles the checkbox for a specific column.
     * @param column - The column instance whose visibility is being toggled.
     */
    onColumnVisibilityChange: (column: Column<TData>) => void;

    /**
     * Column pinning state used by the Manage Columns popover.
     * @default { left: [], right: [] }
     */
    draftPinning: ColumnPinningState;
    /**
     * Callback function triggered when a user toggles the pinning state of a column.
     * @param column
     */
    onColumnPinningChange: (column: Column<TData>) => void;

    /**
     * Callback function triggered when a user reorders columns by dragging and dropping them.
     * @param sourceId
     * @param destinationId
     */
    onColumnReorder: (sourceId: string, destinationId: string, edge: string | null) => void;
    /**
     * Callback function triggered when the user clicks the "Save" button.
     * Applies the draft changes to the actual table state.
     */
    onSave: () => void;
    /**
     * Callback function triggered when the user clicks the "Cancel" button.
     * Discards any draft changes and closes the popover.
     */
    onCancel: () => void;
    /**
     * Callback function triggered when the user clicks the "Restore defaults" button.
     * Resets the checkboxes inside the popover to their initial default visibility state.
     */
    onRestoreDefaults: () => void;
    /**
     * An object with text labels for the Manage Columns popover.
     * Use this to customize or localize the button texts.
     */
    texts?: ITableManageColumnsTexts;
}

const ManageColumnsPopover = <TData,>({
    open,
    onClose,
    popoverRef,
    setProps,
    onSearch,
    columns,
    draftVisibility,
    onColumnVisibilityChange,
    draftPinning,
    onColumnPinningChange,
    onColumnReorder,
    onSave,
    onCancel,
    onRestoreDefaults,
    texts
}: IManageColumnsPopoverProps<TData>) => {
    const hasColumns = columns.length > 0;

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const sourceId = source.data.id as string;
                const destId = destination.data.id as string;

                const closestEdgeOfTarget = extractClosestEdge(destination.data);

                if (sourceId && destId && sourceId !== destId) {
                    onColumnReorder(sourceId, destId, closestEdgeOfTarget);
                }
            }
        });
    }, [onColumnReorder]);

    return (
        <Popover ref={popoverRef} withArrow={false} open={open} setProps={setProps} onClose={onClose}>
            <PopoverBody withScrollbar={false} withPadding={false} className="manageColumnsPopover__main">
                <TextField
                    autoComplete="off"
                    placeholder={texts?.searchPlaceholder ?? "Search"}
                    onChange={onSearch}
                    className="manageColumnsPopover__header"
                />
                <div className="manageColumnsPopover__body">
                    <Scrollbar>
                        <div className="manageColumnsPopover__list">
                            {hasColumns ? (
                                columns.map((column) => {
                                    const isPinnedDraft = (draftPinning.left || []).includes(column.id);
                                    return (
                                        <ManageColumnListItem
                                            key={column.id}
                                            column={column}
                                            checked={draftVisibility[column.id] ?? true}
                                            isPinnedDraft={isPinnedDraft}
                                            onPinToggle={onColumnPinningChange}
                                            onChange={onColumnVisibilityChange}
                                        />
                                    );
                                })
                            ) : (
                                <Empty appearance="noResult" />
                            )}
                        </div>
                    </Scrollbar>
                </div>
                <div className="manageColumnsPopover__footer">
                    <Button layout="text" size="medium" onClick={onRestoreDefaults} appearance="secondary">
                        {texts?.restoreDefaultsText ?? "Restore defaults"}
                    </Button>

                    <ButtonGroup size="medium" className="manageColumnsPopover__actions">
                        <Button onClick={onCancel} size="medium" appearance="secondary">
                            Cancel
                        </Button>
                        <Button onClick={onSave} size="medium" appearance="primary">
                            Save
                        </Button>
                    </ButtonGroup>
                </div>
            </PopoverBody>
        </Popover>
    );
};

export default ManageColumnsPopover;
