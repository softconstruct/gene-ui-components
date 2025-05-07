import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Pagination, { IPaginationProps } from "./index";

const meta: Meta<IPaginationProps> = {
    title: "Molecules/Pagination",
    component: Pagination,
    argTypes: {
        current: args({ control: "text", ...propCategory.content }),
        pageSizes: args({ control: "false", ...propCategory.content }),
        totalPages: args({ control: "text", ...propCategory.content }),

        onPageChange: args({ control: "false", ...propCategory.action }),
        onPageSizeChange: args({ control: "false", ...propCategory.action }),

        showInputPageField: args({ control: "boolean", ...propCategory.state })
    },

    args: {
        current: 10,
        pageSizes: [10, 20, 30],
        totalPages: 25
    }
};

export default meta;

type Story = StoryObj<IPaginationProps>;

export const Default: Story = {
    render: (props) => {
        return <Pagination {...props} />;
    }
};

export const WithoutPageSize: Story = {
    render: (props) => {
        return <Pagination {...props} pageSizes={undefined} showInputPageField />;
    }
};

export const WithoutPageInputField: Story = {
    render: (props) => {
        return <Pagination {...props} showInputPageField={undefined} />;
    }
};

export const WithoutPageSizeAndPageInputField: Story = {
    render: (props) => {
        return <Pagination {...props} showInputPageField={undefined} pageSizes={undefined} />;
    }
};
