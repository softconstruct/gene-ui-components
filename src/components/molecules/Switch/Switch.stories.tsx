import React, { FC } from "react";
import { Meta } from "@storybook/react";

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
        readOnly: args({ control: "boolean", ...propCategory.states })
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

const Template: FC<ISwitchProps> = (props) => <Switch {...props} />;

export const Default = Template.bind({});

Default.args = {} as ISwitchProps;
