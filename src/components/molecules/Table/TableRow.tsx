import React, { FC, useContext } from "react";
import { Row } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight, Clock, Copy, Download, Pin, PinFilled, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { CellClassNames } from "@components/molecules/Table/helpers";
import { TableContext } from "@components/molecules/Table/Table";

import Checkbox from "../Checkbox";
import { Row as RowData, TableCol } from ".";
import Cell, { ICellProps } from "./Cell";

interface ITableRow {
    row: Row<RowData>;
    rowIndex: number;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
}

const TableRow: FC<ITableRow> = ({ row, rowIndex, expandable, withCheckbox, editableMode }) => {
    const {
        onRowClick,
        onCellEdit,
        onRowPinToggle,
        onRowTag,
        onRowClock,
        onRowReload,
        onRowCopy,
        onRowDownload,
        onRowShow,
        onRowDelete,
        onRowSelect
    } = useContext(TableContext);

    const handleRowDelete = () => {
        onRowDelete?.(row.id);
    };

    return (
        <>
            <tr
                className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`, {
                    table__row_selected: row.getIsSelected(),
                    table__pinned: row.getIsPinned(),
                    table__pinned_horizontal: row.getIsPinned()
                })}
                onClick={() => onRowClick?.(row.id)}
            >
                {expandable && (
                    <td className="table__td">
                        <div className="table__content table__content_expand">
                            {row.getCanExpand() && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={!row.getIsExpanded() ? ChevronRight : ChevronDown}
                                    onClick={() => row.toggleExpanded()}
                                />
                            )}
                        </div>
                    </td>
                )}

                {withCheckbox && (
                    <td className="table__td">
                        <div className="table__content table__content_checkbox">
                            <Checkbox
                                name="item"
                                value="item"
                                checked={row.getIsSelected()}
                                onChange={() => {
                                    row.toggleSelected();
                                    onRowSelect?.(row);
                                }}
                            />
                        </div>
                    </td>
                )}
                {row.getVisibleCells().map((cell) => {
                    const { type } = cell.column.columnDef as TableCol<ICellProps>;
                    if (type === "Expand" || type === "RowCheckbox") {
                        return null;
                    }
                    return (
                        <td key={cell.id} className="table__td">
                            <>
                                <div className={classNames(`table__content ${CellClassNames[type]}`)}>
                                    <Cell
                                        type={type as ICellProps["type"]}
                                        data={row.original[(cell.column.columnDef as TableCol<unknown>).type]}
                                        withEditMode={editableMode}
                                        rowCellRenderer={(cell.column.columnDef as TableCol<unknown>).rowCellRenderer}
                                        withCopy={(cell.column.columnDef as TableCol<unknown>).copyable}
                                        {...(onCellEdit && {
                                            onChange: (e) => onCellEdit(rowIndex, type, e.target.value)
                                        })}
                                    />
                                </div>
                            </>
                        </td>
                    );
                })}
                {!editableMode &&
                    [
                        onRowPinToggle,
                        onRowTag,
                        onRowClock,
                        onRowReload,
                        onRowCopy,
                        onRowDownload,
                        onRowShow,
                        onRowDelete
                    ].some((action) => Boolean(action)) && (
                        <td className="table__td table__actionsWrapper">
                            <div className="table__actions">
                                {onRowPinToggle && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={row.getIsPinned() ? PinFilled : Pin}
                                        onClick={() => {
                                            onRowPinToggle(row.id);
                                        }}
                                    />
                                )}
                                {onRowTag && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={Tag}
                                        onClick={() => onRowTag(row.id)}
                                    />
                                )}
                                {onRowClock && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={Clock}
                                        onClick={() => onRowClock(row.id)}
                                    />
                                )}
                                {onRowCopy && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={Copy}
                                        onClick={() => onRowCopy(row.id)}
                                    />
                                )}
                                {onRowDownload && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={Download}
                                        onClick={() => onRowDownload(row.id)}
                                    />
                                )}
                                {onRowDelete && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={RecycleBin}
                                        onClick={handleRowDelete}
                                    />
                                )}
                            </div>
                        </td>
                    )}
            </tr>
            {row.getIsExpanded() && (
                <tr className="table__row table__row_tbody">
                    <td className="table__td table__td_expanded" colSpan={row.getVisibleCells().length}>
                        <div
                            className="swapComponent"
                            style={{
                                height: "20rem",
                                backgroundColor: "#F4E1EC",
                                padding: "1.6rem",
                                color: "#A60063"
                            }}
                        >
                            {row?.original.expandedData()}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export { ITableRow, TableRow as default };
