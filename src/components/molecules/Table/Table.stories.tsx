import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { IMenuItemProps } from "@components/molecules/Menu";
import { defaultColumns, withGroupedColumns, withPinnedColumns } from "@components/molecules/Table/Columns";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { BulkAction, ITableProps, Row } from "./index";
import { makeData } from "./makeData";

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

const data = makeData(10);

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        columns: args({ control: "false", ...propCategory.content }),
        externalData: args({ control: "false", ...propCategory.content }),
        expandable: args({ control: "boolean", ...propCategory.content }),
        withCheckbox: args({ control: "boolean", ...propCategory.content }),
        rowActions: args({ control: "false", ...propCategory.content }),
        onRowClick: args({ control: "false", ...propCategory.action }),
        onColumnCheck: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        onGlobalFilterChange: args({ control: "false", ...propCategory.action }),
        onManageColumns: args({ control: "false", ...propCategory.action }),
        bulkActions: args({ control: "false", ...propCategory.functionality }),
        withGlobalFilter: args({ control: "boolean", ...propCategory.functionality }),
        globalFilterPlaceholder: args({ control: "text", ...propCategory.content }),
        withStickyHeader: args({ control: "boolean", ...propCategory.appearance }),
        sortableColumns: args({ control: "boolean", ...propCategory.functionality }),
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
        withDynamicFetch: args({ control: "boolean", ...propCategory.functionality }),
        hasNextPage: args({ control: "boolean", ...propCategory.content }),
        isFetchingNextPage: args({ control: "boolean", ...propCategory.content }),
        fetchNextPage: args({ control: "false", ...propCategory.action }),
        onSave: args({ control: "false", ...propCategory.action }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loaderSize: args({ control: "select", ...propCategory.appearance }),
        loaderText: args({ control: "text", ...propCategory.appearance }),
        isManageColumnsDisabled: args({ control: "boolean", ...propCategory.states }),
        withManageColumns: args({ control: "boolean", ...propCategory.states }),
        manageColumnsTitle: args({ control: "text", ...propCategory.content }),
        headerContent: args({ control: "text", ...propCategory.content })
    },
    args: {
        columns: defaultColumns,
        externalData: data
    }
};

type Story = StoryObj<ITableProps>;

export const Default: Story = {
    render: (props) => (
        <Table
            {...props}
            columns={defaultColumns}
            rowActions={{
                delete: (id) => console.log(id)
            }}
            externalData={data}
            withManageColumns
        />
    )
};

export const WithStickyHeader: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                {...props}
                columns={defaultColumns}
                externalData={data}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                withCheckbox
                withStickyHeader
                bulkActions={bulkActionsMock}
                rowActions={{
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
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

    const onSave = (savedData: Row[]) => {
        return savedData;
    };
    return (
        <Table
            {...props}
            columns={defaultColumns}
            externalData={tableData}
            withVirtualScroll
            withGlobalFilter
            withCheckbox
            bulkActions={bulkActionsMock}
            rowActions={{
                delete: (id) => console.log(id)
            }}
            withDynamicFetch
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchData}
            onSave={(savedData) => onSave(savedData)}
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
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                {...props}
                columns={withPinnedColumns}
                externalData={data}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                bulkActions={bulkActionsMock}
                rowActions={{
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
};

export const WithGroupedColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                {...props}
                columns={withGroupedColumns}
                externalData={data}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                expandable
                withGlobalFilter
                withPagination
                withStickyHeader
                bulkActions={bulkActionsMock}
                rowActions={{
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
};

export const WithExpendRowsColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                {...props}
                columns={withGroupedColumns}
                externalData={data}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                expandable
                withPagination
                bulkActions={bulkActionsMock}
                rowActions={{
                    pin: () => {},
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
};

export const WithOutData: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <Table
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
