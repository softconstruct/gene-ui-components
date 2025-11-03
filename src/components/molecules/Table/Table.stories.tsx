import React, { FC, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import Drawer from "@components/molecules/Drawer";
import { IMenuItemProps } from "@components/molecules/Menu";
import { defaultColumns, withGroupedColumns, withPinnedColumns } from "@components/molecules/Table/Columns";
// Components
import { deepCloneWithFunctions } from "@components/molecules/Table/helpers";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Table, { BulkAction, IManageColumnsData, ITableProps, Row, TableCol } from "./index";
import { makeData } from "./makeData";

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

const bulkActionsMock: BulkAction = {
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

const externalData = makeData(100);

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        columns: args({ control: "false", ...propCategory.content }),
        externalData: args({ control: "false", ...propCategory.content }),
        withExpandable: args({ control: "boolean", ...propCategory.content }),
        withCheckbox: args({ control: "boolean", ...propCategory.content }),
        onRowClick: args({ control: "false", ...propCategory.action }),
        onRowPinToggle: args({ control: "false", ...propCategory.action }),
        onRowTag: args({ control: "false", ...propCategory.action }),
        onRowClock: args({ control: "false", ...propCategory.action }),
        onRowReload: args({ control: "false", ...propCategory.action }),
        onRowCopy: args({ control: "false", ...propCategory.action }),
        onRowDownload: args({ control: "false", ...propCategory.action }),
        onRowShow: args({ control: "false", ...propCategory.action }),
        onRowDelete: args({ control: "false", ...propCategory.action }),
        onSelectAllRows: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        onGlobalFilterChange: args({ control: "false", ...propCategory.action }),
        onManageColumnsChange: args({ control: "false", ...propCategory.action }),
        bulkActions: args({ control: "false", ...propCategory.functionality }),
        withGlobalFilter: args({ control: "boolean", ...propCategory.functionality }),
        globalFilterPlaceholder: args({ control: "text", ...propCategory.content }),
        withStickyHeader: args({ control: "boolean", ...propCategory.appearance }),
        pageSizes: args({ control: "false", ...propCategory.functionality }),
        initialPageSize: args({ control: "number", ...propCategory.content }),
        initialPageIndex: args({ control: "number", ...propCategory.content }),
        withPagination: args({ control: "boolean", ...propCategory.appearance }),
        withVirtualScroll: args({ control: "boolean", ...propCategory.appearance }),
        onManageColumnRestore: args({ control: "false", ...propCategory.action }),
        onSortChange: args({ control: "false", ...propCategory.action }),
        onPageChange: args({ control: "false", ...propCategory.action }),
        onRowSelect: args({ control: "false", ...propCategory.action }),
        onCellEdit: args({ control: "false", ...propCategory.action }),
        onEdit: args({ control: "false", ...propCategory.action }),
        onCancel: args({ control: "false", ...propCategory.action }),
        withDynamicFetch: args({ control: "boolean", ...propCategory.functionality }),
        withEditMode: args({ control: "boolean", ...propCategory.functionality }),
        onPageSizeChange: args({ control: "false", ...propCategory.functionality }),
        withManualPagination: args({ control: "boolean", ...propCategory.functionality }),
        keepPinnedRows: args({ control: "boolean", ...propCategory.functionality }),
        hasNextPage: args({ control: "false", ...propCategory.functionality }),
        showInputPageField: args({ control: "boolean", ...propCategory.content }),
        isFetchingNextPage: args({ control: "boolean", ...propCategory.content }),
        fetchNextPage: args({ control: "false", ...propCategory.action }),
        onSave: args({ control: "false", ...propCategory.action }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loaderSize: args({ control: "select", ...propCategory.appearance }),
        loaderText: args({ control: "text", ...propCategory.appearance }),
        isManageColumnsDisabled: args({ control: "boolean", ...propCategory.states }),
        withManageColumns: args({ control: "boolean", ...propCategory.states }),
        manageColumnsTitle: args({ control: "text", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content }),
        emptyTitle: args({ control: "text", ...propCategory.content }),
        emptyDescription: args({ control: "text", ...propCategory.content }),
        emptyActions: args({ control: "false", ...propCategory.functionality }),
        emptyAppearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        columns: defaultColumns,
        externalData,
        onRowClick: undefined,
        onRowPinToggle: undefined,
        onRowTag: undefined,
        onRowClock: undefined,
        onRowReload: undefined,
        onRowCopy: undefined,
        onRowDownload: undefined,
        onRowShow: undefined,
        onRowDelete: undefined,
        keepPinnedRows: false,
        headerContent: <SwapComponent />
    }
};

type Story = StoryObj<ITableProps>;

const TableComponent: FC<ITableProps> = (props) => {
    const { externalData: data, columns } = props;

    const [tableData, setTableData] = useState<Row[]>([]);
    const [updatedTableData, setUpdatedTableData] = useState<Row[]>([]);
    const [editableState, setEditableState] = useState(false);
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [tableColumns, setTableColumns] = useState<TableCol<Row>[]>(() => columns);

    useEffect(() => {
        const conedData = deepCloneWithFunctions(data);
        setTableData(data);
        setUpdatedTableData(conedData);
    }, [data]);

    const onCellEdit: ITableProps["onCellEdit"] = (rowIndex, columnType, value) => {
        const newData = [...tableData];
        (newData[rowIndex] as any)[columnType] = value;
        setUpdatedTableData(newData);
    };

    const onSave = () => {
        setTableData(updatedTableData);
        setEditableState(false);
    };

    const onEdit = () => {
        setEditableState(true);
    };

    const onCancel = () => {
        setEditableState(false);
    };

    const onRowPinToggle = (rowId: string) => {
        setTableData((prevData) => {
            const rowIndex = prevData.findIndex((row) => row.id === rowId);
            if (rowIndex === -1) {
                return prevData;
            }

            const updatedData = [...prevData];

            updatedData[rowIndex] = {
                ...updatedData[rowIndex],
                isPinned: !updatedData[rowIndex].isPinned
            };

            return updatedData;
        });
    };

    const onRowDelete = (rowId: string) => {
        setTableData((prevData) =>
            prevData.filter((row) => {
                return row.id !== rowId;
            })
        );
    };

    const handleColumnsMange = (columnsData: IManageColumnsData[]) => {
        const [column] = columnsData;
        setTableColumns((prev) => {
            const newData: TableCol<Row>[] = [];
            prev.forEach((item) => {
                newData.push({
                    ...item,
                    order: column.columns[item.id].order
                });
            });
            return newData;
        });
    };

    const handleManageColumnRestore = () => {
        setTableColumns(() => [...columns]);
    };

    const handleRowClick = () => {
        setIsDrawerOpened(true);
    };

    return (
        <div style={{ height: 700, overflow: "auto" }}>
            <Drawer
                title="Row Details"
                open={isDrawerOpened}
                shouldCloseOnOverlayClick
                hasCloseButton
                onClose={() => setIsDrawerOpened(false)}
            >
                <SwapComponent />
            </Drawer>
            <Table
                {...props}
                columns={tableColumns}
                externalData={tableData}
                bulkActions={bulkActionsMock}
                onCellEdit={onCellEdit}
                withEditMode={editableState}
                onRowPinToggle={onRowPinToggle}
                onRowDelete={onRowDelete}
                onManageColumnsChange={handleColumnsMange}
                onManageColumnRestore={handleManageColumnRestore}
                onRowClick={handleRowClick}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
            />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <TableComponent {...props} columns={defaultColumns} withManageColumns />
};

export const WithStickyHeader: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={defaultColumns}
                externalData={externalData}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                withCheckbox
                withStickyHeader
                bulkActions={bulkActionsMock}
            />
        );
    }
};

const TableWithVirtualScroll: FC<ITableProps> = (props) => {
    const [tableData, setTableData] = useState(makeData(50));
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const fetchData = () => {
        if (tableData.length > 300) setHasNextPage(false);
        setIsFetchingNextPage(true);
        setTimeout(() => {
            setTableData((prev) => {
                const newData = makeData(50);
                return [...prev, ...newData];
            });
            setIsFetchingNextPage(false);
        }, 2000);
    };

    return (
        <TableComponent
            {...props}
            columns={defaultColumns}
            externalData={tableData}
            withVirtualScroll
            withGlobalFilter
            withCheckbox
            bulkActions={bulkActionsMock}
            withDynamicFetch
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchData}
        />
    );
};

export const WithVirtualScroll: Story = {
    argTypes: {},
    args: {},
    render: (props) => <TableWithVirtualScroll {...props} />
};

export const WithPinnedColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withPinnedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithGroupedColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                expandable
                withGlobalFilter
                withPagination
                withStickyHeader
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithExpendRowsColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                expandable
                withPagination
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithOutData: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                externalData={[]}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                withPagination
            />
        );
    }
};

export default meta;
