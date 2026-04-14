import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TimePicker, { ITimePickerProps } from "./index";

const meta: Meta<ITimePickerProps> = {
    title: "Molecules/TimePicker",
    component: TimePicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TimePicker component argTypes
    },
    args: {
        // fill TimePicker component args
    }
};

export default meta;

type Story = StoryObj<ITimePickerProps>;

export const Default: Story = {};
