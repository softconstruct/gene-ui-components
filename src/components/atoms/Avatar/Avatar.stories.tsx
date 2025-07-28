import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Avatar, { IAvatarProps } from "./index";

const meta: Meta<IAvatarProps> = {
    title: "Atoms/Avatar",
    component: Avatar,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        color: args({ control: "select", ...propCategory.appearance }),
        src: args({ control: "text", ...propCategory.content }),
        fullName: args({ control: "text", ...propCategory.content }),
        onClick: args({ control: "false", ...propCategory.action }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        Icon: args({ control: "false", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        size: "6Xlarge",
        color: "lagoon",
        fullName: "name lastName",
        disabled: false
    }
};

export default meta;

type Story = StoryObj<IAvatarProps>;

export const Default: Story = {};

export const WithIcons: Story = {
    args: {
        fullName: "",
        Icon: Globe,
        onClick: undefined
    }
};
