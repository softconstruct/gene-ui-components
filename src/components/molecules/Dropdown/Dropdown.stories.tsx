import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Dropdown, { IDropdownProps } from "./index";

const meta: Meta<IDropdownProps> = {
    title: "Molecules/Dropdown",
    component: Dropdown,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Dropdown component argTypes
    },
    args: {
        // fill Dropdown component args
    }
};

export default meta;

type Story = StoryObj<IDropdownProps>;

export const Default: Story = {};
