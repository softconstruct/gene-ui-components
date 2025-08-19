import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { IMenuItemProps } from "@components/molecules/Menu";
import { ISwitchProps } from "@components/molecules/Switch";
import { defaultColumns, withGroupedColumns, withPinnedColumns } from "@components/molecules/Table/Columns";
// Components
import { deepCloneWithFunctions } from "@components/molecules/Table/helpers";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Table, { BulkAction, ITableProps } from "./index";
import { makeData } from "./makeData";

const HeaderContent = () => (
    <div
        className="swapComponent"
        style={{
            background: "#F4E1EC",
            padding: ".6rem 1.2rem",
            color: "#A60063"
        }}
    >
        Swap
    </div>
);

const bulkActionsMock: BulkAction = {
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

const externalData = makeData(10);

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        columns: args({ control: "false", ...propCategory.content }),
        externalData: args({ control: "false", ...propCategory.content }),
        expandable: args({ control: "boolean", ...propCategory.content }),
        withCheckbox: args({ control: "boolean", ...propCategory.content }),
        onRowClick: args({ control: "false", ...propCategory.action }),
        onRowPinToggle: args({ control: "false", ...propCategory.action }),
        onRowTag: args({ control: "false", ...propCategory.action }),
        onRowClock: args({ control: "false", ...propCategory.action }),
        onRowReload: args({ control: "false", ...propCategory.action }),
        onRowCopy: args({ control: "false", ...propCategory.action }),
        onRowDownload: args({ control: "false", ...propCategory.action }),
        onRowShow: args({ control: "false", ...propCategory.action }),
        onRowDelete: args({ control: "false", ...propCategory.action }),
        onColumnCheck: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        onGlobalFilterChange: args({ control: "false", ...propCategory.action }),
        onManageColumns: args({ control: "false", ...propCategory.action }),
        bulkActions: args({ control: "false", ...propCategory.functionality }),
        withGlobalFilter: args({ control: "boolean", ...propCategory.functionality }),
        globalFilterPlaceholder: args({ control: "text", ...propCategory.content }),
        withStickyHeader: args({ control: "boolean", ...propCategory.appearance }),
        sortableColumns: args({ control: "boolean", ...propCategory.functionality }),
        pageSizes: args({ control: "false", ...propCategory.functionality }),
        initialPageSize: args({ control: "number", ...propCategory.content }),
        initialPageIndex: args({ control: "number", ...propCategory.content }),
        withPagination: args({ control: "boolean", ...propCategory.appearance }),
        withVirtualScroll: args({ control: "boolean", ...propCategory.appearance }),
        onManageColumnRestore: args({ control: "false", ...propCategory.action }),
        onSortChange: args({ control: "false", ...propCategory.action }),
        onPageChange: args({ control: "false", ...propCategory.action }),
        onRowSelect: args({ control: "false", ...propCategory.action }),
        onCellEdit: args({ control: "false", ...propCategory.action }),
        onEdit: args({ control: "false", ...propCategory.action }),
        onCancel: args({ control: "false", ...propCategory.action }),
        withDynamicFetch: args({ control: "boolean", ...propCategory.functionality }),
        editableMode: args({ control: "boolean", ...propCategory.functionality }),
        onPageSizeChange: args({ control: "false", ...propCategory.functionality }),
        withManualPagination: args({ control: "boolean", ...propCategory.functionality }),
        keepPinnedRows: args({ control: "boolean", ...propCategory.functionality }),
        hasNextPage: args({ control: "boolean", ...propCategory.content }),
        showInputPageField: args({ control: "boolean", ...propCategory.content }),
        isFetchingNextPage: args({ control: "boolean", ...propCategory.content }),
        fetchNextPage: args({ control: "false", ...propCategory.action }),
        onSave: args({ control: "false", ...propCategory.action }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loaderSize: args({ control: "select", ...propCategory.appearance }),
        loaderText: args({ control: "text", ...propCategory.appearance }),
        isManageColumnsDisabled: args({ control: "boolean", ...propCategory.states }),
        withManageColumns: args({ control: "boolean", ...propCategory.states }),
        manageColumnsTitle: args({ control: "text", ...propCategory.content }),
        headerContent: args({ control: "false", ...propCategory.content })
    },
    args: {
        columns: defaultColumns,
        externalData,
        onRowClick: undefined,
        onRowTag: undefined,
        onRowClock: undefined,
        onRowReload: undefined,
        onRowCopy: undefined,
        onRowDownload: undefined,
        onRowShow: undefined,
        keepPinnedRows: false,
        headerContent: <HeaderContent />
    }
};

type Story = StoryObj<ITableProps>;

const TableComponent: FC<ITableProps> = (props) => {
    const { externalData: data } = props;
    const [tableData, setTableData] = useState(data);
    const [updatedTableData, setUpdatedTableData] = useState(deepCloneWithFunctions(data));
    const [editableState, setEditableState] = useState(false);

    const onCellEdit: ITableProps["onCellEdit"] = (rowIndex, columnType, value) => {
        const updatedData =
            columnType === "Switch" || columnType === "Checkbox"
                ? {
                      value,
                      checked: !(tableData[rowIndex][columnType]?.data as ISwitchProps).checked
                  }
                : value;
        const newData = [...tableData];
        if (newData[rowIndex] && typeof newData[rowIndex] === "object") {
            (newData[rowIndex] as any)[columnType].data = updatedData;
        }

        setUpdatedTableData(newData);
    };

    const onSave = () => {
        setTableData(updatedTableData);
        setEditableState(false);
    };

    const onEdit = () => {
        setEditableState(true);
    };

    const onCancel = () => {
        setEditableState(false);
    };

    const onRowPinToggle = (rowId: string) => {
        setTableData((prevData) => {
            const rowIndex = prevData.findIndex((row) => row.id === rowId);
            if (rowIndex === -1) {
                return prevData;
            }

            const updatedData = [...prevData];

            updatedData[rowIndex] = {
                ...updatedData[rowIndex],
                isPinned: !updatedData[rowIndex].isPinned
            };

            return updatedData;
        });
    };

    const onRowDelete = (rowId: string) => {
        setTableData((prevData) =>
            prevData.filter((row) => {
                return row.id !== rowId;
            })
        );
    };

    return (
        <Table
            {...props}
            externalData={tableData}
            bulkActions={bulkActionsMock}
            onCellEdit={onCellEdit}
            editableMode={editableState}
            onRowPinToggle={onRowPinToggle}
            onRowDelete={onRowDelete}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        />
    );
};

export const Default: Story = {
    render: (props) => <TableComponent {...props} columns={defaultColumns} withManageColumns />
};

export const WithStickyHeader: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={defaultColumns}
                externalData={externalData}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                withCheckbox
                withStickyHeader
                bulkActions={bulkActionsMock}
            />
        );
    }
};

const TableWithVirtualScroll: FC<ITableProps> = (props) => {
    const [tableData, setTableData] = useState(makeData(50));
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const fetchData = () => {
        if (tableData.length > 300) setHasNextPage(false);
        setIsFetchingNextPage(true);
        setTimeout(() => {
            setTableData((prev) => {
                const newData = makeData(50);
                return [...prev, ...newData];
            });
            setIsFetchingNextPage(false);
        }, 2000);
    };

    return (
        <TableComponent
            {...props}
            columns={defaultColumns}
            externalData={tableData}
            withVirtualScroll
            withGlobalFilter
            withCheckbox
            bulkActions={bulkActionsMock}
            withDynamicFetch
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchData}
        />
    );
};

export const WithVirtualScroll: Story = {
    argTypes: {},
    args: {},
    render: (props) => <TableWithVirtualScroll {...props} />
};

export const WithPinnedColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withPinnedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withPagination
                withGlobalFilter
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithGroupedColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                expandable
                withGlobalFilter
                withPagination
                withStickyHeader
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithExpendRowsColumns: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                expandable
                withPagination
                bulkActions={bulkActionsMock}
            />
        );
    }
};

export const WithOutData: Story = {
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <TableComponent
                {...props}
                columns={withGroupedColumns}
                externalData={[]}
                pageSizes={[10, 25, 50, 100]}
                initialPageSize={25}
                initialPageIndex={0}
                withCheckbox
                withGlobalFilter
                withPagination
            />
        );
    }
};

export default meta;
