import React from "react";
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

    if (!headerText) return null;

    return (
        <div className="manageColumnListItem">
            <div className="manageColumnListItem__content">
                <Checkbox id={column.id} checked={checked} onChange={() => onChange(column)} className="manageColumnListItem__checkbox" />
                <Label text={headerText} labelFor={column.id} />
            </div>
            <div className="manageColumnListItem__actions">
                <PinIconElement onClick={() => onPinToggle(column)} />
                <GripDots />
            </div>
        </div>
    );
};

export default ManageColumnListItem;
