import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import InteractiveCard, { IInteractiveCardProps } from "./index";

const meta: Meta<IInteractiveCardProps> = {
    title: "Molecules/InteractiveCard",
    component: InteractiveCard,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        interactive: args({ control: "false", ...propCategory.states }),
        onClick: args({ control: "false", ...propCategory.action }),
        actionProps: args({ control: "false", ...propCategory.content }),
        pillProps: args({ control: "false", ...propCategory.content }),
        onFocus: args({ control: "false", ...propCategory.action })
    },
    args: {
        size: "medium",
        label: "Label",
        infoText: "info text",
        description: "description",
        Icon: Globe,
        disabled: false,
        interactive: true,
        onClick: (e) => e.preventDefault(),
        pillProps: { size: "small", withDot: false, text: "Pill", filled: true }
    }
};

export default meta;

type Story = StoryObj<IInteractiveCardProps>;

export const Default: Story = {};

export const NonInteractiveWithCheckbox: Story = {
    args: {
        interactive: false,
        actionProps: {
            type: "checkbox",
            name: "card-checkbox",
            value: "card-option",
            onChange: () => {}
        }
    },
    render: (props) => <InteractiveCard {...props} />
};

export const NonInteractiveWithSwitch: Story = {
    args: {
        interactive: false,
        actionProps: {
            type: "switch",
            onChange: () => {}
        }
    },
    render: (props) => <InteractiveCard {...props} />
};
