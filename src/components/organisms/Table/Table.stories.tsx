import { Meta, StoryObj } from "@storybook/react";

import { IMenuItemProps } from "@components/molecules/Menu";
import { Actions, IBulkActions, IManageColumnsInfo } from "@components/organisms/Table/types";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Table, { ITableProps } from "./index";

const bulkActionsMock: IBulkActions = {
    label: "Bulk",
    onChange: (item: IMenuItemProps) => console.log(item),
    list: [
        {
            id: 1,
            title: "Item 1"
        },
        {
            id: 2,
            title: "Item 2"
        },
        {
            id: 3,
            title: "item 3"
        }
    ]
};

const manageColumnsInfo: IManageColumnsInfo = {
    manageColumns: {
        label: "Active Columns",
        actionsInfo: {
            primary: {
                label: "Save"
            },
            secondary: {
                label: "Cancel"
            },
            tertiary: {
                label: "Restore Defaults"
            }
        }
    },
    manageColumnsTitle: "Manage Columns",
    isManageColumnsDisabled: false
};

const editActions: Actions = {
    primary: {
        label: "Save"
    },
    secondary: {
        label: "Cancel"
    },
    tertiary: {
        label: "Edit"
    }
};

const meta: Meta<ITableProps> = {
    title: "Organisms/Table",
    component: Table,
    argTypes: {
        rowSelectionInfo: args({ control: "false", ...propCategory.content }),
        globalFilterInfo: args({ control: "false", ...propCategory.content }),
        manageColumnsInfo: args({ control: "false", ...propCategory.content }),
        bulkActions: args({ control: "false", ...propCategory.content }),
        editActions: args({ control: "false", ...propCategory.content })
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
        bulkActions: bulkActionsMock,
        manageColumnsInfo,
        editActions
    }
};

export default meta;

type Story = StoryObj<ITableProps>;

export const Default: Story = {};
