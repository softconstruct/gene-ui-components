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
        labelText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        readOnly: args({ control: "false", ...propCategory.states })
    },
    args: {
        size: "medium",
        labelText: "label",
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
