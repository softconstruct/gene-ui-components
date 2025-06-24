import React, { ChangeEvent } from "react";
import { Row } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight, Clock, Copy, Download, Pin, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Checkbox from "@components/molecules/Checkbox";
import Cell, { ICellProps } from "@components/molecules/Table/Cell";
import { CellClassNames } from "@components/molecules/Table/helpers";

import { RowActions, TableCol } from "./type";

const PinnedRow = ({
    row,
    rowIndex,
    expandable,
    editableMode,
    onCellEdit,
    rowActions
}: {
    row: Row<any>;
    rowIndex: number;
    expandable?: boolean;
    editableMode: boolean;
    onCellEdit: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        index: number,
        type: string
    ) => void;
    rowActions: Partial<RowActions>;
}) => {
    return (
        <>
            <tr
                key={row.id}
                className={classNames(
                    `table__row table__row_tbody table__row_${row.original.rowStatus} table__pinned table__pinned_horizontal`
                )}
            >
                {/* todo: add next classNames next to "table__td" classname, for similar states - "table__pinned", "table__pinned_horizontal" */}
                {/* todo: add next className for similar states - "table__expand" */}
                {!!expandable && (
                    <td key={`${row.id}-0`} className="table__td">
                        {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                        <div className="table__content table__content_expand">
                            {!!row.original.expandedData && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={!row.getIsExpanded() ? ChevronRight : ChevronDown}
                                    // Icon={ChevronDown}
                                    onClick={() => row.toggleExpanded()}
                                />
                            )}
                        </div>
                    </td>
                )}

                {/* todo: add next classNames next to "table__td" classname, for similar states - "table__pinned", "table__pinned_horizontal" */}
                {/* {row.withCheckbox && ( */}
                <td key={`${row.id}-1`} className="table__td">
                    {/* todo: add next classNames for similar states - "table__content_empty", "table__content_expand", "table__content_checkbox" */}
                    <div className="table__content table__content_checkbox">
                        <Checkbox name="item" value="item" />
                        {/* <Checkbox name="item" value="item" checked /> */}
                    </div>
                </td>
                {/* )} */}
                {row.getVisibleCells().map((cell) => {
                    const { type } = cell.column.columnDef as TableCol<unknown>;
                    if (type === "expand" || type === "rowCheckbox") {
                        return null;
                    }
                    return (
                        <td key={cell.id} className="table__td">
                            <>
                                <div className={classNames(`table__content ${CellClassNames[type]}`)}>
                                    <Cell
                                        type={type as ICellProps["type"]}
                                        data={row.original[type].data}
                                        withEditMode={editableMode}
                                        rowCellRenderer={row.original[type].rowCellRenderer}
                                        onChange={(e) => onCellEdit(e, rowIndex, type)}
                                    />
                                </div>
                                {/* {row.original[cell.column.columnDef.type].rowCellRenderer()} */}
                            </>
                        </td>
                    );
                })}
                {!editableMode && rowActions && Object.values(rowActions).every((action) => !!action) && (
                    <td className="table__td table__actionsWrapper">
                        <div className="table__actions">
                            {rowActions && rowActions.pin && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Pin}
                                    onClick={() => {
                                        row.pin(false);
                                        rowActions.pin?.(row.id);
                                    }}
                                    className=""
                                />
                            )}
                            {rowActions?.tag && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Tag}
                                    onClick={() => rowActions.tag?.(row.id)}
                                    className=""
                                />
                            )}
                            {rowActions?.clock && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Clock}
                                    onClick={() => rowActions.clock?.(row.id)}
                                    className=""
                                />
                            )}
                            {rowActions?.copy && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Copy}
                                    onClick={() => rowActions.copy?.(row.id)}
                                    className=""
                                />
                            )}
                            {rowActions?.download && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={Download}
                                    onClick={() => rowActions.download?.(row.id)}
                                    className=""
                                />
                            )}
                            {rowActions?.delete && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={RecycleBin}
                                    onClick={() => rowActions.delete?.(row.id)}
                                    className=""
                                />
                            )}
                        </div>
                    </td>
                )}
            </tr>
            {row.getIsExpanded() && (
                <tr key={`${row.id}_expanded`} className="table__row table__row_tbody">
                    <td className="table__td table__td_expanded" colSpan={row.getVisibleCells().length}>
                        {/* todo: replace this custom "swapComponent" with needed content after implementation */}
                        <div
                            className="swapComponent"
                            style={{
                                height: "20rem",
                                backgroundColor: "#F4E1EC",
                                padding: "1.6rem",
                                color: "#A60063"
                            }}
                        >
                            {row.original.expandedData()}
                        </div>
                    </td>
                </tr>
            )}
            {/* <tr */}
            {/*    style={{ */}
            {/*        backgroundColor: "lightblue", */}
            {/*        position: "sticky", */}
            {/*        top: row.getIsPinned() === "top" ? `${row.getPinnedIndex() * 26 + 48}px` : undefined, */}
            {/*        bottom: */}
            {/*            row.getIsPinned() === "bottom" */}
            {/*                ? `${(table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26}px` */}
            {/*                : undefined */}
            {/*    }} */}
            {/* > */}
            {/*    {row.getVisibleCells().map((cell) => { */}
            {/*        return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>; */}
            {/*    })} */}
            {/*    /!* {row.getIsExpanded() && ( */}
            {/*    <tr> */}
            {/*        <td colSpan={row.getAllCells().length}>the same columns as the parent row</td> */}
            {/*    </tr> */}
            {/* )} *!/ */}
            {/* </tr> */}
        </>
    );
};
export default PinnedRow;
