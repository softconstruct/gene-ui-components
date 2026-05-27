import React, {
    ChangeEvent,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column, ColumnPinningState } from "@tanstack/react-table";
import classNames from "classnames";

import { Magnifier } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
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

    /**
     * Indicates whether there is an active searching value.
     */
    isSearchActive?: boolean;

    /**
     * Column visibility state used by the Manage Columns popover.
     * @default { left: [], right: [] }
     */
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
     * @param edge
     */
    onColumnReorder: (sourceId: string, destinationId: string, edge: string | null) => void;
    /**
     * Callback function triggered when keyboard reordering is performed.
     * @param sourceId
     * @param direction
     */
    onKeyboardReorder?: (sourceId: string, direction: "up" | "down") => void;
    /**
     * Callback function triggered when the save button is clicked.
     */
    onSave: () => void;
    /**
     * Callback function triggered when the cancel button is clicked.
     */
    onCancel: () => void;
    /**
     * Callback function triggered when the restore defaults button is clicked.
     */
    onRestoreDefaults: () => void;
    /**
     * Configuration object for managing columns.
     */
    manageColumnsConfig: ManageColumnsConfig;
    /**
     * Callback function triggered when the search clear button is clicked.
     */
    handleSearchClear: () => void;
    /**
     * Indicates whether all columns are checked.
     */
    allColumnsChecked: boolean;
    /**
     * Indicates whether the select-all checkbox is in an indeterminate state.
     */
    allColumnsIndeterminate: boolean;
    /**
     * Callback function triggered when the select-all checkbox is toggled.
     * @param checked
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
    onKeyboardReorder,
    onSave,
    onCancel,
    onRestoreDefaults,
    manageColumnsConfig,
    handleSearchClear,
    allColumnsChecked,
    allColumnsIndeterminate,
    onToggleAllColumns,
    isSearchActive
}: IManageColumnsPopoverProps<TData>) => {
    const hasColumns = columns.length > 0;
    const { loading, texts: manageColumnsTexts } = manageColumnsConfig;

    const [dropGap, setDropGap] = useState<{ targetId: string; edge: string } | null>(null);
    const dropGapRef = useRef(dropGap);
    dropGapRef.current = dropGap;

    const bodyRef = useRef<HTMLDivElement>(null);
    const [cachedBodyHeight, setCachedBodyHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        if (!isSearchActive && bodyRef.current) {
            setCachedBodyHeight(bodyRef.current.getBoundingClientRect().height);
        }
    }, [isSearchActive, columns]);

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

                if (gap) {
                    const sourceId = source.data.id as string;
                    const destId = gap.targetId;

                    if (sourceId && destId && sourceId !== destId) {
                        onColumnReorder(sourceId, destId, gap.edge);
                    }
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
            mobileHeightMode="fit"
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
                    autoFocus
                />
                <div
                    className="manageColumnsPopover__body"
                    ref={bodyRef}
                    style={{ minHeight: isSearchActive && cachedBodyHeight ? `${cachedBodyHeight}px` : undefined }}
                >
                    {hasColumns && (
                        <div className="manageColumnsPopover__selectAll">
                            <Checkbox
                                id="manageColumns-selectAll"
                                checked={allColumnsChecked}
                                indeterminate={allColumnsIndeterminate}
                                onChange={(e) => onToggleAllColumns(e.target.checked)}
                                className="manageColumnsPopover__selectAllCheckbox"
                                label={manageColumnsTexts?.selectAllColumns ?? "All Columns"}
                            />
                        </div>
                    )}
                    <Scrollbar className="manageColumnsPopover__scrollbar">
                        <div
                            className={classNames("manageColumnsPopover__list", {
                                "manageColumnsPopover__list--hasDropGap": dropGap !== null,
                                manageColumnsPopover__list_empty: !hasColumns
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
                                            onKeyboardReorder={onKeyboardReorder}
                                        />
                                    );
                                })
                            ) : (
                                <Empty
                                    appearance="noResult"
                                    className="manageColumnsPopover__empty"
                                    size="small"
                                    title={manageColumnsTexts?.noResultsFound ?? "No results found"}
                                    description={manageColumnsTexts?.noResultsFoundDescription}
                                />
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
                        {manageColumnsTexts?.restoreDefaultsButton ?? "Restore defaults"}
                    </Button>

                    <ButtonGroup size="medium" className="manageColumnsPopover__actions">
                        <Button disabled={loading} onClick={onCancel} size="medium" appearance="secondary">
                            {manageColumnsTexts?.cancelButton ?? "Cancel"}
                        </Button>
                        <Button
                            disabled={!hasChanges}
                            loading={loading}
                            onClick={onSave}
                            size="medium"
                            appearance="primary"
                        >
                            {manageColumnsTexts?.saveButton ?? "Save"}
                        </Button>
                    </ButtonGroup>
                </div>
            </PopoverBody>
        </Popover>
    );
};

export default ManageColumnsPopover;
