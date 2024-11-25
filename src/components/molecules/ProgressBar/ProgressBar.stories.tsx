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
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.functionality }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content }),
        percent: args({ control: "number", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        error: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        uploadingText: "Uploading",
        type: "determinate",
        helperText: "Helper Text",
        percent: 44,
        size: "medium",
        label: "Label"
    } as IProgressBarProps
};

export default meta;

const Template: FC<IProgressBarProps> = (props) => <ProgressBar {...props} />;

export const Default = Template.bind({});

Default.args = {} as IProgressBarProps;
