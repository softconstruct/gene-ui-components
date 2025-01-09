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
        className: args({ control: "false", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        direction: args({ control: "select", ...propCategory.appearance }),
        isLinear: args({ control: "boolean", ...propCategory.states })
        // fill Steps component argTypes
    },
    args: {
        label: "Label",
        description: "Description",
        direction: "vertical",
        isLinear: false
        // fill Steps component args
    } as IStepsProps
};

export default meta;

const Template: FC<IStepsProps> = (props) => <Steps {...props} />;

export const Default = Template.bind({});

Default.args = {} as IStepsProps;
