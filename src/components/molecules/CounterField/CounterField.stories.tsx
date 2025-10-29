import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import CounterField, { ICounterFieldProps } from "./index";

const meta: Meta<ICounterFieldProps> = {
    title: "Molecules/CounterField",
    component: CounterField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill CounterField component argTypes
    },
    args: {
        // fill CounterField component args
    }
};

export default meta;

type Story = StoryObj<ICounterFieldProps>;

export const Default: Story = {};
