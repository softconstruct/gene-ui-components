import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { args, propCategory } from "stories/assets/storybook.globals";

// Helpers
// Components
import SplitButton, { ActionIItem, ISplitButtonProps } from "./index";

const meta: Meta<ISplitButtonProps> = {
    title: "Atoms/SplitButton",
    component: SplitButton,
    argTypes: {
        // className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

type Story = StoryObj<ISplitButtonProps>;

export const Default: Story = {
    render: (props) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <SplitButton {...props}>
                <ActionIItem>213</ActionIItem>
                <ActionIItem>213</ActionIItem>
                <ActionIItem>213</ActionIItem>
                <ActionIItem>213</ActionIItem>
                <ActionIItem>213</ActionIItem>
            </SplitButton>
        </div>
    )
};
