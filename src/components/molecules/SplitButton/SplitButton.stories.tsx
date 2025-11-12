import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Helpers
// Components
import { ISplitButtonProps, SplitButton, SplitButtonItem } from "./index";

const meta: Meta<ISplitButtonProps> = {
    title: "Molecules/SplitButton",
    component: SplitButton,
    subcomponents: { SplitButtonItem: SplitButtonItem as ComponentType<unknown> },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
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
                <SplitButtonItem>213</SplitButtonItem>
                <SplitButtonItem>213</SplitButtonItem>
                <SplitButtonItem>213</SplitButtonItem>
                <SplitButtonItem>213</SplitButtonItem>
                <SplitButtonItem>213</SplitButtonItem>
            </SplitButton>
        </div>
    )
};
