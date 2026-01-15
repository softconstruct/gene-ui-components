import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ProgressBar, { IProgressBarProps } from "./index";

const meta: Meta<IProgressBarProps> = {
    title: "Molecules/ProgressBar",
    component: ProgressBar,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content }),
        percent: args({ control: "number", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.states })
    },
    args: {
        uploadingText: "Uploading",
        type: "determinate",
        helperText: "Helper Text",
        percent: 44,
        size: "medium",
        label: "Label",
        status: "rest"
    }
};

export default meta;

type Story = StoryObj<IProgressBarProps>;

export const Default: Story = {};
