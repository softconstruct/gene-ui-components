import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Label, { ILabelProps } from "./index";

const meta: Meta<ILabelProps> = {
    title: "Atoms/Label",
    component: Label,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        labelFor: args({ control: "false", ...propCategory.others })
    },
    args: {
        size: "medium",
        text: "label",
        required: false
    }
};

export default meta;

type Story = StoryObj<ILabelProps>;

export const Default: Story = {};

export const Required: Story = {
    args: {
        required: true
    }
};

export const WithInfo: Story = {
    args: {
        infoText: "Additional info for label"
    }
};
