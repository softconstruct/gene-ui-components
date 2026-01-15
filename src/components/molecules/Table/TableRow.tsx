import React, { FC, JSX, MouseEvent as ReactMouseEvent, useContext } from "react";
import { Row } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight, Clock, Copy, Download, Eye, Pin, PinFilled, RecycleBin, Tag } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { CellClassNames } from "@components/molecules/Table/helpers";
import { TableContext } from "@components/molecules/Table/Table";
import Tooltip from "@components/molecules/Tooltip";

import Checkbox from "../Checkbox";
import { Row as RowData, TableCol } from ".";
import Cell, { ICellProps } from "./Cell";

const RowActions: FC<{ title: string; children: JSX.Element }> = ({ title, children }) => {
    return title ? <Tooltip text={title}>{children}</Tooltip> : children;
};

interface ITableRow {
    row: Row<RowData>;
    rowIndex: number;
    columnsMap: Map<string, TableCol<RowData>>;
    withExpandable?: boolean;
    withCheckbox?: boolean;
    withEditMode: boolean;
    hasRowActions?: boolean;
}

const TableRow: FC<ITableRow> = ({
    row,
    rowIndex,
    columnsMap,
    withExpandable,
    withCheckbox,
    withEditMode,
    hasRowActions = false
}) => {
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

    const handleCellEdit = (index: number, dataKey: TableCol<ICellProps>["dataKey"], data: unknown) => {
        onCellEdit?.(index, dataKey, data);
    };

    const handleRowClick = () => {
        onRowClick?.(row);
    };

    const handleCheckboxChange = () => {
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
            title: "Pin",
            icon: row.getIsPinned() ? PinFilled : Pin,
            handler: onRowPinToggle
        },
        {
            name: "tag",
            title: "Tag",
            icon: Tag,
            handler: onRowTag
        },
        {
            name: "reload",
            title: "Reload",
            icon: Tag,
            handler: onRowReload
        },
        {
            name: "show",
            title: "Show",
            icon: Eye,
            handler: onRowShow
        },
        {
            name: "clock",
            title: "Clock",
            icon: Clock,
            handler: onRowClock
        },
        {
            name: "copy",
            title: "Copy",
            icon: Copy,
            handler: onRowCopy
        },
        {
            name: "download",
            title: "Download",
            icon: Download,
            handler: onRowDownload
        },
        {
            name: "delete",
            title: "Delete",
            icon: RecycleBin,
            handler: onRowDelete
        }
    ];

    const visibleCells = row.getVisibleCells().filter((cell) => {
        const colDef = columnsMap.get(cell.column.id);
        if (!colDef) return false;
        return colDef.type !== "Expand" && colDef.type !== "RowCheckbox";
    });

    const isSelected = row.getIsSelected();
    const isExpanded = row.getIsExpanded();
    const isPinned = row.getIsPinned();
    const canExpand = row.getCanExpand();
    const showActions = !withEditMode && actionsConfig.some((action) => !!action.handler);
    const expandedColSpan = row.getVisibleCells().length + (hasRowActions && showActions ? 1 : 0);

    return (
        <>
            <tr
                className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`, {
                    table__row_selected: isSelected,
                    table__pinned: isPinned,
                    table__pinned_horizontal: isPinned
                })}
                onClick={handleRowClick}
                aria-selected={isSelected}
                aria-expanded={isExpanded}
                role="row"
            >
                {withExpandable && (
                    <td className="table__td">
                        <div className="table__content table__content_expand">
                            {canExpand && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={!isExpanded ? ChevronRight : ChevronDown}
                                    aria-label={
                                        isExpanded ? `Collapse row ${rowIndex + 1}` : `Expand row ${rowIndex + 1}`
                                    }
                                    aria-expanded={isExpanded}
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
                    <td className="table__td" role="gridcell">
                        <div className="table__content table__content_checkbox">
                            <Checkbox
                                name={`row-checkbox-${row.id}`}
                                value={row.id}
                                checked={isSelected}
                                aria-label={`Select row ${rowIndex + 1}`}
                                aria-checked={isSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                    </td>
                )}

                {visibleCells.map((cell) => {
                    const colDef = columnsMap.get(cell.column.id);
                    if (!colDef) return null;
                    const headerText = colDef.header;
                    const cellLabel = typeof headerText === "string" ? headerText : `Column ${rowIndex + 1}`;
                    return (
                        <td key={cell.id} className="table__td" role={withCheckbox ? "gridcell" : undefined}>
                            <div className={classNames(`table__content ${CellClassNames[colDef.type]}`)}>
                                <Cell
                                    type={colDef.type as ICellProps["type"]}
                                    data={row.original[colDef.dataKey]}
                                    withEditMode={withEditMode && !!colDef.editable}
                                    rowCellRenderer={colDef.rowCellRenderer}
                                    withCopy={colDef.copyable}
                                    ariaLabel={cellLabel}
                                    {...(onCellEdit && {
                                        onChange: (data) => handleCellEdit(rowIndex, colDef.dataKey, data)
                                    })}
                                />
                            </div>
                        </td>
                    );
                })}
                {showActions && (
                    <td className="table__td table__actionsWrapper">
                        <div className="table__actions" role="group" aria-label={`Actions for row ${rowIndex + 1}`}>
                            {actionsConfig
                                .filter((action) => action.handler)
                                .map((action) => {
                                    const actionLabels: Record<string, string> = {
                                        pinToggle: isPinned ? `Unpin row ${rowIndex + 1}` : `Pin row ${rowIndex + 1}`,
                                        tag: `Tag row ${rowIndex + 1}`,
                                        reload: `Reload row ${rowIndex + 1}`,
                                        show: `Show row ${rowIndex + 1}`,
                                        clock: `Clock action for row ${rowIndex + 1}`,
                                        copy: `Copy row ${rowIndex + 1}`,
                                        download: `Download row ${rowIndex + 1}`,
                                        delete: `Delete row ${rowIndex + 1}`
                                    };
                                    return (
                                        <RowActions title={action.title}>
                                            <Button
                                                key={action.name}
                                                appearance="secondary"
                                                layout="text"
                                                size="small"
                                                Icon={action.icon}
                                                aria-label={
                                                    actionLabels[action.name] ||
                                                    `Action ${action.name} for row ${rowIndex + 1}`
                                                }
                                                onClick={handleActionClick(action.handler)}
                                            />
                                        </RowActions>
                                    );
                                })}
                        </div>
                    </td>
                )}
            </tr>
            {isExpanded && (
                <tr className="table__row table__row_tbody" role={withCheckbox ? "row" : undefined}>
                    <td
                        className="table__td table__td_expanded"
                        colSpan={expandedColSpan}
                        role="row"
                        aria-label={`Expanded content for row ${rowIndex + 1}`}
                    >
                        {row?.original.expandedData?.()}
                    </td>
                </tr>
            )}
        </>
    );
};

export { ITableRow, TableRow as default };
