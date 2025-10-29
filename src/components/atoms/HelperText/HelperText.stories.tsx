import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import HelperText, { IHelperTextProps } from "./index";

const meta: Meta<IHelperTextProps> = {
    title: "Atoms/HelperText",
    component: HelperText,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        size: "medium",
        text: "Helper Text",
        disabled: false
    }
};

export default meta;

type Story = StoryObj<IHelperTextProps>;

export const Default: Story = {};

export const Error: Story = {
    args: {
        status: "error"
    }
};

export const Warning: Story = {
    args: {
        status: "warning"
    }
};

export const WithCustomIcon: Story = {
    args: {
        Icon: Globe
    }
};
