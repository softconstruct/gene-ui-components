import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
// Components
import SplitButton, { ISplitButtonProps } from "./index";

const meta: Meta<ISplitButtonProps> = {
    title: "Atoms/SplitButton",
    component: SplitButton,
    argTypes: {
        // className: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ISplitButtonProps>;

export const Default: Story = {
    render: (props) => <SplitButton {...props} />
};
