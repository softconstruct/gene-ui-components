import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Info, { IInfoProps } from "./index";

const meta: Meta<IInfoProps> = {
    title: "Atoms/Info",
    component: Info,
    argTypes: {
        infoText: args({ control: "text", ...propCategory.content }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        presentational: args({ control: "boolean", ...propCategory.functionality }),
        "aria-label": args({ control: "text", ...propCategory.others }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        infoText: "info text"
    }
};

export default meta;

type Story = StoryObj<IInfoProps>;

export const Default: Story = {};
