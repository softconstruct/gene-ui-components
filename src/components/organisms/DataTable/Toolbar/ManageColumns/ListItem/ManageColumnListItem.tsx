import React, { KeyboardEvent } from "react";
import { Column } from "@tanstack/react-table";
import classNames from "classnames";

import { GripDots, Pin, PinFilled } from "@geneui/icons";

// Components
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./ManageColumnListItem.scss";

// Hooks
import { useColumnListItemDnD } from "./useListItemDnD";

interface IManageColumnListItemProps<TData> {
    /**
     * The TanStack Table column instance to be displayed in the list item.
     * Contains the column definition, including the header text used for the label.
     */
    column: Column<TData>;
    /**
     * Indicates whether the column is currently selected (visible in the table).
     */
    checked: boolean;
    /**
     * Indicates whether the list item should be in a disabled state.
     */
    disabled?: boolean;
    /**
     * Callback function triggered when the checkbox state is toggled.
     * @param column - The column instance whose visibility state is being changed.
     */
    onChange: (column: Column<TData>) => void;
    /**
     * Indicates whether the column is currently pinned in the table.
     */
    isPinnedDraft: boolean;
    /**
     * Callback function triggered when the pin icon is clicked.
     * @param column
     */
    onPinToggle: (column: Column<TData>) => void;
    /**
     * The edge of the list item where the drop gap will appear.
     * Can be either "top" or "bottom", indicating the position above or below the list item.
     * If null, the drop gap will not be displayed.
     */
    dropGapEdge?: string | null;
    /**
     * Callback function triggered when the drag target changes.
     * @param edge
     */
    onDragTargetChange?: (edge: string | null) => void;
    /**
     * Indicates whether the list has a drop gap.
     */
    hasDropGap?: boolean;
}

const ManageColumnListItem = <TData,>({
    column,
    checked,
    disabled,
    onChange,
    isPinnedDraft,
    onPinToggle,
    dropGapEdge = null,
    onDragTargetChange,
    hasDropGap
}: IManageColumnListItemProps<TData>) => {
    const { header } = column.columnDef;
    const headerText = typeof header === "string" ? header : "";
    const PinIconElement = isPinnedDraft ? PinFilled : Pin;

    const { itemRef, dragHandleRef, isDragging } = useColumnListItemDnD({
        columnId: column.id,
        onDragTargetChange
    });

    const onPinKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPinToggle(column);
        }
    };

    if (!headerText) return null;

    return (
        <div
            ref={itemRef}
            className={classNames("manageColumnListItem", `manageColumnListItem__drop-gap-${dropGapEdge}`, {
                manageColumnListItem_dragging: isDragging,
                manageColumnListItem_collapsed: isDragging && hasDropGap
            })}
        >
            <div className="manageColumnListItem__content">
                <Checkbox
                    id={column.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onChange(column)}
                    className="manageColumnListItem__checkbox"
                    label={headerText}
                />
            </div>
            <div className="manageColumnListItem__actions">
                <div
                    className="manageColumnListItem__pinAction"
                    onClick={() => onPinToggle(column)}
                    tabIndex={0}
                    role="button"
                    aria-label={isPinnedDraft ? "Unpin column" : "Pin column"}
                    onKeyDown={onPinKeyDown}
                >
                    <PinIconElement />
                </div>
                <div ref={dragHandleRef} className="manageColumnListItem__dragHandle" tabIndex={0} role="button">
                    <GripDots
                        className={classNames("manageColumnListItem__dragIcon", {
                            manageColumnListItem__dragIcon_dragging: isDragging
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageColumnListItem;
