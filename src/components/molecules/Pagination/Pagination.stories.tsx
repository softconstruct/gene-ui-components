import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Pagination, { IPaginationProps } from "./index";

const meta: Meta<IPaginationProps> = {
    title: "Molecules/Pagination",
    component: Pagination,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Pagination component argTypes
    },
    args: {
        // fill Pagination component args
    }
};

export default meta;

type Story = StoryObj<IPaginationProps>;

export const Default: Story = {};
