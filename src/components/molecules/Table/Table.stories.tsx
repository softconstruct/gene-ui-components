import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { mockColumns, mockData } from "../../../../stories/data/__dataTable";
// Components
import Table, { ITableProps } from "./index";

type MockRowType = (typeof mockData)[0];

const meta: Meta<ITableProps<MockRowType>> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        pagination: args({ control: "object", ...propCategory.functionality }),
        columns: args({ control: "false", ...propCategory.content }),
        data: args({ control: "false", ...propCategory.content }),
        errorTexts: args({ control: "object", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        noDataAvailableActions: args({ control: "false", ...propCategory.functionality })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ITableProps<MockRowType>>;

export const Default: Story = {
    render: (props) => <Table {...props} />,
    args: {
        columns: mockColumns,
        data: mockData,
        pagination: { rowsPerPageOptions: [2, 10, 20, 50, 100], showInputPageField: true }
    }
};

export const NoDataAvailable: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns }
};

export const Loading: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, loading: true }
};

export const WithPagination: Story = {
    render: (props) => <Table {...props} />,
    args: { columns: mockColumns, data: mockData, pagination: true }
};
