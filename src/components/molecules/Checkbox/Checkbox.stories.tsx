import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Checkbox, { ICheckboxProps } from "./index";

const meta: Meta<ICheckboxProps> = {
    title: "Molecules/Checkbox",
    component: Checkbox,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        value: args({ control: "false", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        checked: args({ control: "boolean", ...propCategory.states }),
        defaultChecked: args({ control: "boolean", ...propCategory.states }),
        indeterminate: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality }),
        name: args({ control: "text", ...propCategory.others }),
        onClick: args({ control: "false", ...propCategory.action }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        id: args({ control: "text", ...propCategory.others })
    },
    args: {
        label: "Label",
        infoText: "info text",
        helperText: "helper text"
    }
};

export default meta;

type Story = StoryObj<ICheckboxProps>;

export const Default: Story = {
    render: (props) => {
        return <Checkbox {...props} />;
    }
};
