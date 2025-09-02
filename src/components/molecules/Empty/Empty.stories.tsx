import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Empty, { IEmptyProps } from "./index";

const meta: Meta<IEmptyProps> = {
    title: "Molecules/Empty",
    component: Empty,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        message: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        src: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.functionality }),
        loading: args({ control: "boolean", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        size: "medium",
        message: "Some short message",
        description: "Some detailed description for the Empty component",
        appearance: "noData",
        actions: [
            {
                children: "Secondary",
                appearance: "secondary",
                layout: "outline"
            },
            {
                children: "Primary",
                appearance: "primary"
            }
        ]
    }
};

export default meta;

type Story = StoryObj<IEmptyProps>;

export const Default: Story = {};
