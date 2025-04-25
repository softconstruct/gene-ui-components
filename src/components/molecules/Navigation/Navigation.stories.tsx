import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Navigation, { INavigationProps } from "./index";

const meta: Meta<INavigationProps> = {
    title: "Molecules/Navigation",
    component: Navigation,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Navigation component argTypes
    },
    args: {
        // fill Navigation component args
    }
};

export default meta;

type Story = StoryObj<INavigationProps>;

export const Default: Story = {};
