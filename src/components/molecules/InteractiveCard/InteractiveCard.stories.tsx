import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Components
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";
import InteractiveCard, { IInteractiveCardProps } from "@components/molecules/InteractiveCard";
import Switch from "@components/molecules/Switch";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IInteractiveCardProps> = {
    title: "Molecules/InteractiveCard",
    component: InteractiveCard,
    subcomponents: {
        Pill: Pill as ComponentType<unknown>,
        Checkbox: Checkbox as ComponentType<unknown>,
        Switch: Switch as ComponentType<unknown>
    },
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
        pill: args({ control: "false", ...propCategory.content }),
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
        onClick: (e) => e.preventDefault()
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
        },
        pill: { size: "small", withDot: false, text: "Pill", filled: true }
    },
    render: (props) => <InteractiveCard {...props} />
};

export const NonInteractiveWithSwitch: Story = {
    args: {
        interactive: false,
        actionProps: {
            type: "switch",
            onChange: () => {}
        },
        pill: { size: "small", withDot: false, text: "Pill", filled: true }
    },
    render: (props) => <InteractiveCard {...props} />
};
