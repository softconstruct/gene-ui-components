import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import InteractiveCard, { IInteractiveCardProps } from "./index";

const meta: Meta<IInteractiveCardProps> = {
    title: "Molecules/InteractiveCard",
    component: InteractiveCard,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill InteractiveCard component argTypes
    },
    args: {
        // fill InteractiveCard component args
    }
};

export default meta;

type Story = StoryObj<IInteractiveCardProps>;

export const Default: Story = {};
