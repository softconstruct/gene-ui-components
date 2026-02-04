import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { ITableProps } from "./index";

const meta: Meta<ITableProps> = {
    title: "Organisms/Table",
    component: Table,
    argTypes: {
        rowSelectionInfo: args({ control: "false", ...propCategory.content }),
        globalFilterInfo: args({ control: "false", ...propCategory.content }),
        manageColumnsTitle: args({ control: "string", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        rowSelectionInfo: {
            selectedRowsLength: 0,
            selectedRowsLabel: "selected",
            deselectTitle: "Deselect"
        },
        globalFilterInfo: {
            withGlobalFilter: true,
            withManualFiltering: true
        },
        manageColumnsTitle: "Manage Columns"
    }
};

export default meta;

type Story = StoryObj<ITableProps>;

export const Default: Story = {};
