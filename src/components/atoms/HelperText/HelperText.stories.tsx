import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import HelperText from "./index";

const meta: Meta<typeof HelperText> = {
    title: "Atoms/HelperText",
    component: HelperText,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        isDisabled: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        size: "medium",
        text: "Helper Text",
        isDisabled: false,
        type: "rest"
    }
};

export default meta;

type Story = StoryObj<typeof HelperText>;

export const Default: Story = {};

export const Error: Story = {
    args: {
        type: "error"
    }
};

export const Warning: Story = {
    args: {
        type: "warning"
    }
};

export const WithCustomIcon: Story = {
    args: {
        Icon: Globe
    }
};
