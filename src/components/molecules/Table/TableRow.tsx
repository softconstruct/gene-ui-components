import React, { ChangeEvent, FC } from "react";
import { Row } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight, Clock, Copy, Download, Pin, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { CellClassNames } from "@components/molecules/Table/helpers";

import Checkbox from "../Checkbox";
import { RowActions, RowData, TableCol } from ".";
import Cell, { ICellProps } from "./Cell";

interface ITableRow {
    row: Row<RowData>;
    rowIndex: number;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
    rowActions: Partial<RowActions>;
    onRowClick?: (event: string) => void;
    handleCellEdit: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        rowIndex: number,
        columnId: string
    ) => void;
}

const TableRow: FC<ITableRow> = ({
    row,
    rowIndex,
    expandable,
    withCheckbox,
    editableMode,
    onRowClick,
    handleCellEdit,
    rowActions
}) => {
    const onRowDelete = () => {
        rowActions.delete?.(row.id);
    };

    return (
        <>
            <tr
                className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`, {
                    table__row_selected: row.getIsSelected()
                })}
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
                                    onRowClick?.(row.id);
                                }}
                            />
                        </div>
                    </td>
                )}
                {row.getVisibleCells().map((cell) => {
                    const { type } = cell.column.columnDef as TableCol<ICellProps>;
                    if (type === "expand" || type === "rowCheckbox") {
                        return null;
                    }
                    return (
                        <td key={cell.id} className="table__td">
                            <>
                                <div className={classNames(`table__content ${CellClassNames[type]}`)}>
                                    <Cell
                                        type={type as ICellProps["type"]}
                                        data={row.original[(cell.column.columnDef as TableCol<unknown>).type]?.data}
                                        withEditMode={editableMode}
                                        rowCellRenderer={(cell.column.columnDef as TableCol<unknown>).rowCellRenderer}
                                        withCopy={(cell.column.columnDef as TableCol<unknown>).copyable}
                                        onChange={(e) => handleCellEdit(e, rowIndex, type)}
                                    />
                                </div>
                            </>
                        </td>
                    );
                })}
                {!editableMode && rowActions && Object.values(rowActions).every((action) => Boolean(action)) && (
                    <td className="table__td table__actionsWrapper">
                        <div className="table__actions">
                            {rowActions.pin && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Pin}
                                    onClick={() => {
                                        row.pin("top");
                                        rowActions.pin?.(row.id);
                                    }}
                                />
                            )}
                            {rowActions?.tag && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Tag}
                                    onClick={() => rowActions.tag?.(row.id)}
                                />
                            )}
                            {rowActions?.clock && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Clock}
                                    onClick={() => rowActions.clock?.(row.id)}
                                />
                            )}
                            {rowActions?.copy && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Copy}
                                    onClick={() => rowActions.copy?.(row.id)}
                                />
                            )}
                            {rowActions?.download && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Download}
                                    onClick={() => rowActions.download?.(row.id)}
                                />
                            )}
                            {rowActions?.delete && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={RecycleBin}
                                    onClick={onRowDelete}
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
