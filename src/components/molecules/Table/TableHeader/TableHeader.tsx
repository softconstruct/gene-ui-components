import React from "react";
import { HeaderGroup } from "@tanstack/table-core";

// Components
import TableHeaderCell from "@components/molecules/Table/TableHeader/Cell/TableHeaderCell";

// Styles
import "./TableHeader.scss";

const TableHeader = ({ headerGroups }: { headerGroups: HeaderGroup<any>[] }) => (
    <thead className="tableHeader">
        {headerGroups.map((headerGroup) => (
            <tr className="tableHeader__row" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHeaderCell key={header.id} header={header} />
                ))}
            </tr>
        ))}
    </thead>
);

export default TableHeader;
