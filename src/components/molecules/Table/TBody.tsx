import React, { ChangeEvent, FC } from "react";
import { Table } from "@tanstack/react-table";

import TableRow from "@components/molecules/Table/TableRow";

import { RowActions, RowData } from ".";

interface ITableBody {
    table: Table<RowData>;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
    rowActions: Partial<RowActions>;
    onRowClick?: (event: string) => void;
    onCellEdit: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        rowIndex: number,
        columnId: string
    ) => void;
}

const TBody: FC<ITableBody> = ({
    table,
    expandable,
    withCheckbox,
    editableMode,
    rowActions,
    onRowClick,
    onCellEdit
}) => {
    return table
        .getCenterRows()
        .map((row, rowIndex) => (
            <TableRow
                key={row.id}
                row={row}
                rowIndex={rowIndex}
                expandable={expandable}
                withCheckbox={withCheckbox}
                editableMode={editableMode}
                rowActions={rowActions}
                onRowClick={onRowClick}
                handleCellEdit={onCellEdit}
            />
        ));
};

export { TBody as default };
