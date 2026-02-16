import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ColorPicker, { IColorPickerProps } from "./index";

const meta: Meta<IColorPickerProps> = {
    title: "Molecules/ColorPicker",
    component: ColorPicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ColorPicker component argTypes
    },
    args: {
        // fill ColorPicker component args
    }
};

export default meta;

type Story = StoryObj<IColorPickerProps>;

export const Default: Story = {};
