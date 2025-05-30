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
        className: args({ control: "false", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        labelAlignment: args({ control: "select", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.states }),
        defaultChecked: args({ control: "boolean", ...propCategory.states }),
        checked: args({ control: "boolean", ...propCategory.states }),
        name: args({ control: "false", ...propCategory.others }),
        value: args({ control: "false", ...propCategory.others })
    },
    args: {
        label: "Label",
        helperText: "Helper Text",
        disabled: false,
        readOnly: false,
        labelAlignment: "after"
    } as ISwitchProps
};

export default meta;

type Story = StoryObj<ISwitchProps>;

export const Default: Story = {
    render: (props) => {
        return <Switch {...props} />;
    }
};
