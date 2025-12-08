import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

import Checkbox from "@components/molecules/Checkbox";
import Switch from "@components/molecules/Switch";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import InteractiveCard, { IInteractiveCardProps } from "./index";

const meta: Meta<IInteractiveCardProps> = {
    title: "Molecules/InteractiveCard",
    component: InteractiveCard,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        infoText: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        interactive: args({ control: "false", ...propCategory.states }),
        onClick: args({ control: "false", ...propCategory.action }),
        action: args({ control: "false", ...propCategory.content }),
        onFocus: args({ control: "false", ...propCategory.action })
    },
    args: {
        size: "medium",
        label: "Label",
        required: false,
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
        interactive: false
    },
    render: (props) => (
        <InteractiveCard
            {...props}
            action={<Checkbox onChange={() => {}} name="card-checkbox" value="card-option" />}
        />
    )
};

export const NonInteractiveWithSwitch: Story = {
    args: {
        interactive: false
    },
    render: (props) => <InteractiveCard {...props} action={<Switch onChange={() => {}} />} />
};
