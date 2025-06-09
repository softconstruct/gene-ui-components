import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { defaultColumns } from "@components/molecules/Table/Columns";

// Helpers
import { storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { ITableProps } from "./index";
import { makeData } from "./makeData";
import TableLayoutTmp from "./TableLayoutTmp";

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

const data = makeData(41);
export const TableStory: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        const onSave = () => {};
        return (
            <Table
                expandable
                withCheckbox
                columns={defaultColumns}
                externalData={data}
                rowActions={{
                    pin: (e) => {
                        console.log(e);
                    },
                    copy: (e) => {
                        console.log(e);
                    },
                    tag: (e) => {
                        console.log(e);
                    },
                    delete: (e) => {
                        console.log(e);
                    }
                }}
                onSave={onSave}
                pageSizes={[10, 20, 30, 42]}
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
