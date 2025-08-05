import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Drawer, { IDrawerProps } from "./index";

const meta: Meta<IDrawerProps> = {
    title: "Molecules/Drawer",
    component: Drawer,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Drawer component argTypes
    },
    args: {
        // fill Drawer component args
    }
};

export default meta;

type Story = StoryObj<IDrawerProps>;

export const Default: Story = {};
