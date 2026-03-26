import React, { FC, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { VisibilityState } from "@tanstack/react-table";

// Components
import { IMenuItemProps } from "@components/molecules/Menu";
import {
    IBulkActions,
    IEditActions,
    IManageColumnsActions,
    IManageColumnsInfo,
    IRowAction,
    ManageColumnsSavedDataType,
    Row
} from "@components/organisms/Table/types";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { Columns, TableData } from "../../../../stories/data/__table";
import Table, { ITableProps } from "./index";

const SwapComponent = () => (
    <div
        className="swapComponent"
        style={{
            background: "#F4E1EC",
            padding: ".6rem 1.2rem",
            color: "#A60063",
            height: "100%"
        }}
    >
        Swap
    </div>
);

const bulkActionsMock: IBulkActions = {
    label: "Bulk",
    onChange: (item: IMenuItemProps) => console.log(item),
    list: [
        {
            id: 1,
            title: "Item 1"
        },
        {
            id: 2,
            title: "Item 2"
        },
        {
            id: 3,
            title: "item 3"
        }
    ]
};

const manageColumnsInfo: IManageColumnsInfo = {
    manageColumns: {
        label: "Active Columns",
        actionsInfo: {}
    },
    manageColumnsTitle: "Manage Columns",
    isManageColumnsDisabled: false
};

const defaultEditActions: IEditActions = {
    primary: {
        label: "Save"
    },
    secondary: {
        label: "Cancel"
    },
    tertiary: {
        label: "Edit"
    }
};

const rowActions: IRowAction[] = [
    {
        type: "pin",
        onClick: () => {}
    },
    {
        type: "tag",
        onClick: () => {}
    },
    {
        type: "reload",
        onClick: () => {}
    },
    {
        type: "show",
        onClick: () => {}
    },
    {
        type: "clock",
        onClick: () => {}
    },
    {
        type: "copy",
        onClick: () => {}
    },
    {
        type: "download",
        onClick: () => {}
    },
    {
        type: "delete",
        onClick: () => {}
    }
];

const PAGE_SIZE = 50;

const meta: Meta<ITableProps> = {
    title: "Organisms/Table",
    component: Table,
    argTypes: {
        data: args({ control: "false", ...propCategory.content }),
        columns: args({ control: "false", ...propCategory.content }),
        rowSelectionInfo: args({ control: "false", ...propCategory.content }),
        globalFilterInfo: args({ control: "false", ...propCategory.content }),
        manageColumnsInfo: args({ control: "false", ...propCategory.content }),
        bulkActions: args({ control: "false", ...propCategory.content }),
        editActions: args({ control: "false", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content }),
        selectAllText: args({ control: "text", ...propCategory.content }),
        showInputPageField: args({ control: "boolean", ...propCategory.content }),
        withToolbar: args({ control: "boolean", ...propCategory.content }),
        withPagination: args({ control: "boolean", ...propCategory.content }),
        initialPageSize: args({ control: "number", ...propCategory.content }),
        initialPageIndex: args({ control: "number", ...propCategory.content }),
        columnOrder: args({ control: "false", ...propCategory.states }),
        columnVisibility: args({ control: "false", ...propCategory.states }),
        pinnedColumns: args({ control: "false", ...propCategory.states }),
        editMode: args({ control: "boolean", ...propCategory.states }),
        withManualFiltering: args({ control: "boolean", ...propCategory.states }),
        pageSizes: args({ control: "false", ...propCategory.states }),
        withVirtualScroll: args({ control: "boolean", ...propCategory.states }),
        withStickyHeader: args({ control: "boolean", ...propCategory.states }),
        withStickyFooter: args({ control: "boolean", ...propCategory.states }),
        withManualSorting: args({ control: "boolean", ...propCategory.states }),
        withFilterFromLeafRows: args({ control: "boolean", ...propCategory.states }),
        onSort: args({ control: "false", ...propCategory.action }),
        onGlobalFilter: args({ control: "false", ...propCategory.action }),
        onColumnFilter: args({ control: "false", ...propCategory.action }),
        onPageChange: args({ control: "false", ...propCategory.action }),
        onPageSizeChange: args({ control: "false", ...propCategory.action }),
        columnResizeMode: args({ control: "select", ...propCategory.functionality }),
        columnResizeDirection: args({ control: "select", ...propCategory.functionality }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        data: TableData,
        columns: Columns,
        rowSelectionInfo: {
            selectedRowsLength: 0,
            selectedRowsLabel: "selected",
            deselectTitle: "Deselect"
        },
        globalFilterInfo: {
            withGlobalFilter: true,
            withManualFiltering: true
        },
        columnResizeDirection: "ltr",
        bulkActions: bulkActionsMock,
        manageColumnsInfo,
        editActions: defaultEditActions,
        headerContent: <SwapComponent />,
        resizable: true,
        withToolbar: true,
        withPagination: true,
        withVirtualScroll: false,
        withManualSorting: false
    }
};

export default meta;

type Story = StoryObj<ITableProps>;

const TableComponent: FC<ITableProps> = (props) => {
    const { data } = props;
    const [tableData, setTableData] = useState(() => data);
    const [editableState, setEditableState] = useState(false);
    const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const onSave = (updatedData: Row[]) => {
        setTableData(updatedData);
        setEditableState(false);
    };

    const onEdit = () => {
        setEditableState(true);
    };
    const onCancel = () => {
        setEditableState(false);
    };

    const editActions = {
        primary: { label: "Save", onClick: onSave },
        secondary: { label: "Cancel", onClick: onCancel },
        tertiary: { label: "Edit", onClick: onEdit }
    };

    const handleColumnsSave = (savedData: ManageColumnsSavedDataType) => {
        const { pinnedColumns: pinnedCols, columnsOrdering, visibilityColumns } = savedData;

        setColumnVisibility(visibilityColumns);
        setPinnedColumns(pinnedCols || []);
        setColumnOrder(columnsOrdering);
    };

    const manageColumnsActions: IManageColumnsActions = {
        primary: {
            label: "Save",
            onClick: handleColumnsSave
        },
        secondary: {
            label: "Cancel"
        },
        tertiary: {
            label: "Restore Defaults"
        }
    };

    const manageColumns: IManageColumnsInfo = {
        ...manageColumnsInfo,
        manageColumns: { ...manageColumnsInfo.manageColumns, actionsInfo: manageColumnsActions }
    };

    return (
        <div style={{ height: 700, overflow: "auto" }}>
            <Table
                {...props}
                rowActions={rowActions}
                columnOrder={columnOrder}
                columnVisibility={columnVisibility}
                pinnedColumns={pinnedColumns}
                data={tableData}
                bulkActions={bulkActionsMock}
                editMode={editableState}
                editActions={editActions}
                manageColumnsInfo={manageColumns}
            />
        </div>
    );
};

const InfiniteScrollTableComponent: FC<ITableProps> = (props) => {
    const [rows, setRows] = useState<Row[]>(() => TableData.slice(0, PAGE_SIZE));
    const [hasMore, setHasMore] = useState<boolean>(TableData.length > PAGE_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const handleLoadMore = () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);

        setTimeout(() => {
            setRows((currentRows) => {
                const nextLength = currentRows.length + PAGE_SIZE;
                const nextRows = TableData.slice(0, nextLength);

                setHasMore(nextRows.length < TableData.length);

                return nextRows;
            });

            setIsLoadingMore(false);
        }, 0);
    };

    return (
        <div style={{ height: 700, overflow: "auto" }}>
            <TableComponent
                {...props}
                data={rows}
                rowActions={rowActions}
                bulkActions={bulkActionsMock}
                manageColumnsInfo={manageColumnsInfo}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                estimateSize={40}
                overscan={10}
            />
        </div>
    );
};

export const Default: Story = {
    render: (props: ITableProps) => {
        return <TableComponent {...props} />;
    },
    args: {}
};

export const VirtualizedTable: Story = {
    render: (props: ITableProps) => {
        return <TableComponent {...props} />;
    },
    args: {
        withPagination: false,
        withVirtualScroll: true
    }
};

export const InfiniteScroll: Story = {
    render: (props: ITableProps) => {
        return <InfiniteScrollTableComponent {...props} />;
    },
    args: {
        withPagination: false,
        withVirtualScroll: true
    }
};
