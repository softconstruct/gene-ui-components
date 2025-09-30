import { Meta, StoryObj } from "@storybook/react";
import { args, propCategory } from "stories/assets/storybook.globals";

import { Magnifier } from "@geneui/icons";

import Button, { IButtonProps } from "./index";

const meta: Meta<IButtonProps> = {
    title: "Atoms/Button",
    component: Button,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "text", ...propCategory.content }),
        layout: args({ control: "select", ...propCategory.appearance }),
        fullWidth: args({ control: "boolean", ...propCategory.appearance }),
        iconPosition: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        Icon: args({ control: "false", ...propCategory.content }),
        name: args({ control: "false", ...propCategory.others }),
        ariaLabel: args({ control: "text", ...propCategory.others }),
        "aria-expanded": args({ control: "text", ...propCategory.others }),
        onClick: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        type: args({ control: "select", ...propCategory.functionality }),
        tabIndex: args({ control: "number", ...propCategory.others })
    },
    args: {
        children: "Button",
        appearance: "primary",
        size: "large",
        layout: "fill",
        iconPosition: "before",
        loading: false
    }
};

export default meta;

type Story = StoryObj<IButtonProps>;

export const Default: Story = {};

export const WithIcon: Story = {
    args: {
        Icon: Magnifier
    }
};
