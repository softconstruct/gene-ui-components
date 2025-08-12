import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Drawer, { IDrawerProps } from "./index";

const meta: Meta<IDrawerProps> = {
    title: "Molecules/Drawer",
    component: Drawer,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        withPadding: args({ control: "boolean", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        withPadding: true,
        title: "Drawer Title",
        open: true
    }
};

export default meta;

type Story = StoryObj<IDrawerProps>;

const DrawerTemplate: FC = (props) => {
    return <Drawer {...props} />;
};

export const Default: Story = {
    render: (props) => <DrawerTemplate {...props} />
};
