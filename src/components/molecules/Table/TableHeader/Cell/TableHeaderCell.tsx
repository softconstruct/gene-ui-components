import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";

// Styles
import "./TableHeaderCell.scss";

const TableHeaderCell = ({ header }: { header: Header<any, any> }) => (
    <th className="tableHeaderCell">
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
);

export default TableHeaderCell;
