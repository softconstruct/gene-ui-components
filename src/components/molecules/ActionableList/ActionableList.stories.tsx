import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ActionableList, { IActionableListProps } from "./index";

const meta: Meta<IActionableListProps> = {
    title: "Molecules/ActionableList",
    component: ActionableList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ActionableList component argTypes
    },
    args: {
        // fill ActionableList component args
    }
};

export default meta;

type Story = StoryObj<IActionableListProps>;

export const Default: Story = {};
