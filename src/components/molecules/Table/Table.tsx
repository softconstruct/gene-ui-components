import React, { FC, ReactNode, useEffect, useState } from "react";
import {
    Column,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Header,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import { Globe, Pin, PinFilled, ThreeDotsVertical } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Label from "@components/atoms/Label";
import Loader, { ILoaderProps } from "@components/atoms/Loader";
import Scrollbar from "@components/atoms/Scrollbar";
import Checkbox from "@components/molecules/Checkbox";
import Pagination from "@components/molecules/Pagination";
import BulkActions from "@components/molecules/Table/BulkActions";
import { ColActions } from "@components/molecules/Table/ColActions";
import { deepCloneWithFunctions } from "@components/molecules/Table/helpers";
import PinnedRow from "@components/molecules/Table/PinnedRow";
import TBody from "@components/molecules/Table/TBody";
import { BulkAction, IOrderedColumns, Row, RowActions, RowData, TableCol } from "@components/molecules/Table/type";
import VirtualScrollTBody from "@components/molecules/Table/VirtualScrollTBody";

// Styles
import "./Table.scss";

// hooks
import { useTableState } from "./hooks";

interface ITableProps {
    /**
     * Column definitions for the table.
     */
    columns: TableCol<RowData>[];

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
     * Optional bulk action buttons that appear when rows are selected.
     */
    bulkActions?: BulkAction;

    /**
     * Enables global search box (text input above the table).
     */
    withGlobalFilter?: boolean;

    /**
     * Custom placeholder text for the global search input.
     */
    globalFilterPlaceholder?: string;

    /**
     * Whether table header should remain fixed during scroll.
     */
    withStickyHeader?: boolean;

    /**
     * Enables column sorting (if defined in columnDef).
     */
    sortableColumns?: boolean;

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
    withVirtualScroll?: boolean;
    onManageColumnRestore?: (event: IOrderedColumns[]) => void;
    onSortChange?: (sorting: SortingState) => void;
    onPageChange?: (pageNumber: number) => void;
    onPageSizeChange?: (size: number) => void;
    showInputPageField?: boolean;
    withManualPagination?: boolean;
    onRowSelect?: (selectedRows: any[]) => void;
    onCellEdit?: (rowIndex: number, columnId: string, value: any) => void;
    withDynamicFetch?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    onSave?: (data: Row[]) => void;
    loading?: boolean;
    loaderSize?: ILoaderProps["size"];
    loaderText?: string;
    isManageColumnsDisabled?: boolean;
    withManageColumns?: boolean;
    manageColumnsTitle?: string;
    headerContent?: ReactNode;
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
    withGlobalFilter,
    globalFilterPlaceholder,
    onGlobalFilterChange,
    onSave,
    bulkActions,
    pageSizes = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    showInputPageField,
    withManualPagination,
    initialPageSize = 10,
    initialPageIndex = 0,
    withPagination = true,
    withVirtualScroll,
    withStickyHeader,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loading,
    loaderSize,
    loaderText,
    withManageColumns,
    isManageColumnsDisabled,
    manageColumnsTitle = "Manage Columns",
    headerContent
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
        setData,
        handleSave,
        handleCancel,
        setSorting,
        setColumnVisibility,
        setColumnPinning,
        setRowPinning,
        setExpanded,
        setEditableMode,
        setMenuOpened,
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

    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const accessEditableMode: Record<string, boolean> = {};
    const accessCopyable: Record<string, boolean> = {};
    const [tableColumns, setTableColumns] = useState<TableCol<RowData>[]>(deepCloneWithFunctions(columns));
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
    const [manageColumnsData, setManageColumnsData] = useState<IOrderedColumns[]>([]);
    const [orderedColumns, setOrderedColumns] = useState<IOrderedColumns[]>([]);

    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    useEffect(() => {
        setData(externalData);
    }, [externalData]);

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
                col.toggleVisibility(!!(col.columnDef as TableCol<RowData>).isVisible);
                if ((col.columnDef as TableCol<RowData>).isPinned) col.pin("left");
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
            columnPinning: {
                left: ["expand", "rowCheckbox"]
            },
            ...(withPagination &&
                !withVirtualScroll && {
                    pagination: { pageSize: initialPageSize, pageIndex: initialPageIndex }
                })
        },
        state: {
            columnOrder,
            expanded,
            rowPinning,
            sorting,
            columnPinning,
            columnVisibility,
            globalFilter,
            columnFilters
        },
        getRowId: (row) => row.id,
        ...(withManualPagination && { manualPagination: withManualPagination }),
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        ...(withPagination &&
            !withVirtualScroll && {
                getPaginationRowModel: getPaginationRowModel()
            }),
        getSortedRowModel: getSortedRowModel(),
        getRowCanExpand: (row) => !!row.original.expandedData,
        enableGlobalFilter: withGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
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
                if (header.getContext().column.columns.length && header.getContext().column.columnDef.header) {
                    cols.push({
                        id: header.column.id,
                        title: (header.column.columnDef as TableCol<RowData>).header || null,
                        columns: header.column.columns.sort((a, b) => {
                            return (a.columnDef as TableCol<RowData>).order - (b.columnDef as TableCol<RowData>).order;
                        })
                    });
                } else {
                    if (headerGroup.depth > 0) return;

                    if (!cols.length) {
                        cols.push({
                            id: headerGroup.id,
                            title: null,
                            columns: headerGroup.headers
                                .map((item) => item.column)
                                .sort((a, b) => {
                                    return (
                                        (a.columnDef as TableCol<RowData>).order -
                                        (b.columnDef as TableCol<RowData>).order
                                    );
                                })
                        });
                    }
                }
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
        if (type === "save") handleSave();
        if (type === "cancel") handleCancel();
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

    const onColumnPin = (column: Column<RowData, unknown>, groupIndex: number, columnIndex: number) => {
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

    const renderTableHeaderCell = (header: Header<RowData, unknown>) => {
        if (header.isPlaceholder) return null;

        if (header.id === "rowCheckbox" && withCheckbox) {
            return (
                <th
                    key={`${header.id}_header`}
                    colSpan={header.colSpan}
                    className={classNames("table__th", {
                        table__th_group: header.subHeaders.length
                    })}
                >
                    <div className="table__content table__content_empty">
                        <Checkbox
                            name="column"
                            value="column"
                            checked={table.getIsAllPageRowsSelected()}
                            indeterminate={table.getIsSomePageRowsSelected()}
                            onChange={() => {
                                table.toggleAllPageRowsSelected();
                                onColumnCheck?.();
                            }}
                        />
                    </div>
                </th>
            );
        }

        if (header.id === "rowCheckbox") return null;

        return (
            <th
                key={`${header.id}_header`}
                colSpan={header.colSpan}
                className={classNames("table__th", {
                    table__th_group: header.subHeaders.length
                })}
            >
                <div className="table__content table__content_empty">
                    <div className="table__content table__content_header">
                        <span className="table__th_text ellipsis-text">
                            {(header.column.columnDef as TableCol<RowData>).header}
                        </span>
                        {header.id !== "expand" && <ColActions header={header} />}
                    </div>
                </div>
            </th>
        );
    };

    const handleRowDelete = (rowId: string) => {
        setRowPinning((prev) => ({ ...prev, top: prev.top?.filter((row) => row !== rowId) }));

        setData((prevData) =>
            prevData.filter((row) => {
                return row.id !== rowId;
            })
        );
    };

    const renderTableBody = () => {
        if (loading) {
            return <Loader size={loaderSize} text={loaderText} />;
        }

        if (table.getRowModel().flatRows.length > 0) {
            return (
                <>
                    {table.getTopRows().map((row) => (
                        <PinnedRow
                            key={row.id}
                            rowIndex={row.index}
                            row={row}
                            rowActions={rowActions || {}}
                            withCheckbox={withCheckbox}
                            expandable={expandable}
                            editableMode={editableMode}
                            onCellEdit={handleCellEdit}
                            {...(rowActions?.delete && { onRowDelete: handleRowDelete })}
                        />
                    ))}
                    {withVirtualScroll && tableContainerRef.current ? (
                        <VirtualScrollTBody
                            rows={table.getRowModel().rows}
                            columnCount={table.getHeaderGroups().length || 1}
                            tableContainerRef={tableContainerRef.current}
                            onRowClick={onRowClick}
                            rowActions={rowActions || {}}
                            expandable={expandable}
                            editableMode={editableMode}
                            withCheckbox={withCheckbox}
                            onCellEdit={handleCellEdit}
                            withDynamicFetch={withDynamicFetch}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            {...(rowActions?.delete && { onRowDelete: handleRowDelete })}
                        />
                    ) : (
                        <TBody
                            table={table}
                            onRowClick={onRowClick}
                            rowActions={rowActions || {}}
                            expandable={expandable}
                            editableMode={editableMode}
                            withCheckbox={withCheckbox}
                            onCellEdit={handleCellEdit}
                            {...(rowActions?.delete && { onRowDelete: handleRowDelete })}
                        />
                    )}
                </>
            );
        }

        return <h1>No data available</h1>;
    };

    const renderTableFooterCell = (footer: Header<RowData, unknown>) => {
        if (footer.id === "rowCheckbox" && !withCheckbox) return null;

        return (
            <td key={`${footer.id}_footer`} className="table__td" colSpan={footer.colSpan}>
                <div className="table__content table__content_empty table__content_text_numeric">
                    <span className="ellipsis-text table__td_text">
                        {footer?.column?.columnDef?.footer
                            ? flexRender(footer.column.columnDef.footer, footer.getContext())
                            : null}
                    </span>
                </div>
            </td>
        );
    };

    const handlePageChange = (pageNumber: number) => {
        table.setPageIndex(pageNumber - 1);
        onPageChange?.(pageNumber);
    };

    const handlePageSizeChange = (size: number) => {
        table.setPageSize(size);
        onPageSizeChange?.(size);
    };

    return (
        <div className={classNames("dataTable")}>
            {table.getRowModel().flatRows.length > 0 && (
                <div className={classNames("dataTable__toolbar toolbar")}>
                    <div className="dataTable__toolbar_search">
                        {withGlobalFilter && (
                            <input
                                className="dataTable__toolbar_searchInput"
                                type="text"
                                placeholder={globalFilterPlaceholder}
                                value={globalFilter}
                                onChange={(e) => {
                                    setGlobalFilter(e.target.value);
                                }}
                                style={{ width: "100%" }}
                            />
                        )}
                        <div className="dataTable__bulkActions">
                            <div className="dataTable__bulkActions_selected">
                                {table.getSelectedRowModel().rows.length} selected
                            </div>
                            <Divider direction="vertical" />
                            <Button
                                appearance="primary"
                                layout="text"
                                size="medium"
                                disabled={bulkActions?.disabled}
                                onClick={() => table.getSelectedRowModel().rows.length && table.resetRowSelection()}
                            >
                                Deselect
                            </Button>
                            {!!bulkActions?.list.length && <BulkActions bulkActions={bulkActions} />}
                        </div>
                    </div>
                    <div className="dataTable__toolbar_actions">
                        {headerContent && <div className="dataTable__toolbar_content">{headerContent}</div>}
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
                                {withManageColumns && (
                                    <div className="dataTable__toolbar_dropdownMenu">
                                        <Button
                                            className="dataTable__toolbar_dropdownMenu_manageColumns"
                                            appearance="secondary"
                                            layout="outline"
                                            size="medium"
                                            disabled={isManageColumnsDisabled}
                                            Icon={Globe}
                                            onClick={() => setMenuOpened(!menuOpened)}
                                        >
                                            {manageColumnsTitle}
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
                                                                                    className={classNames(
                                                                                        "columns-list",
                                                                                        {
                                                                                            "columns-list--dragging-over":
                                                                                                snapshot.isDraggingOver
                                                                                        }
                                                                                    )}
                                                                                >
                                                                                    <span key={item.id}>
                                                                                        {item.title}
                                                                                    </span>
                                                                                    {item.columns.map(
                                                                                        (column, index) => {
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
                                                                                                    draggableId={
                                                                                                        column.id
                                                                                                    }
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
                                                                                                                        draggableSnapshot.isDragging,
                                                                                                                    "dropdownMenu__columns_item--disabled":
                                                                                                                        (
                                                                                                                            column.columnDef as TableCol<unknown>
                                                                                                                        )
                                                                                                                            .disabled
                                                                                                                }
                                                                                                            )}
                                                                                                            role="tab"
                                                                                                            tabIndex={0}
                                                                                                        >
                                                                                                            <Label
                                                                                                                className="dropdownMenu__columns_placeholder"
                                                                                                                text={
                                                                                                                    (
                                                                                                                        column.columnDef as TableCol<RowData>
                                                                                                                    )
                                                                                                                        .header
                                                                                                                }
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
                                                                                                            <div className="dropdownMenu__columns_actions">
                                                                                                                <Button
                                                                                                                    appearance="secondary"
                                                                                                                    layout="text"
                                                                                                                    size="small"
                                                                                                                    Icon={
                                                                                                                        column.getIsPinned()
                                                                                                                            ? PinFilled
                                                                                                                            : Pin
                                                                                                                    }
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
                                                                                        }
                                                                                    )}
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
                                                            className="dropdownMenu__footer_buttonGroup_save"
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
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            <div ref={tableContainerRef} style={{ height: "500px", overflow: "auto" }}>
                <table className={classNames("table", className)}>
                    <thead
                        className={classNames({
                            table__header_sticky: withStickyHeader
                        })}
                    >
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
                                    return renderTableHeaderCell(header);
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody>{renderTableBody()}</tbody>
                    {table.getRowModel().flatRows.length > 0 && (
                        <tfoot>
                            {table.getFooterGroups().map((footerGroups) => {
                                return (
                                    <tr key={`${footerGroups.id}_footer`} className="table__row table__row_tfoot">
                                        {footerGroups.headers.map((footer) => {
                                            return renderTableFooterCell(footer);
                                        })}
                                    </tr>
                                );
                            })}
                        </tfoot>
                    )}
                </table>
            </div>

            {withPagination && table.getRowModel().flatRows.length > 0 && (
                <div className="dataTable__pagination">
                    <div className="dataTable__pagination_controls">
                        <Pagination
                            current={initialPageIndex + 1}
                            totalItems={data.length}
                            currentPageItemsLength={initialPageSize}
                            totalPages={table.getPageCount()}
                            rowsPerPageOptions={pageSizes}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            showInputPageField={showInputPageField}
                        />
                    </div>
                </div>
            )}
            <Divider />
        </div>
    );
};

export { ITableProps, Table as default };
