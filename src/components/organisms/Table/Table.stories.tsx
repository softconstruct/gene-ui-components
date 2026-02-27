import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { VisibilityState } from "@tanstack/react-table";

// Components
import { IMenuItemProps } from "@components/molecules/Menu";
import {
    IBulkActions,
    IEditActions,
    IManageColumnsActions,
    IManageColumnsInfo,
    ManageColumnsSavedDataType,
    Row
} from "@components/organisms/Table/types";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { Columns, TableData } from "../../../../stories/data/__table";
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
        actionsInfo: {}
    },
    manageColumnsTitle: "Manage Columns",
    isManageColumnsDisabled: false
};

const defaultEditActions: IEditActions = {
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
        editMode: args({ control: "boolean", ...propCategory.states }),
        withManualFiltering: args({ control: "boolean", ...propCategory.states }),
        withToolbar: args({ control: "boolean", ...propCategory.content }),
        withPagination: args({ control: "boolean", ...propCategory.content }),
        withVirtualScroll: args({ control: "boolean", ...propCategory.states }),
        withStickyHeader: args({ control: "boolean", ...propCategory.states }),
        withStickyFooter: args({ control: "boolean", ...propCategory.states }),
        withManualSorting: args({ control: "boolean", ...propCategory.states }),
        withFilterFromLeafRows: args({ control: "boolean", ...propCategory.states }),
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
        editActions: defaultEditActions,
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

const TableComponent: FC<ITableProps> = (props) => {
    const { data } = props;
    const [tableData, setTableData] = useState(() => data);
    const [editableState, setEditableState] = useState(false);
    const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

    const onSave = (updatedData: Row[]) => {
        setTableData(updatedData);
        setEditableState(false);
    };

    const onEdit = () => {
        setEditableState(true);
    };
    const onCancel = () => {
        setEditableState(false);
    };

    const editActions = {
        primary: { label: "Save", onClick: onSave },
        secondary: { label: "Cancel", onClick: onCancel },
        tertiary: { label: "Edit", onClick: onEdit }
    };

    const handleColumnsSave = (savedData: ManageColumnsSavedDataType) => {
        const { pinnedColumns: pinnedCols, columnsOrdering, visibilityColumns } = savedData;

        setColumnVisibility(visibilityColumns);
        setPinnedColumns(pinnedCols || []);
        setColumnOrder(columnsOrdering);
    };

    const manageColumnsActions: IManageColumnsActions = {
        primary: {
            label: "Save",
            onClick: handleColumnsSave
        },
        secondary: {
            label: "Cancel"
        },
        tertiary: {
            label: "Restore Defaults"
        }
    };

    const manageColumns: IManageColumnsInfo = {
        ...manageColumnsInfo,
        manageColumns: { ...manageColumnsInfo.manageColumns, actionsInfo: manageColumnsActions }
    };

    return (
        <div style={{ height: 700, overflow: "auto" }}>
            <Table
                {...props}
                columnOrder={columnOrder}
                columnVisibility={columnVisibility}
                pinnedColumns={pinnedColumns}
                data={tableData}
                bulkActions={bulkActionsMock}
                editMode={editableState}
                editActions={editActions}
                manageColumnsInfo={manageColumns}
            />
        </div>
    );
};

export const Default: Story = {
    render: (props: ITableProps) => {
        return <TableComponent {...props} />;
    },
    args: {}
};
