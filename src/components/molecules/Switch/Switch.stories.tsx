import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Switch, { ISwitchProps } from "@components/molecules/Switch";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<typeof Switch> = {
    title: "Molecules/Switch",
    component: Switch,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        value: args({ control: "false", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        checked: args({ control: "boolean", ...propCategory.states }),
        defaultChecked: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality }),
        name: args({ control: "false", ...propCategory.others }),
        id: args({ control: "text", ...propCategory.others }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        label: "Label",
        helperText: "Helper Text",
        disabled: false,
        readOnly: false
    } as ISwitchProps
};

export default meta;

type Story = StoryObj<ISwitchProps>;

export const Default: Story = {
    render: (props) => {
        return <Switch {...props} />;
    }
};
