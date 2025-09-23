import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Tag, { ITagProps } from "./index";

const meta: Meta<ITagProps> = {
    title: "Molecules/Tag",
    component: Tag,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        withIcon: args({ control: "boolean", ...propCategory.content }),
        text: args({ control: "text", ...propCategory.content }),
        onClose: args({ control: "false", ...propCategory.action })
    },
    args: {
        text: "Tag",
        withIcon: true
    }
};

export default meta;

type Story = StoryObj<ITagProps>;

export const Default: Story = {};
