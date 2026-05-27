import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import SearchField, { ISearchFieldProps } from "./index";

const meta: Meta<ISearchFieldProps> = {
    title: "Molecules/SearchField",
    component: SearchField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ISearchFieldProps>;

export const Default: Story = {
    render: (props) => (
        <div style={{ padding: "2rem", minHeight: "300px", width: "320px" }}>
            <SearchField {...props} />
        </div>
    )
};
