import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TextField, { ITextFieldProps } from "./index";

const meta: Meta<ITextFieldProps> = {
    title: "Molecules/TextField",
    component: TextField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TextField component argTypes
    },
    args: {
        // fill TextField component args
    }
};

export default meta;

type Story = StoryObj<ITextFieldProps>;

export const Default: Story = {};
