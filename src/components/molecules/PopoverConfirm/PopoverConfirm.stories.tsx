import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import PopoverConfirm, { IPopoverConfirmProps } from "./index";

const meta: Meta<IPopoverConfirmProps> = {
    title: "Molecules/PopoverConfirm",
    component: PopoverConfirm,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill PopoverConfirm component argTypes
    },
    args: {
        // fill PopoverConfirm component args
    }
};

export default meta;

type Story = StoryObj<IPopoverConfirmProps>;

export const Default: Story = {};
