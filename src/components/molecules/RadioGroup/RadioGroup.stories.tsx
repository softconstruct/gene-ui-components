import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import RadioGroup, { IRadioGroupProps } from "./index";

const meta: Meta<IRadioGroupProps> = {
    title: "Molecules/RadioGroup",
    component: RadioGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill RadioGroup component argTypes
    },
    args: {
        // fill RadioGroup component args
    }
};

export default meta;

type Story = StoryObj<IRadioGroupProps>;

export const Default: Story = {};
