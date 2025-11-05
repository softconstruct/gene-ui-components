import React, { FC, useContext, useEffect, useState } from "react";
import { Column, VisibilityState } from "@tanstack/react-table";
import classNames from "classnames";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import { Pin, PinFilled, ThreeDotsVertical } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Scrollbar from "@components/atoms/Scrollbar";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import { TableContext } from "@components/molecules/Table/Table";
import { IManageColumnsData, IOrderedColumns, OrderType, Row, TableCol } from "@components/molecules/Table/type";

type MutableColumnDef = {
    isVisible?: boolean;
    isPinned?: boolean;
    order?: number;
};

interface IManageColumns {
    onMenuClose: () => void;
    visibleColumns?: VisibilityState;
    orderedColumns?: IOrderedColumns[];
    columnsMap: Map<string, TableCol<Row>>;
    isGrouped?: boolean;
}

const ManageColumns: FC<IManageColumns> = ({ orderedColumns, visibleColumns, columnsMap, onMenuClose, isGrouped }) => {
    const { onManageColumnsChange, onManageColumnRestore } = useContext(TableContext);
    const [columns, setColumns] = useState<IOrderedColumns[] | null>(null);
    const [columnsVisibility, setColumnsVisibility] = useState<VisibilityState>({});
    const [savedColumnData, setSavedColumnData] = useState<IManageColumnsData[] | null>(null);

    const getInitialColumns = () => [...(orderedColumns || [])];

    useEffect(() => {
        if (!visibleColumns) return;
        setColumnsVisibility(visibleColumns);
    }, [visibleColumns]);

    useEffect(() => {
        const columnsWithOrder = getInitialColumns();
        setColumns(columnsWithOrder);
    }, [orderedColumns]);

    const handleManageColumns = () => {
        onMenuClose();
        if (!columns?.length || !savedColumnData?.length) return;
        onManageColumnsChange?.(savedColumnData);
    };

    const handleColumnVisibility = (column: Column<Row, unknown>) => {
        const col = columnsMap.get(column.id);
        if (!col) return;
        const columnDef = column.columnDef as MutableColumnDef;
        columnDef.isVisible = !col.isVisible;
        setColumnsVisibility({
            ...columnsVisibility,
            [column.id]: !columnsVisibility[column.id]
        });
    };

    const handleManageColumnsRestore = () => {
        if (!orderedColumns?.length) return;
        onManageColumnRestore?.();
    };

    const getSavedData = (
        prev: IManageColumnsData[] | null,
        orderedManageColumns: IOrderedColumns[],
        sourceID: string
    ) => {
        const [reorderedColumns] = orderedManageColumns.map((group) =>
            group.columns.reduce(
                (acc, column, index) => {
                    const colDef = columnsMap.get(column.id);
                    if (!colDef) return acc;
                    const updatedColumn = {
                        ...column,
                        columnDef: {
                            ...colDef,
                            order: index + 1
                        }
                    };
                    return {
                        ...acc,
                        [updatedColumn.id]: {
                            order: colDef.order,
                            isPinned: !!colDef.isPinned
                        }
                    };
                },
                {} as Record<string, OrderType>
            )
        );

        if (isGrouped) {
            const currentGroup = prev?.find((item) => item.groupId === sourceID);
            if (currentGroup && prev?.length) {
                const updatedGroup = {
                    ...currentGroup,
                    columns: { ...reorderedColumns }
                };

                return prev?.map((item) => (item.groupId === sourceID ? updatedGroup : item));
            }
            const reorderedColumnsWithGroup: IManageColumnsData = {
                groupId: sourceID,
                columns: { ...reorderedColumns }
            };
            return [...(prev || []), reorderedColumnsWithGroup];
        }

        return [{ columns: reorderedColumns }];
    };

    const onColumnPin = (column: Column<Row, unknown>, groupIndex: number, columnIndex: number) => {
        if (!columns?.length) return;

        const col = columnsMap.get(column.id);
        if (!col) return;
        const columnDef = column.columnDef as MutableColumnDef;
        columnDef.isPinned = !col.isPinned;
        setColumns((prev) => {
            if (!prev) return null;
            if (!prev[groupIndex].columns?.length) {
                return prev;
            }
            const currentColumn = prev[groupIndex].columns?.[columnIndex];
            const currentColDef = currentColumn ? columnsMap.get(currentColumn.id) : null;
            const newIsPinned = !col.isPinned;
            if (currentColumn && currentColDef) {
                const currentColumnDef = currentColumn.columnDef as MutableColumnDef;
                currentColumnDef.order = newIsPinned ? columnIndex + 1 : 1;
            }
            prev[groupIndex].columns.sort((a, b) => {
                const aColDef = columnsMap.get(a.id);
                const bColDef = columnsMap.get(b.id);
                const aIsPinned = aColDef?.isPinned ?? false;
                const bIsPinned = bColDef?.isPinned ?? false;
                const aOrder = aColDef?.order ?? 0;
                const bOrder = bColDef?.order ?? 0;

                if (aIsPinned && !bIsPinned) {
                    return -1;
                }
                if (!aIsPinned && bIsPinned) {
                    return 1;
                }
                return aOrder - bOrder;
            });
            return [...prev];
        });

        const sourceID = columns?.[groupIndex].id;

        setSavedColumnData((prev) => getSavedData(prev, columns, sourceID));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !columns?.length) {
            return;
        }
        const sourceID = result.source.droppableId;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) {
            return;
        }
        const currentColumns = columns.find((item) => item.id === sourceID);
        if (!currentColumns) return;

        const currentGroupIndex = columns.indexOf(currentColumns);
        const newColumns = currentColumns;
        const [reorderedColumn] = newColumns.columns.splice(sourceIndex, 1);
        newColumns.columns.splice(destinationIndex, 0, reorderedColumn);

        const orderedManageColumns = [
            ...columns.slice(0, currentGroupIndex),
            newColumns,
            ...columns.slice(currentGroupIndex + 1)
        ];

        setSavedColumnData((prev) => getSavedData(prev, orderedManageColumns, sourceID));

        setColumns(orderedManageColumns);
    };

    const renderDraggableSection = (dragCols: Column<Row, unknown>[], groupIndex: number) => {
        return dragCols.map((column, index) => {
            const colDef = columnsMap.get(column.id);
            if (!colDef || colDef.type === "Expand" || colDef.type === "RowCheckbox") {
                return null;
            }
            return (
                <Draggable key={column.id} draggableId={`${column.parent?.id}_${column.id}`} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                        <div
                            ref={draggableProvided.innerRef}
                            {...(draggableProvided.draggableProps as React.HTMLAttributes<HTMLDivElement>)}
                            className={classNames("dropdownMenu__columns_item", {
                                "dropdownMenu__columns_item--dragging": draggableSnapshot.isDragging,
                                "dropdownMenu__columns_item--disabled": colDef.disabled
                            })}
                            role="tab"
                            tabIndex={0}
                        >
                            <Label
                                className="dropdownMenu__columns_placeholder"
                                text={typeof colDef.header === "string" ? colDef.header : ""}
                            >
                                <Checkbox
                                    name="item"
                                    value="item"
                                    checked={columnsVisibility[column.id]}
                                    onChange={() => handleColumnVisibility(column)}
                                />
                            </Label>
                            <div className="dropdownMenu__columns_actions">
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={colDef.isPinned ? PinFilled : Pin}
                                    onClick={() => onColumnPin(column, groupIndex, index)}
                                    className="dropdownMenu__columns_icon"
                                />
                                <div {...draggableProvided.dragHandleProps}>
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={ThreeDotsVertical}
                                        className="dropdownMenu__columns_icon"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
            );
        });
    };

    const renderDroppableSection = (cols: IOrderedColumns[]) => {
        return cols?.map((item, groupIndex) => {
            return (
                <Droppable droppableId={item.id} key={item.id}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={classNames("columns-list", {
                                "columns-list--dragging-over": snapshot.isDraggingOver
                            })}
                        >
                            <span>{item.title}</span>

                            {!!item.columns?.length && renderDraggableSection(item.columns, groupIndex)}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            );
        });
    };

    if (!columns?.length) return null;

    return (
        <div className="dropdownMenu">
            <div className="dropdownMenu__header">
                <input type="text" placeholder="Search" style={{ width: "100%" }} />
            </div>

            <Scrollbar>
                <div className="dropdownMenu__main">
                    <div className="dropdownMenu__columns">
                        <div className="dropdownMenu__columns_header">
                            <p className="dropdownMenu__columns_title ellipsis-text">Active Columns</p>
                        </div>
                        <DragDropContext onDragEnd={handleDragEnd}>{renderDroppableSection(columns)}</DragDropContext>
                    </div>
                    <Divider />
                </div>
            </Scrollbar>

            <div className="dropdownMenu__footer">
                <Button appearance="secondary" layout="text" size="medium" onClick={() => handleManageColumnsRestore()}>
                    Restore Defaults
                </Button>
                <ButtonGroup size="medium">
                    <Button appearance="secondary" layout="fill" size="medium" onClick={() => onMenuClose()}>
                        Cancel
                    </Button>
                    <Button
                        className="dropdownMenu__footer_buttonGroup_save"
                        appearance="primary"
                        layout="fill"
                        size="medium"
                        onClick={handleManageColumns}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export { ManageColumns as default };
