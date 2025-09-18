import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Banner, { IBannerProps } from "./index";

const meta: Meta<typeof Banner> = {
    title: "Molecules/Banner",
    component: Banner,
    argTypes: {
        text: args({ control: "text", ...propCategory.content }),
        type: args({ control: "select", ...propCategory.appearance }),
        visible: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: false, ...propCategory.action })
    },
    args: {
        text: "Description text goes here.",
        type: "informational"
    }
};

export default meta;

type Story = StoryObj<IBannerProps>;

export const Default: Story = {};
