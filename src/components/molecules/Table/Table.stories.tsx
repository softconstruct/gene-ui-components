import React, { ComponentType } from "react";
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

const data = makeData(3);
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
                showPagination
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
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
                withPagination
                showPagination
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
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
                withPagination
                showPagination
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                expandable
                bulkActions={bulkActionsMock}
                rowActions={{
                    delete: (id) => console.log(id)
                }}
                onSave={(savedData) => onSave(savedData)}
            />
        );
    }
});

export default meta;
