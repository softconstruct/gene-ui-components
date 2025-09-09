import React, { ChangeEvent, FC, MouseEvent as ReactMouseEvent, useContext } from "react";
import { Row } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight, Clock, Copy, Download, Eye, Pin, PinFilled, RecycleBin, Tag } from "@geneui/icons";

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

    const handleCellEdit = (index: number, type: TableCol<ICellProps>["type"], data: unknown) => {
        onCellEdit?.(index, type, data);
    };

    const handleRowClick = () => {
        onRowClick?.(row);
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        row.toggleSelected();
        onRowSelect?.(row);
    };

    const handleActionClick =
        (handler?: (id: string) => void) => (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            handler?.(row.id);
        };

    const actionsConfig = [
        {
            name: "pinToggle",
            icon: row.getIsPinned() ? PinFilled : Pin,
            handler: onRowPinToggle
        },
        {
            name: "tag",
            icon: Tag,
            handler: onRowTag
        },
        {
            name: "reload",
            icon: Tag,
            handler: onRowReload
        },
        {
            name: "show",
            icon: Eye,
            handler: onRowShow
        },
        {
            name: "clock",
            icon: Clock,
            handler: onRowClock
        },
        {
            name: "copy",
            icon: Copy,
            handler: onRowCopy
        },
        {
            name: "download",
            icon: Download,
            handler: onRowDownload
        },
        {
            name: "delete",
            icon: RecycleBin,
            handler: onRowDelete
        }
    ];

    const visibleCells = row.getVisibleCells().filter((cell) => {
        const { type } = cell.column.columnDef as TableCol<ICellProps>;
        return type !== "Expand" && type !== "RowCheckbox";
    });

    return (
        <>
            <tr
                className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`, {
                    table__row_selected: row.getIsSelected(),
                    table__pinned: row.getIsPinned(),
                    table__pinned_horizontal: row.getIsPinned()
                })}
                onClick={handleRowClick}
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
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        row.toggleExpanded();
                                    }}
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
                                onChange={(event) => handleCheckboxChange(event)}
                            />
                        </div>
                    </td>
                )}

                {visibleCells.map((cell) => {
                    const { type } = cell.column.columnDef as TableCol<ICellProps>;
                    return (
                        <td key={cell.id} className="table__td">
                            <div className={classNames(`table__content ${CellClassNames[type]}`)}>
                                <Cell
                                    type={type as ICellProps["type"]}
                                    data={row.original[(cell.column.columnDef as TableCol<unknown>).type]}
                                    withEditMode={editableMode}
                                    rowCellRenderer={(cell.column.columnDef as TableCol<unknown>).rowCellRenderer}
                                    withCopy={(cell.column.columnDef as TableCol<unknown>).copyable}
                                    {...(onCellEdit && {
                                        onChange: (data) => handleCellEdit(rowIndex, type, data)
                                    })}
                                />
                            </div>
                        </td>
                    );
                })}
                {!editableMode && actionsConfig.some((action) => !!action.handler) && (
                    <td className="table__td table__actionsWrapper">
                        <div className="table__actions">
                            {actionsConfig
                                .filter((action) => action.handler)
                                .map((action) => (
                                    <Button
                                        key={action.name}
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={action.icon}
                                        onClick={handleActionClick(action.handler)}
                                    />
                                ))}
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
