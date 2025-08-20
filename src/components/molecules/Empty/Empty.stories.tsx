import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Empty, { IEmptyProps } from "./index";

const meta: Meta<IEmptyProps> = {
    title: "Molecules/Empty",
    component: Empty,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),

        message: args({ control: "false", ...propCategory.others }),
        description: args({ control: "false", ...propCategory.others })
    },
    args: {
        message: "fill the message prop value",
        description: "fill the description prop value"
    }
};

export default meta;

type Story = StoryObj<IEmptyProps>;

export const Default: Story = {};
