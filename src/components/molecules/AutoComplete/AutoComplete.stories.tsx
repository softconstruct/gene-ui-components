import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import AutoComplete, { IAutoCompleteProps } from "./index";

const meta: Meta<IAutoCompleteProps> = {
    title: "Molecules/AutoComplete",
    component: AutoComplete,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill AutoComplete component argTypes
    },
    args: {
        // fill AutoComplete component args
    }
};

export default meta;

type Story = StoryObj<IAutoCompleteProps>;

export const Default: Story = {};
