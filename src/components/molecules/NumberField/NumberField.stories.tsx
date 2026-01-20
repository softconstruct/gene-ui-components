import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import NumberField, { INumberFieldProps } from "./index";

const meta: Meta<INumberFieldProps> = {
    title: "Molecules/NumberField",
    component: NumberField,
    argTypes: {
        value: args({ control: "text", ...propCategory.states }),
        defaultValue: args({ control: "number", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        step: args({ control: "number", ...propCategory.validation }),
        min: args({ control: "number", ...propCategory.validation }),
        max: args({ control: "number", ...propCategory.validation }),
        size: args({ control: "select", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onInputBlur: args({ control: "false", ...propCategory.action }),
        onInputFocus: args({ control: "false", ...propCategory.action }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality }),
        id: args({ control: "text", ...propCategory.others })
    },
    args: {
        defaultValue: 0,
        step: 1,
        size: "medium",
        status: "rest",
        label: "Label",
        helperText: "Helper text",
        required: true
    }
};

export default meta;

type Story = StoryObj<INumberFieldProps>;

export const Default: Story = {};
