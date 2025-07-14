import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { defaultColumns } from "@components/molecules/Table/Columns";

// Helpers
import { storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { BulkAction, ITableProps, Row } from "./index";
import { makeData } from "./makeData";
import TableLayoutTmp from "./TableLayoutTmp";

const bulkActionsMock: BulkAction = {
    label: "Bulk",
    list: [
        {
            id: 1,
            label: "item",
            action: (event) => console.log(event)
        },
        {
            id: 2,
            label: "item",
            action: (event) => console.log(event)
        },
        {
            id: 3,
            label: "item",
            action: (event) => console.log(event)
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
export const TableStory: Story = storyObjBuilder({
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
                withCheckbox
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

export const TableLayout: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        return <TableLayoutTmp />;
    }
});
export default meta;
