import React from "react";
import { Row } from "@tanstack/table-core";

// Components
import TableBodyCell from "@components/molecules/Table/TableBody/Cell/TableBodyCell";

// Styles
import "./TableRow.scss";

const TableRow = ({ row }: { row: Row<any> }) => (
    <tr className="tableRow">
        {row.getVisibleCells().map((cell) => (
            <TableBodyCell key={cell.id} cell={cell} />
        ))}
    </tr>
);

export default TableRow;
