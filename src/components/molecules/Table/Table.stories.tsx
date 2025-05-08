import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { ITableProps } from "./index";

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Table component argTypes
    },
    args: {
        // fill Table component args
    }
};

export default meta;

type Story = StoryObj<ITableProps>;

export const Default: Story = {};
