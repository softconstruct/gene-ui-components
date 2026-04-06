import React, { ReactNode } from "react";
import { Cell } from "@tanstack/react-table";
import { Row } from "@tanstack/table-core";

// Components
import TableBodyCell from "@components/organisms/DataTable/TableBody/Cell/TableBodyCell";

// Styles
import "./TableRow.scss";

/**
 * Props for the {@link TableRow} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableRowProps<TData> {
    /**
     * The TanStack Table row instance.
     * Provides access to row-level data and internal methods, such as retrieving
     * the visible cells to be rendered within this specific row.
     */
    row: Row<TData>;
}

const hasExpandedRow = (value: unknown): value is { expandedRow?: ReactNode } => {
    return typeof value === "object" && value !== null && "expandedRow" in value;
};

/**
 * Renders an individual table row (`<tr>`).
 * * This component iterates through all visible cells for the provided row instance
 * and delegates the rendering of each specific cell to the {@link TableBodyCell} component.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns A table row element containing its respective rendered cells.
 */
const TableRow = <TData,>({ row }: ITableRowProps<TData>) => {
    const expandedRow = hasExpandedRow(row.original) ? row.original.expandedRow : undefined;

    return (
        <>
            <tr className="tableRow">
                {row.getVisibleCells().map((cell: Cell<any, any>) => (
                    <TableBodyCell key={cell.id} cell={cell} />
                ))}
            </tr>
            {row.getIsExpanded() && expandedRow && (
                <tr className="tableRow">
                    <td colSpan={row.getVisibleCells().length} className="tableBodyCell">
                        {expandedRow}
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;
