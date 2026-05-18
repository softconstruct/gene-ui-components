import React, {
    ChangeEvent,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column, ColumnPinningState } from "@tanstack/react-table";
import classNames from "classnames";

import { Magnifier } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import CustomDragLayer from "@components/molecules/ActionableList/ActionableListItem/CustomDragLayer";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";
import ManageColumnListItem from "@components/organisms/DataTable/Toolbar/components/ManageColumns/components/ListItem/ManageColumnListItem";
import { ColumnVisibilityState, ManageColumnsConfig } from "@components/organisms/DataTable/types";

// Styles
import "./ManageColumnsPopover.scss";

interface IManageColumnsPopoverProps<TData> {
    /**
     * Determines whether the popover is currently open and visible.
     */
    open: boolean;
    /**
     * Indicates whether there are any changes made to the draft state.
     */
    hasChanges?: boolean;
    /**
     * Indicates whether the popover is in a default state (i.e., all checkboxes are checked).
     */
    isDefaultState?: boolean;
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
     * Configuration object for managing columns.
     * This object allows fine-grained control over the visibility, order, and position of columns.
     */
    manageColumnsConfig: ManageColumnsConfig;
    /**
     * Callback function triggered when the user clears the search input field.
     */
    handleSearchClear: () => void;
    /**
     * Indicates whether all columns are currently checked.
     */
    allColumnsChecked: boolean;
    /**
     * Indicates whether all columns are currently indeterminate (mixed state).
     */
    allColumnsIndeterminate: boolean;
    /**
     * Callback function triggered when the user toggles the "Select all" checkbox.
     * @param checked - Indicates whether the "Select all" checkbox is checked or not.
     */
    onToggleAllColumns: (checked: boolean) => void;
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
    isDefaultState,
    hasChanges,
    onColumnPinningChange,
    onColumnReorder,
    onSave,
    onCancel,
    onRestoreDefaults,
    manageColumnsConfig,
    handleSearchClear,
    allColumnsChecked,
    allColumnsIndeterminate,
    onToggleAllColumns
}: IManageColumnsPopoverProps<TData>) => {
    const hasColumns = columns.length > 0;
    const { loading, texts: manageColumnsTexts } = manageColumnsConfig;

    const [dropGap, setDropGap] = useState<{ targetId: string; edge: string } | null>(null);
    const dropGapRef = useRef(dropGap);
    dropGapRef.current = dropGap;

    const handleDragTargetChange = useCallback((targetId: string, edge: string | null) => {
        setDropGap((prev) => {
            if (edge === null) return prev;
            if (prev?.targetId === targetId && prev?.edge === edge) return prev;
            return { targetId, edge };
        });
    }, []);

    useEffect(() => {
        return monitorForElements({
            onDrop({ source }) {
                const gap = dropGapRef.current;
                setDropGap(null);

                if (!gap) return;

                const sourceId = source.data.id as string;
                const destId = gap.targetId;

                if (sourceId && destId && sourceId !== destId) {
                    onColumnReorder(sourceId, destId, gap.edge);
                }
            }
        });
    }, [onColumnReorder]);

    return (
        <Popover
            position="bottom-right"
            ref={popoverRef}
            withArrow={false}
            open={open}
            setProps={setProps}
            onClose={onClose}
            size="fitContent"
        >
            <PopoverBody withScrollbar={false} withPadding={false} className="manageColumnsPopover__main">
                <CustomDragLayer />
                <TextField
                    autoComplete="off"
                    placeholder={manageColumnsTexts?.searchPlaceholder ?? "Search"}
                    onChange={onSearch}
                    className="manageColumnsPopover__header"
                    disabled={loading}
                    IconBefore={Magnifier}
                    clearable
                    onClear={handleSearchClear}
                />
                <div className="manageColumnsPopover__body">
                    {hasColumns && (
                        <div className="manageColumnsPopover__selectAll">
                            <Checkbox
                                id="manageColumns-selectAll"
                                checked={allColumnsChecked}
                                indeterminate={allColumnsIndeterminate}
                                onChange={(e) => onToggleAllColumns(e.target.checked)}
                                className="manageColumnsPopover__selectAllCheckbox"
                            />
                            <Label
                                text={manageColumnsTexts?.selectAllColumnsText ?? "All Columns"}
                                labelFor="manageColumns-selectAll"
                            />
                        </div>
                    )}
                    <Scrollbar>
                        <div
                            className={classNames("manageColumnsPopover__list", {
                                "manageColumnsPopover__list--hasDropGap": dropGap !== null
                            })}
                        >
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
                                            dropGapEdge={dropGap?.targetId === column.id ? dropGap.edge : null}
                                            onDragTargetChange={(edge) => handleDragTargetChange(column.id, edge)}
                                        />
                                    );
                                })
                            ) : (
                                <Empty appearance="noResult" className="manageColumnsPopover__empty" size="small" />
                            )}
                        </div>
                    </Scrollbar>
                </div>
                <div className="manageColumnsPopover__footer">
                    <Button
                        disabled={loading || isDefaultState}
                        layout="text"
                        size="medium"
                        onClick={onRestoreDefaults}
                        appearance="secondary"
                    >
                        {manageColumnsTexts?.restoreDefaultsText ?? "Restore defaults"}
                    </Button>

                    <ButtonGroup size="medium" className="manageColumnsPopover__actions">
                        <Button disabled={loading} onClick={onCancel} size="medium" appearance="secondary">
                            {manageColumnsTexts?.cancelText ?? "Cancel"}
                        </Button>
                        <Button
                            disabled={!hasChanges}
                            loading={loading}
                            onClick={onSave}
                            size="medium"
                            appearance="primary"
                        >
                            {manageColumnsTexts?.saveText ?? "Save"}
                        </Button>
                    </ButtonGroup>
                </div>
            </PopoverBody>
        </Popover>
    );
};

export default ManageColumnsPopover;
