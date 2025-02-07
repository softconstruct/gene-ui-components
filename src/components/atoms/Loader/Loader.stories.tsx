import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Loader from "./index";

const meta: Meta<typeof Loader> = {
    title: "Atoms/Loader",
    component: Loader,
    argTypes: {
        isLoading: args({ control: "boolean", ...propCategory.states }),
        text: args({ control: "text", ...propCategory.content }),
        children: args({ control: "text", ...propCategory.content }),
        textPosition: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        text: "Loading Info",
        isLoading: true,
        textPosition: "after",
        size: "medium",
        appearance: "brand",
        children: "content is loaded"
    },
    parameters: {
        chromatic: { disableSnapshot: true }
    }
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};
