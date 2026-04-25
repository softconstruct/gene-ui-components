import React from "react";
import { Column } from "@tanstack/react-table";

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
}

const ManageColumnListItem = <TData,>({ column, checked, onChange }: IManageColumnListItemProps<TData>) => {
    const { header } = column.columnDef;
    const headerText = typeof header === "string" ? header : "";

    if (!headerText) return null;

    return (
        <div className="manageColumnListItem">
            <Checkbox id={column.id} checked={checked} onChange={() => onChange(column)} />
            <Label text={headerText} labelFor={column.id} />
        </div>
    );
};

export default ManageColumnListItem;
