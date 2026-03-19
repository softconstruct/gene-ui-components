import React from "react";
import { Cell, flexRender } from "@tanstack/react-table";

// Styles
import "./TableBodyCell.scss";

const TableBodyCell = ({ cell }: { cell: Cell<any, any> }) => (
    <td className="tableBodyCell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
);

export default TableBodyCell;
