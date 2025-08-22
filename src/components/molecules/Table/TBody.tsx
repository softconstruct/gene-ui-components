import React, { FC } from "react";
import { Table } from "@tanstack/react-table";

import TableRow from "@components/molecules/Table/TableRow";

import { Row } from ".";

interface ITableBody {
    table: Table<Row>;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
}

const TBody: FC<ITableBody> = ({ table, expandable, withCheckbox, editableMode }) => {
    const allRows = [...table.getTopRows(), ...table.getCenterRows()];

    return (
        <>
            {allRows.map((row, rowIndex) => (
                <TableRow
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex}
                    expandable={expandable}
                    withCheckbox={withCheckbox}
                    editableMode={editableMode}
                />
            ))}
        </>
    );
};

export { TBody as default };
