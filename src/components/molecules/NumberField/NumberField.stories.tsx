import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import NumberField, { INumberFieldProps } from "./index";

const meta: Meta<INumberFieldProps> = {
    title: "Molecules/NumberField",
    component: NumberField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill NumberField component argTypes
    },
    args: {
        // fill NumberField component args
    }
};

export default meta;

type Story = StoryObj<INumberFieldProps>;

export const Default: Story = {};
