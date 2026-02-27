import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { flexRender, HeaderGroup, VisibilityState } from "@tanstack/react-table";
import { Column } from "@tanstack/table-core";
import classNames from "classnames";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import { GripDots, Pin, PinFilled } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import TextField from "@components/molecules/TextField";
import { DISPLAY_COLUMN_TYPES } from "@components/organisms/Table/constants";
import { TableContext } from "@components/organisms/Table/Table";
import { IManageColumnsActions, ManageColumnsSavedDataType, Row } from "@components/organisms/Table/types";

interface IManageColumnsProps {
    label?: string;
    onColumnSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    onColumnPinToggle?: (column: string, isPinned: boolean) => void;
    onColumnVisibilityToggle?: (column: string, isPinned: boolean) => void;
    onMenuClose?: () => void;
    actionsInfo?: IManageColumnsActions;
}

const getInitialData = (headers: HeaderGroup<Row>[]) => {
    const data: ManageColumnsSavedDataType = {
        visibilityColumns: {},
        columnsOrdering: [],
        pinnedColumns: []
    };

    headers.forEach((groups) => {
        groups.headers.forEach((col) => {
            const columnsOrdering = data?.columnsOrdering || [];
            const visibilityColumns = data?.visibilityColumns || {};
            const pinnedColumns = data?.pinnedColumns || [];
            data.columnsOrdering = [...columnsOrdering, col.column.columnDef.dataKey];
            data.visibilityColumns = {
                ...visibilityColumns,
                [col.column.columnDef.dataKey]: col.column.getIsVisible()
            };
            data.pinnedColumns = [...pinnedColumns, col.column.getIsPinned() && col.column.columnDef.dataKey].filter(
                (item) => typeof item === "string"
            );
        });
    });
    return data;
};

const ManageColumns: FC<IManageColumnsProps> = ({
    label,
    onMenuClose,
    onColumnSearch,
    onColumnPinToggle,
    onColumnVisibilityToggle,
    actionsInfo
}) => {
    const { headers, columnVisibility, columnOrder, pinnedColumns } = useContext(TableContext);
    const [columns, setColumns] = useState<HeaderGroup<Row>[]>(() => headers);
    const [data, setData] = useState<ManageColumnsSavedDataType>();

    useEffect(() => {
        if (!pinnedColumns || !columnVisibility || !columnOrder) {
            const initialData = getInitialData(headers);
            setData(initialData);
            return;
        }

        setData({
            visibilityColumns: columnVisibility,
            pinnedColumns,
            columnsOrdering: columnOrder
        });
    }, [headers, pinnedColumns, columnVisibility, columnOrder]);

    const handleCancel = () => {
        const initialData = getInitialData(headers);
        setData(initialData);
        actionsInfo?.secondary?.onClick?.();
        onMenuClose?.();
    };

    const handleRestore = () => {
        const initialData = getInitialData(headers);
        setData(initialData);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const sourceID = result.source.droppableId;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) {
            return;
        }
        const currentGroup = columns.find((item) => item.id === sourceID);
        if (!currentGroup) return;

        const currentGroupIndex = columns.indexOf(currentGroup);
        const currentColumns = columns[currentGroupIndex].headers;

        const items = Array.from(currentColumns);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        columns[currentGroupIndex].headers = [...items];

        setColumns(() => [...columns]);
    };

    const onColumnPin = (column: Column<Row, unknown>) => {
        const currentColumn = column.columnDef.dataKey;

        setData((prev) => {
            if (!prev) return prev;

            const isPinned = prev.pinnedColumns?.includes(currentColumn);
            const nextPinnedColumns = isPinned
                ? prev.pinnedColumns?.filter((item) => item !== currentColumn)
                : [...(prev.pinnedColumns || []), currentColumn];

            onColumnPinToggle?.(currentColumn, Boolean(isPinned));

            return {
                ...prev,
                pinnedColumns: nextPinnedColumns
            };
        });
    };

    const handleColumnVisibility = (column: Column<Row, unknown>) => {
        const currentColumn = column.columnDef.dataKey;

        setData((prev) => {
            if (!prev) return prev;

            const currentVisibilityColumns = prev.visibilityColumns ?? {};
            const currentValue = currentVisibilityColumns[currentColumn];
            const nextVisibilityColumns: VisibilityState = {
                ...currentVisibilityColumns,
                [currentColumn]: !currentValue
            };

            onColumnVisibilityToggle?.(currentColumn, !currentValue);

            return {
                ...prev,
                visibilityColumns: nextVisibilityColumns
            };
        });
    };

    const handlePrimaryActionClick = () => {
        if (!data) return;
        const orderedCols = columns.flatMap((item) =>
            item.headers
                .filter(
                    ({ column }) =>
                        column.columnDef.type !== "Group" || !DISPLAY_COLUMN_TYPES.includes(column.columnDef.type)
                )
                .map(({ column }) => column.columnDef.dataKey as string)
        );

        setData({ ...data, columnsOrdering: orderedCols });

        const savedData = { ...data, columnsOrdering: orderedCols };
        actionsInfo?.primary?.onClick?.(savedData);
    };

    const renderDraggableSection = (dragCols: HeaderGroup<Row>) => {
        return dragCols.headers.map((header, index) => {
            const { column } = header;
            const colDef = column.columnDef;
            if (DISPLAY_COLUMN_TYPES.includes(colDef.type) || colDef.type === "Group") return null;

            return (
                <Draggable key={header.id} draggableId={header.id} index={index}>
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
                            <Label className="dropdownMenu__columns_placeholder">
                                <>
                                    <Checkbox
                                        name="item"
                                        value="item"
                                        checked={data?.visibilityColumns[column.columnDef.dataKey] !== false}
                                        onChange={() => handleColumnVisibility(column)}
                                    />
                                    {flexRender(colDef.header, header.getContext())}
                                </>
                            </Label>
                            <div className="dropdownMenu__columns_actions">
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    Icon={data?.pinnedColumns?.includes(column.columnDef.dataKey) ? PinFilled : Pin}
                                    onClick={() => onColumnPin(column)}
                                    className="dropdownMenu__columns_icon"
                                />
                                <div {...draggableProvided.dragHandleProps}>
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={GripDots}
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

    const renderDroppableSection = (groups: HeaderGroup<Row>[]) => {
        return groups?.map((item) => {
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
                            {renderDraggableSection(item)}
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
                <TextField type="text" placeholder="Search" onChange={onColumnSearch} />
            </div>

            <Scrollbar>
                <div className="dropdownMenu__main">
                    <div className="dropdownMenu__columns">
                        {label && (
                            <div className="dropdownMenu__columns_header">
                                <Text as="p" className="dropdownMenu__columns_title ellipsis-text">
                                    {label}
                                </Text>
                            </div>
                        )}
                        <DragDropContext onDragEnd={handleDragEnd}>{renderDroppableSection(columns)}</DragDropContext>
                    </div>
                    <Divider />
                </div>
            </Scrollbar>

            <div className="dropdownMenu__footer">
                {actionsInfo?.tertiary && (
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="medium"
                        onClick={handleRestore}
                        aria-label={actionsInfo.tertiary.ariaLabel || actionsInfo.tertiary.label}
                        disabled={actionsInfo.tertiary.disabled}
                    >
                        {actionsInfo.tertiary.label}
                    </Button>
                )}
                <ButtonGroup size="medium">
                    {actionsInfo?.secondary && (
                        <Button
                            appearance="secondary"
                            layout="fill"
                            size="medium"
                            onClick={handleCancel}
                            aria-label={actionsInfo.secondary.ariaLabel || actionsInfo.secondary.label}
                            disabled={actionsInfo.secondary.disabled}
                        >
                            {actionsInfo.secondary.label}
                        </Button>
                    )}
                    {actionsInfo?.primary && (
                        <Button
                            className="dropdownMenu__footer_buttonGroup_save"
                            appearance="primary"
                            layout="fill"
                            size="medium"
                            onClick={handlePrimaryActionClick}
                            aria-label={actionsInfo.primary.ariaLabel || actionsInfo.primary.label}
                            disabled={actionsInfo.primary.disabled}
                        >
                            {actionsInfo.primary.label}
                        </Button>
                    )}
                </ButtonGroup>
            </div>
        </div>
    );
};

export { IManageColumnsProps, ManageColumns as default };
