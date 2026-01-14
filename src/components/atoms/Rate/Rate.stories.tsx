import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Rating, { IRateProps } from ".";

const meta: Meta<IRateProps> = {
    title: "Atoms/Rate",
    component: Rating,
    argTypes: {
        defaultValue: args({ control: "number", defaultValue: 0, ...propCategory.content }),
        value: args({ control: "false", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        count: args({ control: "number", defaultValue: 5, ...propCategory.content }),
        size: args({ control: "select", defaultValue: "small", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        readOnly: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        halfAllow: args({ control: "boolean", defaultValue: false, ...propCategory.functionality }),
        disabled: args({ control: "boolean", defaultValue: false, ...propCategory.states })
    },
    args: {
        count: 5,
        defaultValue: 0,
        label: "Rate Label",
        helperText: "Select a rating"
    }
};

export default meta;

type Story = StoryObj<IRateProps>;

export const Default: Story = {
    render: (props) => {
        return <Rating {...props} />;
    }
};
