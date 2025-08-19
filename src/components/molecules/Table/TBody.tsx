import React, { FC } from "react";
import { Table } from "@tanstack/react-table";

import TableRow from "@components/molecules/Table/TableRow";

import { Row } from ".";

interface ITableBody {
    table: Table<Row>;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
    onRowClick?: (event: string) => void;
    onRowPinToggle?: (rowId: string) => void;
    onRowTag?: (rowId: string) => void;
    onRowClock?: (rowId: string) => void;
    onRowReload?: (rowId: string) => void;
    onRowCopy?: (rowId: string) => void;
    onRowDownload?: (rowId: string) => void;
    onRowShow?: (rowId: string) => void;
    onRowDelete?: (rowId: string) => void;
    onCellEdit?: (rowIndex: number, columnType: string, value: any) => void;
}

const TBody: FC<ITableBody> = ({
    table,
    expandable,
    withCheckbox,
    editableMode,
    onRowClick,
    onCellEdit,
    onRowPinToggle,
    onRowTag,
    onRowClock,
    onRowReload,
    onRowCopy,
    onRowDownload,
    onRowShow,
    onRowDelete
}) => {
    return (
        <>
            {table.getTopRows().map((row, rowIndex) => (
                <TableRow
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex}
                    expandable={expandable}
                    withCheckbox={withCheckbox}
                    editableMode={editableMode}
                    onRowClick={onRowClick}
                    handleCellEdit={onCellEdit}
                    {...(onRowDelete && { onRowDelete })}
                    {...(onRowPinToggle && { onRowPinToggle })}
                    {...(onRowTag && { onRowTag })}
                    {...(onRowClock && { onRowClock })}
                    {...(onRowReload && { onRowReload })}
                    {...(onRowCopy && { onRowCopy })}
                    {...(onRowDownload && { onRowDownload })}
                    {...(onRowShow && { onRowShow })}
                />
            ))}
            {table.getCenterRows().map((row, rowIndex) => {
                return (
                    <TableRow
                        key={row.id}
                        row={row}
                        rowIndex={rowIndex}
                        expandable={expandable}
                        withCheckbox={withCheckbox}
                        editableMode={editableMode}
                        onRowClick={onRowClick}
                        handleCellEdit={onCellEdit}
                        {...(onRowDelete && { onRowDelete })}
                        {...(onRowPinToggle && { onRowPinToggle })}
                        {...(onRowTag && { onRowTag })}
                        {...(onRowClock && { onRowClock })}
                        {...(onRowReload && { onRowReload })}
                        {...(onRowCopy && { onRowCopy })}
                        {...(onRowDownload && { onRowDownload })}
                        {...(onRowShow && { onRowShow })}
                    />
                );
            })}
        </>
    );
};

export { TBody as default };
