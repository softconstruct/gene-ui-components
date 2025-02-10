import { Meta, StoryObj } from "@storybook/react";
import { args, propCategory } from "stories/assets/storybook.globals";

import { Search } from "@geneui/icons";

import Button, { IButtonProps } from "./index";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content }),
        displayType: args({ control: "select", ...propCategory.appearance }),
        fullWidth: args({ control: "boolean", ...propCategory.appearance }),
        iconAfter: args({ control: "boolean", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        Icon: args({ control: "false", ...propCategory.content }),
        name: args({ control: "false", ...propCategory.functionality }),
        onClick: args({ control: "false", ...propCategory.action })
    },
    args: {
        text: "Button",
        appearance: "primary",
        size: "large",
        displayType: "fill",
        isLoading: false
    }
};

export default meta;

type Story = StoryObj<IButtonProps>;

export const Default: Story = {
    // This story uses the default args from the meta export.
};

export const WithIcon: Story = {
    args: {
        Icon: Search
    }
};
