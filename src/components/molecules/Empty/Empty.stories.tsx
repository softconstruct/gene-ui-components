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
        message: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        src: args({ control: "text", ...propCategory.content }),
        primaryActionText: args({ control: "text", ...propCategory.content }),
        secondaryActionText: args({ control: "text", ...propCategory.content }),
        onPrimaryActionClick: args({ control: "false", ...propCategory.action }),
        onSecondaryActionClick: args({ control: "false", ...propCategory.action }),
        loading: args({ control: "boolean", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        message: "Some short message",
        description: "Some detailed description for the Empty component",
        primaryActionText: "Primary action",
        secondaryActionText: "Secondary action"
    }
};

export default meta;

type Story = StoryObj<IEmptyProps>;

export const Default: Story = {};
