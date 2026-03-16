import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import OTPField, { IOTPFieldProps } from "./index";

const meta: Meta<IOTPFieldProps> = {
    title: "Molecules/OTPField",
    component: OTPField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill OTPField component argTypes
    },
    args: {
        // fill OTPField component args
    }
};

export default meta;

type Story = StoryObj<IOTPFieldProps>;

export const Default: Story = {};
