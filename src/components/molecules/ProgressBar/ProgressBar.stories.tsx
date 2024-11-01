import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import ProgressBar, { IProgressBarProps } from "./index";

const meta: Meta<typeof ProgressBar> = {
    title: "Molecules/ProgressBar",
    component: ProgressBar,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ProgressBar component argTypes
    },
    args: {
        // fill ProgressBar component args
    } as IProgressBarProps
};

export default meta;

const Template: FC<IProgressBarProps> = (props) => <ProgressBar {...props} />;

export const Default = Template.bind({});

Default.args = {} as IProgressBarProps;
