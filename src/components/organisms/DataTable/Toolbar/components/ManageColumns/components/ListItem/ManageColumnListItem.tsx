import React, { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column } from "@tanstack/react-table";

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
}

const ManageColumnListItem = <TData,>({
    column,
    checked,
    onChange,
    isPinnedDraft,
    onPinToggle
}: IManageColumnListItemProps<TData>) => {
    const { header } = column.columnDef;
    const headerText = typeof header === "string" ? header : "";

    const PinIconElement = isPinnedDraft ? PinFilled : Pin;

    const itemRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const el = itemRef.current;
        const dragHandle = dragHandleRef.current;
        if (!el || !dragHandle) return;

        combine(
            draggable({
                element: el,
                dragHandle,
                getInitialData: () => ({ id: column.id }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false)
            }),
            dropTargetForElements({
                element: el,
                getData: () => ({ id: column.id })
            })
        );
    }, [column.id]);

    if (!headerText) return null;

    return (
        <div
            ref={itemRef}
            className="manageColumnListItem"
            style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.2s ease" }}
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
                <div ref={dragHandleRef} style={{ cursor: "grab", display: "flex", alignItems: "center" }}>
                    <GripDots />
                </div>
            </div>
        </div>
    );
};

export default ManageColumnListItem;
