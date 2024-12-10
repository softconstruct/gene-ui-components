import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Rate, { IRateProps } from "./index";

const meta: Meta<typeof Rate> = {
    title: "Atoms/Rate",
    component: Rate,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Rate component argTypes
    },
    args: {
        // fill Rate component args
    } as IRateProps
};

export default meta;

const Template: FC<IRateProps> = (props) => <Rate {...props} />;

export const Default = Template.bind({});

Default.args = {} as IRateProps;
