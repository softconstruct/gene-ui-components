import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TextArea, { ITextAreaProps } from "./index";

const meta: Meta<ITextAreaProps> = {
    title: "Molecules/TextArea",
    component: TextArea,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TextArea component argTypes
    },
    args: {
        // fill TextArea component args
    }
};

export default meta;

type Story = StoryObj<ITextAreaProps>;

export const Default: Story = {};
