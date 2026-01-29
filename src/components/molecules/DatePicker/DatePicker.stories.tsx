import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DatePicker, { IDatePickerProps } from "./index";

const meta: Meta<IDatePickerProps> = {
    title: "Molecules/DatePicker",
    component: DatePicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill DatePicker component argTypes
    },
    args: {
        // fill DatePicker component args
    }
};

export default meta;

type Story = StoryObj<IDatePickerProps>;

export const Default: Story = {};
