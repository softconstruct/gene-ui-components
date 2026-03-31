import React from "react";
import { Cell, flexRender } from "@tanstack/react-table";

// Styles
import "./TableBodyCell.scss";

/**
 * Props for the {@link TableBodyCell} component.
 * * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 */
interface ITableBodyCellProps<TData, TValue> {
    /**
     * The TanStack Table cell instance.
     * Contains the cell's value, rendering logic, and context data
     * required by `flexRender` to accurately display the cell contents.
     */
    cell: Cell<TData, TValue>;
}

/**
 * Renders an individual table body cell (`<td>`).
 * * This component acts as a wrapper that uses TanStack Table's `flexRender`
 * utility to evaluate and render the appropriate content based on the
 * specific column definitions.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 * @param props - The properties for the component.
 * @returns A table cell element with the rendered content.
 */
const TableBodyCell = <TData, TValue>({ cell }: ITableBodyCellProps<TData, TValue>) => {
    return (
        <td
            className="tableBodyCell"
            style={{
                width: cell.column.getSize(),
                minWidth: cell.column.getSize()
            }}
        >
            <div className="tableBodyCell__content">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
        </td>
    );
};

export default TableBodyCell;
