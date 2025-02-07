import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Pill from "./index";

const meta: Meta<typeof Pill> = {
    title: "Atoms/Pill",
    component: Pill,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        color: args({ control: "select", ...propCategory.appearance }),
        Icon: args({ control: "false", ...propCategory.content }),
        text: args({ control: "text", ...propCategory.content }),
        isFill: args({ control: "boolean", ...propCategory.appearance }),
        iconAlignment: args({ control: "select", ...propCategory.appearance }),
        withDot: args({ control: "boolean", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        size: "medium",
        color: "informative",
        isFill: true,
        text: "Pill",
        withDot: true
    }
};

export default meta;

type Story = StoryObj<typeof Pill>;

export const Default: Story = {};

export const WithCustomIcon: Story = {
    args: {
        Icon: Globe
    }
};
