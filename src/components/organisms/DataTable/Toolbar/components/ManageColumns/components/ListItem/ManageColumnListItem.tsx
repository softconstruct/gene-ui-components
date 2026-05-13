import React, { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { Column } from "@tanstack/react-table";
import classNames from "classnames";

import { GripDots, Pin, PinFilled } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./ManageColumnListItem.scss";

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
}

const ManageColumnListItem = <TData,>({
    column,
    checked,
    onChange,
    isPinnedDraft,
    onPinToggle,
    dropGapEdge = null,
    onDragTargetChange
}: IManageColumnListItemProps<TData>) => {
    const { header } = column.columnDef;
    const headerText = typeof header === "string" ? header : "";

    const PinIconElement = isPinnedDraft ? PinFilled : Pin;

    const itemRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const onDragTargetChangeRef = useRef(onDragTargetChange);

    const [isDragging, setIsDragging] = useState(false);

    onDragTargetChangeRef.current = onDragTargetChange;

    const computeEdge = (clientY: number): string => {
        const rowEl = itemRef.current;
        if (!rowEl) return "bottom";
        const { top, height } = rowEl.getBoundingClientRect();
        return clientY < top + height / 2 ? "top" : "bottom";
    };

    useEffect(() => {
        const el = itemRef.current;
        const dragHandle = dragHandleRef.current;
        if (!el || !dragHandle) return;

        combine(
            draggable({
                element: el,
                dragHandle,
                getInitialData: () => {
                    const rect = el.getBoundingClientRect();
                    const clone = el.cloneNode(true) as HTMLElement;

                    clone.classList.remove("manageColumnListItem_dragging");
                    clone.classList.add("manageColumnListItem_dragPreview");

                    Object.assign(clone.style, {
                        width: `${rect.width}px`,
                        height: `${rect.height}px`
                    });

                    return {
                        id: column.id,
                        previewNode: clone,
                        initialRect: rect
                    };
                },
                onGenerateDragPreview: ({ nativeSetDragImage }) => {
                    disableNativeDragPreview({ nativeSetDragImage });
                },
                onDragStart: () => {
                    setIsDragging(true);
                    preventUnhandled.start();
                },
                onDrop: () => {
                    setIsDragging(false);
                    preventUnhandled.stop();
                }
            }),
            dropTargetForElements({
                element: el,
                canDrop: ({ source }) => source.data.id !== column.id,
                getData: () => ({ id: column.id }),
                onDragEnter: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                },
                onDrag: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                }
            })
        );
    }, [column.id]);

    if (!headerText) return null;

    return (
        <div
            ref={itemRef}
            className={classNames("manageColumnListItem", {
                manageColumnListItem_dragging: isDragging,
                manageColumnListItem_dropGapTop: dropGapEdge === "top",
                manageColumnListItem_dropGapBottom: dropGapEdge === "bottom"
            })}
        >
            <div className="manageColumnListItem__content">
                <Checkbox
                    id={column.id}
                    checked={checked}
                    onChange={() => onChange(column)}
                    className="manageColumnListItem__checkbox"
                />
                <Label text={headerText} labelFor={column.id} />
            </div>
            <div className="manageColumnListItem__actions">
                <PinIconElement onClick={() => onPinToggle(column)} style={{ cursor: "pointer" }} />
                <div ref={dragHandleRef} className="manageColumnListItem__dragHandle">
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
