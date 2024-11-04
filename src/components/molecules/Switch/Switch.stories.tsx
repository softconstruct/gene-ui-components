import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Switch, { ISwitchProps } from "./index";

const meta: Meta<typeof Switch> = {
    title: "Molecules/Switch",
    component: Switch,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Switch component argTypes
    },
    args: {
        // fill Switch component args
    } as ISwitchProps
};

export default meta;

const Template: FC<ISwitchProps> = (props) => <Switch {...props} />;

export const Default = Template.bind({});

Default.args = {} as ISwitchProps;
