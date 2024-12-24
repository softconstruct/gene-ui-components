import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Steps, { IStepsProps } from "./index";

const meta: Meta<typeof Steps> = {
    title: "Molecules/Steps",
    component: Steps,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Steps component argTypes
    },
    args: {
        // fill Steps component args
    } as IStepsProps
};

export default meta;

const Template: FC<IStepsProps> = (props) => <Steps {...props} />;

export const Default = Template.bind({});

Default.args = {} as IStepsProps;
