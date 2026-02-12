import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { IMenuItemProps } from "@components/molecules/Menu";
import { Actions, IBulkActions, IManageColumnsInfo } from "@components/organisms/Table/types";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { Columns, TableData } from "../../../../stories/data/__table";
// Components
import Table, { ITableProps } from "./index";

const SwapComponent = () => (
    <div
        className="swapComponent"
        style={{
            background: "#F4E1EC",
            padding: ".6rem 1.2rem",
            color: "#A60063",
            height: "100%"
        }}
    >
        Swap
    </div>
);

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
        data: args({ control: "false", ...propCategory.content }),
        columns: args({ control: "false", ...propCategory.content }),
        rowSelectionInfo: args({ control: "false", ...propCategory.content }),
        globalFilterInfo: args({ control: "false", ...propCategory.content }),
        manageColumnsInfo: args({ control: "false", ...propCategory.content }),
        bulkActions: args({ control: "false", ...propCategory.content }),
        editActions: args({ control: "false", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content }),
        selectAllText: args({ control: "text", ...propCategory.content }),
        columnResizeDirection: args({ control: "select", ...propCategory.appearance }),
        withToolbar: args({ control: "boolean", ...propCategory.content }),
        withPagination: args({ control: "boolean", ...propCategory.content }),
        withVirtualScroll: args({ control: "boolean", ...propCategory.content }),
        withStickyHeader: args({ control: "boolean", ...propCategory.content }),
        withStickyFooter: args({ control: "boolean", ...propCategory.content }),
        withManualSorting: args({ control: "boolean", ...propCategory.content }),
        withFilterFromLeafRows: args({ control: "boolean", ...propCategory.content }),
        onSort: args({ control: "false", ...propCategory.action }),
        onGlobalFilter: args({ control: "false", ...propCategory.action }),
        onColumnFilter: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        data: TableData,
        columns: Columns,
        rowSelectionInfo: {
            selectedRowsLength: 0,
            selectedRowsLabel: "selected",
            deselectTitle: "Deselect"
        },
        globalFilterInfo: {
            withGlobalFilter: true,
            withManualFiltering: true
        },
        columnResizeDirection: "ltr",
        bulkActions: bulkActionsMock,
        manageColumnsInfo,
        editActions,
        headerContent: <SwapComponent />,
        withToolbar: true,
        withPagination: true,
        withVirtualScroll: false,
        withManualSorting: false,
        onSort: undefined,
        onColumnFilter: undefined
    }
};

export default meta;

type Story = StoryObj<ITableProps>;

export const Default: Story = {};
