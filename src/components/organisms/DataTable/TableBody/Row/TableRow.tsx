import React from "react";
import { Row } from "@tanstack/table-core";

import { hasExpandedRow } from "@components/organisms/DataTable/helper";
// Components
import TableBodyCell from "@components/organisms/DataTable/TableBody/Cell/TableBodyCell";
import TableExpandedRow from "@components/organisms/DataTable/TableBody/Row/TableExpandedRow";

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
    const isRowExpanded = row.getIsExpanded() && expandedRow;

    return (
        <>
            <tr className="tableRow">
                {row.getVisibleCells().map((cell) => (
                    <TableBodyCell key={cell.id} cell={cell} />
                ))}
            </tr>
            {isRowExpanded && <TableExpandedRow colspan={row.getVisibleCells().length}>{expandedRow}</TableExpandedRow>}
        </>
    );
};

export default TableRow;
