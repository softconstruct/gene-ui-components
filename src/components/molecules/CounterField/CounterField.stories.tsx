import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import CounterField, { ICounterFieldProps } from "./index";

const meta: Meta<typeof CounterField> = {
    title: "Molecules/CounterField",
    component: CounterField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill CounterField component argTypes
    },
    args: {
        // fill CounterField component args
    } as ICounterFieldProps
};

export default meta;

const Template: FC<ICounterFieldProps> = (props) => <CounterField {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICounterFieldProps;
