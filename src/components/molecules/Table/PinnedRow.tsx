import React, { ReactNode } from "react";
import { flexRender, Row, Table } from "@tanstack/react-table";

const PinnedRow = ({
    row,
    table
}: {
    row: Row<any>;
    table: Table<Record<string, string | ReactNode | Record<string, string>>>;
}) => {
    return (
        <tr
            style={{
                backgroundColor: "lightblue",
                position: "sticky",
                top: row.getIsPinned() === "top" ? `${row.getPinnedIndex() * 26 + 48}px` : undefined,
                bottom:
                    row.getIsPinned() === "bottom"
                        ? `${(table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26}px`
                        : undefined
            }}
        >
            {row.getVisibleCells().map((cell) => {
                return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
            })}
            {/* {row.getIsExpanded() && (
                <tr>
                    <td colSpan={row.getAllCells().length}>the same columns as the parent row</td>
                </tr>
            )} */}
        </tr>
    );
};
export default PinnedRow;
