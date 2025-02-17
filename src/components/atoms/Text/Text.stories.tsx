import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Text, { ITextProps } from "./index";

const meta: Meta<ITextProps> = {
    title: "Atoms/Text",
    component: Text,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "text", ...propCategory.content }),
        variant: args({ control: "select", ...propCategory.appearance }),
        as: args({ control: "select", ...propCategory.appearance }),
        alignment: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        children: "Text content",
        variant: "headingLargeSemibold"
    }
};

export default meta;

type Story = StoryObj<ITextProps>;

export const Default: Story = {
    args: {
        as: "h1"
    }
};
