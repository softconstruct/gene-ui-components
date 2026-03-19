import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";

// Styles
import "./TableHeaderCell.scss";

/**
 * Props for the {@link TableHeaderCell} component.
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this column.
 */
interface ITableHeaderCellProps<TData, TValue> {
    /**
     * The TanStack Table header instance.
     * Contains the column definition, context data, and structural information
     * (like whether this specific cell is a placeholder in a grouped header setup).
     */
    header: Header<TData, TValue>;
}

/**
 * Renders an individual table header cell (`<th>`).
 * * This component checks if the header is a structural placeholder (used in complex,
 * multi-row header groups). If it is a placeholder, it renders empty content.
 * Otherwise, it uses TanStack Table's `flexRender` utility to display the defined header UI.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this column.
 * @param props - The properties for the component.
 * @returns A table header cell element containing the rendered column header, or an empty cell if it's a placeholder.
 */
const TableHeaderCell = <TData, TValue>({ header }: ITableHeaderCellProps<TData, TValue>) => (
    <th
        className="tableHeaderCell"
        style={{
            width: header.getSize(),
            minWidth: header.getSize()
        }}
    >
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
);

export default TableHeaderCell;
