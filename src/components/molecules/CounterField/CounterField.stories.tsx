import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import CounterField, { ICounterFieldProps } from "./index";

const meta: Meta<ICounterFieldProps> = {
    title: "Molecules/CounterField",

    component: CounterField,

    argTypes: {
        value: args({ control: "false", ...propCategory.states }),

        defaultValue: args({ control: "number", ...propCategory.states }),

        disabled: args({ control: "boolean", ...propCategory.states }),

        readOnly: args({ control: "boolean", ...propCategory.states }),

        min: args({ control: "number", ...propCategory.validation }),

        step: args({ control: "number", defaultValue: 1, ...propCategory.validation }),

        size: args({ control: "select", ...propCategory.appearance }),

        status: args({ control: "select", ...propCategory.appearance }),

        className: args({ control: "false", ...propCategory.appearance }),

        label: args({ control: "text", ...propCategory.content }),

        infoText: args({ control: "text", ...propCategory.content }),

        helperText: args({ control: "text", ...propCategory.content }),

        required: args({ control: "boolean", ...propCategory.states }),

        onChange: args({ control: "false", ...propCategory.action }),

        onBlur: args({ control: "false", ...propCategory.action }),

        onFocus: args({ control: "false", ...propCategory.action })
    },

    args: {
        defaultValue: 0,

        min: 0,

        step: 1,

        size: "medium",

        status: "rest",

        label: "Quantity",

        helperText: "Helper text",

        required: false
    }
};

export default meta;

type Story = StoryObj<ICounterFieldProps>;

const Template: FC<ICounterFieldProps> = (props) => (
    <div style={{ maxWidth: 400 }}>
        <CounterField {...props} />
    </div>
);

export const Default: Story = {
    render: (props) => <Template {...props} />
};
