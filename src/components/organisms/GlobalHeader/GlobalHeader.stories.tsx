import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import GlobalHeader, { IGlobalHeaderProps } from "./index";

const meta: Meta<IGlobalHeaderProps> = {
    title: "Organisms/GlobalHeader",
    component: GlobalHeader,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill GlobalHeader component argTypes
    },
    args: {
        // fill GlobalHeader component args
    }
};

export default meta;

type Story = StoryObj<IGlobalHeaderProps>;

export const Default: Story = {
    render: (props) => <GlobalHeader {...props} />
};
