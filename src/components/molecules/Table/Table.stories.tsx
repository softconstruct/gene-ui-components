import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Mockups
import { mockColumns, mockData } from "@components/molecules/Table/Table.mock";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { ITableProps } from "./index";

type MockRowType = (typeof mockData)[0];

const meta: Meta<ITableProps<MockRowType>> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        // pagination: args({ control: "boolean", ...propCategory.functionality }),
        columns: args({ control: "false", ...propCategory.content }),
        data: args({ control: "false", ...propCategory.content })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ITableProps<MockRowType>>;

export const Default: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, data: mockData }
};

export const NoDataAvailable: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns }
};

export const NoResultFound: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, data: [] }
};

export const Loading: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, loading: true }
};

export const WithPagination: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, data: mockData, pagination: true }
};
