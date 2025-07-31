import React, { ComponentType, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { IMenuItemProps } from "@components/molecules/Menu";
import { defaultColumns, withGroupedColumns, withPinnedColumns } from "@components/molecules/Table/Columns";

// Helpers
import { storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { BulkAction, ITableProps, Row } from "./index";
import { makeData } from "./makeData";
import TableLayoutTmp from "./TableLayoutTmp";

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

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        // fill Table component argTypes
    },
    args: {
        // fill Table component args
    },
    subcomponents: {
        Layout: TableLayoutTmp as ComponentType<unknown>
    }
};

type Story = StoryObj<ITableProps>;

const data = makeData(300);

export const Default: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                columns={defaultColumns}
                externalData={data}
                withPagination
                withGlobalFilter
                withCheckbox
                bulkActions={bulkActionsMock}
                rowActions={{
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
});

export const WithStickyHeader: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
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
});

const TableWithVirtualScroll = () => {
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

export const WithVirtualScroll: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => <TableWithVirtualScroll />
});

export const WithPinnedColumns: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
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
});

export const WithGroupedColumns: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
                columns={withGroupedColumns}
                externalData={data}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
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
});

export const WithExpendRowsColumns: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = (savedData: Row[]) => {
            return savedData;
        };
        return (
            <Table
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
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
});

export const WithOutData: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        return (
            <Table
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
});

export default meta;
