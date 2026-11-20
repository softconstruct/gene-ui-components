import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Filter, { IFilterProps } from "./index";

const meta: Meta<IFilterProps> = {
    title: "Organisms/Filter",
    component: Filter,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Filter component argTypes
    },
    args: {
        // fill Filter component args
    }
};

export default meta;

type Story = StoryObj<IFilterProps>;

export const Default: Story = {};
