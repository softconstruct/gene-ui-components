import React, { FC, useEffect, useState } from "react";
import {
    Column,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import {
    CaretDownFilled,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    Download,
    Globe,
    Pin,
    RecycleBin,
    Tag,
    ThreeDotsVertical
} from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Scrollbar from "@components/atoms/Scrollbar";
import Checkbox from "@components/molecules/Checkbox";
import Cell, { ICellProps } from "@components/molecules/Table/Cell";
import { CellClassNames, deepCloneWithFunctions, SortingIcons } from "@components/molecules/Table/helpers";
import { Row } from "@components/molecules/Table/makeData";
import PinnedRow from "@components/molecules/Table/PinnedRow";
import { BulkAction, IOrderedColumns, RowActions, RowData, TableCol } from "@components/molecules/Table/type";

// Styles
import "./Table.scss";
import "./DragAndDrop.scss";

// hooks
import { useTableState } from "./hooks";

interface ITableProps {
    /**
     * Column definitions for the table.
     */
    columns: TableCol<any>[];

    /**
     * Data to display in the table.
     */
    externalData: Row[];

    /**
     * Enables expandable rows.
     */
    expandable?: boolean;

    /**
     * Shows a checkbox for each row.
     */
    withCheckbox?: boolean;

    /**
     * Object containing optional row action callbacks (pin, tag, delete, etc).
     */
    rowActions?: Partial<RowActions>;

    /**
     * Called when a row is clicked.
     */
    onRowClick?: (id: string) => void;

    /**
     * Called when the main checkbox column is toggled.
     */
    onColumnCheck?: () => void;

    /**
     * Additional class name for styling the table container.
     */
    className?: string;

    /**
     * Called when the global filter (search input) value changes.
     */
    onGlobalFilterChange?: (filter: string) => void;

    /**
     * Called when column visibility or order is updated from the "Manage Columns" menu.
     */
    onManageColumns?: (event: IOrderedColumns[]) => void;

    /**
     * Table size preset.
     * - `small` - compact
     * - `medium` - default
     * - `large` - spacious
     */
    size?: "small" | "medium" | "large";

    /**
     * Table visual style variant.
     * - `default` - basic layout
     * - `striped` - zebra rows
     * - `bordered` - table borders
     */
    variant?: "default" | "striped" | "bordered";

    /**
     * Optional bulk action buttons that appear when rows are selected.
     */
    bulkActions?: BulkAction[];

    /**
     * Enables global search box (text input above the table).
     */
    withFilter?: boolean;

    /**
     * Custom placeholder text for the global search input.
     */
    searchPlaceholder?: string;

    /**
     * Custom message to show when no data is available.
     */
    emptyStateMessage?: string;

    /**
     * Custom error message to show when table fails to load or display.
     */
    errorMessage?: string;

    /**
     * Whether pagination controls should be shown.
     */
    showPagination?: boolean;

    /**
     * Whether table header should remain fixed during scroll.
     */
    stickyHeader?: boolean;

    /**
     * Allows resizing of columns if supported.
     */
    resizableColumns?: boolean;

    /**
     * Enables column sorting (if defined in columnDef).
     */
    sortableColumns?: boolean;

    /**
     * Enables per-column filtering (if implemented).
     */
    filterableColumns?: boolean;

    /**
     * Allowed values for page size dropdown.
     */
    pageSizes?: number[];

    /**
     * Default page size on initial render.
     */
    initialPageSize?: number;

    /**
     * Default page index on initial render.
     */
    initialPageIndex?: number;

    /**
     * Enables pagination functionality.
     */
    withPagination?: boolean;
    onManageColumnRestore?: (event: IOrderedColumns[]) => void;
    onSortChange?: (sorting: SortingState) => void;
    onPageChange?: (pagination: PaginationState) => void;
    onRowSelect?: (selectedRows: any[]) => void;
    onCellEdit?: (rowIndex: number, columnId: string, value: any) => void;
    onSave?: (data: Row[]) => void;
}

const Table: FC<ITableProps> = ({
    columns,
    externalData,
    withCheckbox,
    expandable,
    rowActions,
    onRowClick,
    onColumnCheck,
    onManageColumns,
    onManageColumnRestore,
    className,
    onSortChange,
    onGlobalFilterChange,
    onSave,
    pageSizes = [10, 20, 50, 100],
    initialPageSize = 20,
    initialPageIndex = 0,
    withPagination = true
}) => {
    const {
        data,
        sorting,
        columnVisibility,
        globalFilter,
        expanded,
        columnPinning,
        rowPinning,
        editableMode,
        menuOpened,
        isBulkActionsOpen,
        setData,
        setSorting,
        setColumnVisibility,
        setColumnPinning,
        setRowPinning,
        setExpanded,
        setEditableMode,
        setMenuOpened,
        setIsBulkActionsOpen,
        handleCellEdit,
        setGlobalFilter
    } = useTableState<Row>({
        initialData: externalData,
        initialPageSize,
        callbacks: {
            onSortChange,
            onSave,
            onGlobalFilterChange
        }
    });

    const accessEditableMode: Record<string, boolean> = {};
    const accessCopyable: Record<string, boolean> = {};
    const [tableColumns, setTableColumns] = useState<TableCol<RowData>[]>(deepCloneWithFunctions(columns));
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
    const [manageColumnsData, setManageColumnsData] = useState<IOrderedColumns[]>([]);
    const [orderedColumns, setOrderedColumns] = useState<IOrderedColumns[]>([]);

    const [columnOrder, setColumnOrder] = useState<string[]>([]);

    useEffect(() => {
        const columnIds: string[] = [];
        const columnVisibilities: { [key: string]: boolean } = {};
        orderedColumns.forEach((item) =>
            item.columns.forEach((col) => {
                if (!col.columnDef.id) {
                    return;
                }
                columnIds.push(col.columnDef.id);
                columnVisibilities[col.columnDef.id] = !!(col.columnDef as TableCol<RowData>).isVisible;
            })
        );

        setColumnOrder(columnIds);
        setVisibleColumns(columnVisibilities);
    }, [orderedColumns]);

    const table = useReactTable<RowData>({
        data,
        columns,
        initialState: {
            sorting,
            pagination: { pageSize: initialPageSize, pageIndex: initialPageIndex },
            columnPinning: {
                left: ["expand", "rowCheckbox"]
            }
        },
        state: {
            columnOrder,
            expanded,
            rowPinning,
            sorting,
            columnPinning,
            columnVisibility,
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowCanExpand: (row) => !!row.original.expandedData,
        enableGlobalFilter: true,
        onSortingChange: (e) => {
            setSorting(e);
            onSortChange?.(sorting);
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onExpandedChange: setExpanded,
        onRowPinningChange: setRowPinning,
        onColumnOrderChange: setColumnOrder
    });

    useEffect(() => {
        if (!table || !tableColumns.length) return;
        const cols: IOrderedColumns[] = [];
        table.getHeaderGroups().forEach((headerGroup) => {
            headerGroup.headers.forEach((header) => {
                if (header.getContext().column.columns.length && header.getContext().column.columnDef.header)
                    cols.push({
                        id: header.column.id,
                        title: () => flexRender(header.column.columnDef.header, header.getContext()),
                        columns: header.column.columns.sort((a, b) => {
                            return (a.columnDef as TableCol<RowData>).order - (b.columnDef as TableCol<RowData>).order;
                        })
                    });
            });
        });
        setOrderedColumns(cols);
    }, [tableColumns]);
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const sourceID = result.source.droppableId;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) {
            return;
        }
        const currentColumns = orderedColumns.find((item) => item.id === sourceID);

        if (!currentColumns) return;

        const currentGroupIndex = orderedColumns.indexOf(currentColumns);
        const newColumns = currentColumns;
        const [reorderedColumn] = newColumns.columns.splice(sourceIndex, 1);
        newColumns.columns.splice(destinationIndex, 0, reorderedColumn);

        const orderedManageColumns = [
            ...orderedColumns.slice(0, currentGroupIndex),
            newColumns,
            ...orderedColumns.slice(currentGroupIndex + 1)
        ];
        setManageColumnsData(orderedManageColumns);
    };

    const tableEditAction = (type: "cancel" | "edit" | "save") => {
        if (type === "save") onSave?.(data);
        if (type === "cancel") setData(deepCloneWithFunctions(externalData));
        setEditableMode(!editableMode);
    };

    const handleManageColumns = () => {
        onManageColumns?.(manageColumnsData);
        setColumnVisibility(visibleColumns);
        setMenuOpened(false);
        if (manageColumnsData.length > 0) setOrderedColumns(manageColumnsData);
    };

    const handleColumnVisibility = (column: Column<RowData, unknown>) => {
        setVisibleColumns({
            ...visibleColumns,
            [column.id]: !visibleColumns[column.id]
        });
    };

    const onColumnPin = (column: any, groupIndex: number, columnIndex: number) => {
        const isPinned = column.getIsPinned();
        if (!isPinned) {
            column.pin("left");
        } else {
            column.pin(false);
        }
        setTableColumns((prev) => {
            if (!prev[groupIndex].columns?.length) {
                return prev;
            }
            const currentColumn = prev[groupIndex].columns?.[columnIndex];
            if (currentColumn) currentColumn.order = !isPinned ? columnIndex + 1 : 1;
            return prev;
        });
    };

    const handleManageColumnsRestore = () => {
        setTableColumns(deepCloneWithFunctions(columns));
        onManageColumnRestore?.(manageColumnsData);
    };

    const onCellCopy = async (value: string | number) => {
        try {
            await navigator.clipboard.writeText(`${value}`);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <div className={classNames("dataTable", className)}>
            <div className={classNames("dataTable__toolbar toolbar", className)}>
                <div className="dataTable__toolbar_search">
                    <input
                        type="text"
                        placeholder="Search"
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                        }}
                        style={{ width: "100%" }}
                    />
                    <div className="dataTable__bulkActions">
                        <div className="dataTable__bulkActions_selected">
                            {table.getSelectedRowModel().rows.length} selected
                        </div>
                        <Divider direction="vertical" />
                        <Button
                            appearance="primary"
                            layout="text"
                            size="medium"
                            onClick={() => table.resetRowSelection()}
                        >
                            Deselect
                        </Button>
                        <Button
                            appearance="primary"
                            layout="text"
                            size="medium"
                            Icon={CaretDownFilled}
                            iconPosition="after"
                            onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                        >
                            Bulk Actions
                        </Button>
                    </div>
                </div>
                <div className="dataTable__toolbar_actions">
                    {editableMode ? (
                        <>
                            <div className="dropdownMenu__footer_buutonGroup">
                                <Button
                                    appearance="secondary"
                                    layout="fill"
                                    size="medium"
                                    onClick={() => tableEditAction("cancel")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    appearance="primary"
                                    layout="fill"
                                    size="medium"
                                    onClick={() => tableEditAction("save")}
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button
                                appearance="secondary"
                                layout="outline"
                                size="medium"
                                Icon={Globe}
                                onClick={() => tableEditAction("edit")}
                            >
                                Edit
                            </Button>
                            <div className="dataTable__toolbar_dropdownMenu">
                                <Button
                                    appearance="secondary"
                                    layout="outline"
                                    size="medium"
                                    Icon={Globe}
                                    onClick={() => setMenuOpened(!menuOpened)}
                                >
                                    Manage Columns
                                </Button>

                                {menuOpened && (
                                    <div className="dropdownMenu">
                                        <div className="dropdownMenu__header">
                                            <input type="text" placeholder="Search" style={{ width: "100%" }} />
                                        </div>

                                        <Scrollbar>
                                            <div className="dropdownMenu__main">
                                                <div className="dropdownMenu__columns">
                                                    <div className="dropdownMenu__columns_header">
                                                        <p className="dropdownMenu__columns_title ellipsis-text">
                                                            Active Columns
                                                        </p>
                                                    </div>
                                                    <DragDropContext onDragEnd={handleDragEnd}>
                                                        {orderedColumns.map((item, groupIndex) => {
                                                            return (
                                                                <Droppable droppableId={item.id} key={item.id}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            className={classNames("columns-list", {
                                                                                "columns-list--dragging-over":
                                                                                    snapshot.isDraggingOver
                                                                            })}
                                                                        >
                                                                            <span key={item.id}>{item.title()}</span>
                                                                            {item.columns.map((column, index) => {
                                                                                if (
                                                                                    (
                                                                                        column.columnDef as TableCol<RowData>
                                                                                    ).type === "expand" ||
                                                                                    (
                                                                                        column.columnDef as TableCol<RowData>
                                                                                    ).type === "rowCheckbox"
                                                                                ) {
                                                                                    return null;
                                                                                }

                                                                                return (
                                                                                    <Draggable
                                                                                        key={column.id}
                                                                                        draggableId={column.id}
                                                                                        index={index}
                                                                                    >
                                                                                        {(
                                                                                            draggableProvided,
                                                                                            draggableSnapshot
                                                                                        ) => (
                                                                                            <div
                                                                                                ref={
                                                                                                    draggableProvided.innerRef
                                                                                                }
                                                                                                {...(draggableProvided.draggableProps as React.HTMLAttributes<HTMLDivElement>)}
                                                                                                className={classNames(
                                                                                                    "dropdownMenu__columns_item",
                                                                                                    {
                                                                                                        "dropdownMenu__columns_item--dragging":
                                                                                                            draggableSnapshot.isDragging
                                                                                                    }
                                                                                                )}
                                                                                                role="tab"
                                                                                                tabIndex={0}
                                                                                            >
                                                                                                <Label
                                                                                                    className="dropdownMenu__columns_placeholder"
                                                                                                    text={`${(
                                                                                                        column.columnDef as TableCol<RowData>
                                                                                                    ).header()}`}
                                                                                                >
                                                                                                    <Checkbox
                                                                                                        name="item"
                                                                                                        value="item"
                                                                                                        checked={
                                                                                                            visibleColumns[
                                                                                                                column
                                                                                                                    .id
                                                                                                            ]
                                                                                                        }
                                                                                                        onChange={() =>
                                                                                                            handleColumnVisibility(
                                                                                                                column
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                </Label>
                                                                                                {/* <p className="dropdownMenu__columns_text ellipsis-text"> */}
                                                                                                {/*    {column.columnDef.header()} */}
                                                                                                {/* </p> */}

                                                                                                <div className="dropdownMenu__columns_actions">
                                                                                                    <Button
                                                                                                        appearance="secondary"
                                                                                                        layout="text"
                                                                                                        size="small"
                                                                                                        Icon={Pin}
                                                                                                        onClick={() =>
                                                                                                            onColumnPin(
                                                                                                                column,
                                                                                                                groupIndex,
                                                                                                                index
                                                                                                            )
                                                                                                        }
                                                                                                        className="dropdownMenu__columns_icon"
                                                                                                    />
                                                                                                    <div
                                                                                                        {...draggableProvided.dragHandleProps}
                                                                                                    >
                                                                                                        <Button
                                                                                                            appearance="secondary"
                                                                                                            layout="text"
                                                                                                            size="small"
                                                                                                            Icon={
                                                                                                                ThreeDotsVertical
                                                                                                            }
                                                                                                            onClick={() => {}}
                                                                                                            className="dropdownMenu__columns_icon"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </Draggable>
                                                                                );
                                                                            })}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            );
                                                        })}
                                                    </DragDropContext>
                                                </div>
                                                <Divider />
                                            </div>
                                        </Scrollbar>

                                        <div className="dropdownMenu__footer">
                                            <Button
                                                appearance="secondary"
                                                layout="text"
                                                size="medium"
                                                onClick={() => handleManageColumnsRestore()}
                                            >
                                                Restore Defaults
                                            </Button>
                                            <div className="dropdownMenu__footer_buutonGroup">
                                                <Button
                                                    appearance="secondary"
                                                    layout="fill"
                                                    size="medium"
                                                    onClick={() => setMenuOpened(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    appearance="primary"
                                                    layout="fill"
                                                    size="medium"
                                                    onClick={handleManageColumns}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Scrollbar>
                <table className={classNames("table", className)}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={`${headerGroup.id}_header`} className="table__row table__row_thead">
                                {headerGroup.headers.map((header) => {
                                    const col = header.column.columnDef as TableCol<unknown>;

                                    if (col.editable) {
                                        accessEditableMode[header.id] = true;
                                    }

                                    if (col.copyable) {
                                        accessCopyable[header.id] = true;
                                    }
                                    return (
                                        <th
                                            key={`${header.id}_header`}
                                            colSpan={header.colSpan}
                                            className={classNames("table__th", {
                                                table__th_group: header.subHeaders.length
                                            })}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="table__content table__content_empty">
                                                    {header.id === "rowCheckbox" ? (
                                                        <Checkbox
                                                            name="column"
                                                            value="column"
                                                            checked={table.getIsAllRowsSelected()}
                                                            onChange={() => {
                                                                table.toggleAllRowsSelected();
                                                                onColumnCheck?.();
                                                            }}
                                                        />
                                                    ) : (
                                                        <button type="button" tabIndex={0} className="table__content">
                                                            <span className="table__th_text ellipsis-text">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </span>
                                                            <div className="table__th_actions">
                                                                {header.column.columnDef.enableSorting && (
                                                                    <Button
                                                                        appearance="secondary"
                                                                        layout="text"
                                                                        size="small"
                                                                        Icon={
                                                                            SortingIcons[
                                                                                `${header.column.getIsSorted()}`
                                                                            ]
                                                                        }
                                                                        onClick={(e) => {
                                                                            return (
                                                                                (
                                                                                    header.column
                                                                                        .columnDef as TableCol<unknown>
                                                                                ).enableSorting &&
                                                                                header?.column?.getToggleSortingHandler?.()?.(
                                                                                    e
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                )}

                                                                {/* todo: change icon from "Globe" to some "Filter" icon, when it will implemented */}
                                                                {(header.column.columnDef as TableCol<RowData>)
                                                                    .filterable && (
                                                                    <Button
                                                                        appearance="secondary"
                                                                        layout="text"
                                                                        size="small"
                                                                        Icon={Globe}
                                                                        onClick={() => {}}
                                                                    />
                                                                )}
                                                                {/* todo: import "Dropdown-Menu" component upon click on "Filter" button */}

                                                                {/* todo: change icon from "Globe" to some "Search" icon, when it will implemented */}
                                                                {(header.column.columnDef as TableCol<RowData>)
                                                                    .searchable && (
                                                                    <Button
                                                                        appearance="secondary"
                                                                        layout="text"
                                                                        size="small"
                                                                        Icon={Globe}
                                                                        onClick={() => {}}
                                                                    />
                                                                )}
                                                                {/* todo: import "Search Field" component instead of "Search" button upon click on it */}
                                                                {/* <input type="text" placeholder="Search" style={{ width: "100%" }} /> */}
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getTopRows().map((row, index) => (
                            <PinnedRow
                                key={row.id}
                                rowIndex={index}
                                row={row}
                                rowActions={rowActions || {}}
                                expandable={expandable}
                                editableMode={editableMode}
                                onCellEdit={handleCellEdit}
                            />
                        ))}

                        {table.getCenterRows().map((row, rowIndex) => {
                            return (
                                <>
                                    <tr
                                        key={row.id}
                                        className={classNames(
                                            `table__row table__row_tbody table__row_${row.original.rowStatus}`,
                                            {
                                                table__row_selected: row.getIsSelected()
                                            }
                                        )}
                                    >
                                        {!!expandable && (
                                            <td key={`${row.id}-0`} className="table__td">
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
                                            <td key={`${row.id}-1`} className="table__td">
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
                                                        <div
                                                            className={classNames(
                                                                `table__content ${CellClassNames[type]}`
                                                            )}
                                                        >
                                                            <Cell
                                                                type={type as ICellProps["type"]}
                                                                data={
                                                                    row.original[
                                                                        (cell.column.columnDef as TableCol<unknown>)
                                                                            .type
                                                                    ]?.data
                                                                }
                                                                withEditMode={editableMode}
                                                                rowCellRenderer={
                                                                    row.original[
                                                                        (cell.column.columnDef as TableCol<unknown>)
                                                                            .type
                                                                    ]?.rowCellRenderer
                                                                }
                                                                {...((cell.column.columnDef as TableCol<unknown>)
                                                                    .copyable && { onCopy: onCellCopy })}
                                                                onChange={(e) => handleCellEdit(e, rowIndex, type)}
                                                            />
                                                        </div>
                                                    </>
                                                </td>
                                            );
                                        })}
                                        {!editableMode &&
                                            rowActions &&
                                            Object.values(rowActions).every((action) => !!action) && (
                                                <td className="table__td table__actionsWrapper">
                                                    <div className="table__actions">
                                                        {rowActions && rowActions.pin && (
                                                            <Button
                                                                appearance="secondary"
                                                                layout="text"
                                                                size="small"
                                                                Icon={Pin}
                                                                onClick={() => {
                                                                    row.pin("top");
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
                                            <td
                                                className="table__td table__td_expanded"
                                                colSpan={row.getVisibleCells().length}
                                            >
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
                                </>
                            );
                        })}
                    </tbody>

                    <tfoot>
                        {table.getFooterGroups().map((footerGroups) => {
                            return (
                                <tr key={`${footerGroups.id}_footer`} className="table__row table__row_tfoot">
                                    {footerGroups.headers.map((footer) => {
                                        return (
                                            <td
                                                key={`${footer.id}_footer`}
                                                className="table__td"
                                                colSpan={footer.colSpan}
                                            >
                                                <div className="table__content table__content_empty table__content_text_numeric">
                                                    <span className="ellipsis-text table__td_text">
                                                        {footer?.column?.columnDef?.footer
                                                            ? flexRender(
                                                                  footer.column.columnDef.footer,
                                                                  footer.getContext()
                                                              )
                                                            : null}
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tfoot>
                </table>
            </Scrollbar>

            {withPagination && (
                <div className="dataTable__pagination">
                    <div className="dataTable__pagination_info">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{" "}
                        of {table.getFilteredRowModel().rows.length} entries
                    </div>

                    <div className="dataTable__pagination_controls">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                            className="dataTable__pagination_select"
                        >
                            {pageSizes.map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>

                        <div className="dataTable__pagination_buttons">
                            <Button
                                appearance="secondary"
                                layout="outline"
                                size="small"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                First
                            </Button>
                            <Button
                                appearance="secondary"
                                layout="outline"
                                size="small"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>

                            <span className="dataTable__pagination_info">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>

                            <Button
                                appearance="secondary"
                                layout="outline"
                                size="small"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                            <Button
                                appearance="secondary"
                                layout="outline"
                                size="small"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                Last
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Divider />
        </div>
    );
};

export { ITableProps, Table as default };
