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
    row: Omit<Row<TData>, "original"> & {
        original: Row<TData>["original"] & {
            expandedRow?: ReactNode;
        };
    };
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
    return (
        <>
            <tr className="tableRow">
                {row.getVisibleCells().map((cell: Cell<any, any>) => (
                    <TableBodyCell key={cell.id} cell={cell} />
                ))}
            </tr>
            {row.getIsExpanded() && row.original.expandedRow && (
                <tr className="tableRow">
                    <td colSpan={row.getVisibleCells().length} className="tableBodyCell">
                        {row.original.expandedRow}
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;
