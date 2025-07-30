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
        rowsPerPageOptions: args({ control: "array", ...propCategory.content }),
        totalItems: args({ control: "number", ...propCategory.content }),
        currentPageItemsLength: args({ control: "number", ...propCategory.content }),
        totalPages: args({ control: "number", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance }),
        onPageChange: args({ control: "false", ...propCategory.action }),
        onPageSizeChange: args({ control: "false", ...propCategory.action }),
        showInputPageField: args({ control: "boolean", ...propCategory.states }),
        pageSizeSuffixLabel: args({ control: "text", ...propCategory.content }),
        pageSizeOfLabel: args({ control: "text", ...propCategory.content }),
        goToPageLabel: args({ control: "text", ...propCategory.content }),
        goToPageSuffixLabel: args({ control: "text", ...propCategory.content })
    },

    args: {
        current: 30,
        rowsPerPageOptions: [10, 20, 30, 40],
        currentPageItemsLength: 20,
        totalItems: 300,
        totalPages: 25
    }
};

export default meta;

type Story = StoryObj<IPaginationProps>;

export const Default: Story = {
    render: (props) => {
        return <Pagination {...props} showInputPageField />;
    }
};

export const WithoutPageSize: Story = {
    render: (props) => {
        return <Pagination {...props} rowsPerPageOptions={undefined} showInputPageField />;
    }
};

export const WithoutPageInputField: Story = {
    render: (props) => {
        return <Pagination {...props} showInputPageField={undefined} />;
    }
};

export const WithoutPageSizeAndPageInputField: Story = {
    args: {
        current: 25
    },

    render: (props) => {
        return <Pagination {...props} showInputPageField={undefined} rowsPerPageOptions={undefined} />;
    },

    argTypes: {
        showInputPageField: args({ control: "false", ...propCategory.states })
    }
};
