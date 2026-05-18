import React, { FunctionComponent, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Pencil, RecycleBin } from "@geneui/icons";

import Pagination from "@components/molecules/Pagination";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { mockColumns, mockData, renderMockExpandedRow } from "../../../../stories/data/__dataTable";
// Components
import DataTable, { DataTableRowStatus, IDataTableProps, IDataTableRowAction } from "./index";

type MockRowType = (typeof mockData)[0];

/** Row index in `mockData` (stable across pages for demo disabled rules). */
const rowIndexInMockData = (row: MockRowType) => mockData.findIndex((r) => r.Id === row.Id);

const defaultRowActions: IDataTableRowAction<MockRowType>[] = [
    {
        Icon: Pencil,
        title: "Edit",
        // Third row (index 2), seventh (6), ... - first action disabled
        disabled: (row) => {
            const i = rowIndexInMockData(row);
            return i >= 0 && i % 4 === 2;
        },
        onClick: () => {}
    },
    {
        Icon: RecycleBin,
        title: "delete",
        // First row (index 0), fifth (4), ... - second action disabled
        disabled: (row) => {
            const i = rowIndexInMockData(row);
            return i >= 0 && i % 4 === 0;
        },
        onClick: () => {}
    }
];

const meta: Meta<IDataTableProps<MockRowType>> = {
    title: "Organisms/DataTable",
    component: DataTable,
    subcomponents: { Pagination: Pagination as FunctionComponent<unknown> },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        pagination: args({ control: "object", ...propCategory.functionality }),
        manualPagination: args({ control: "object", ...propCategory.functionality }),
        columns: args({ control: "false", ...propCategory.content }),
        data: args({ control: "false", ...propCategory.content }),
        noDataTexts: args({ control: "object", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        noDataAvailableActions: args({ control: "false", ...propCategory.functionality }),
        sticky: args({ control: "boolean", ...propCategory.appearance }),
        renderExpandedRow: args({ control: "false", ...propCategory.content }),
        onRowExpandChange: args({ control: "false", ...propCategory.functionality }),
        rowActions: args({ control: "object", ...propCategory.functionality }),
        getRowStatus: args({ control: "false", ...propCategory.appearance }),
        manageColumnsConfig: args({ control: "object", ...propCategory.functionality })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IDataTableProps<MockRowType>>;

export const Default: Story = {
    render: (props) => <DataTable {...props} />,
    args: {
        columns: mockColumns,
        data: mockData,
        renderExpandedRow: (row) => renderMockExpandedRow(row),
        pagination: { pageSize: 10, rowsPerPageOptions: [2, 10, 20, 50, 100], showInputPageField: true },
        rowActions: defaultRowActions
    }
};

export const NoDataAvailable: Story = {
    render: (props) => <DataTable {...props} />,
    args: {
        columns: mockColumns,
        noDataAvailableActions: [{ children: "Retry", onClick: () => null }],
        noDataTexts: {
            noDataAvailableText: "No Data Available",
            noDataAvailableTitle: "No Data Available"
        }
    }
};

export const WithPagination: Story = {
    render: (props) => <DataTable {...props} />,
    args: { columns: mockColumns, data: mockData, pagination: true }
};

export const RowStatusFromCallback: Story = {
    render: (props) => <DataTable {...props} />,
    args: {
        columns: mockColumns,
        data: mockData,
        getRowStatus: (row) => {
            let status: DataTableRowStatus | undefined;
            if (row.Status === "new") {
                status = "green";
            } else if (row.Status === "suspended") {
                status = "red";
            }
            return status;
        },
        pagination: { pageSize: 10, rowsPerPageOptions: [2, 10, 20, 50, 100], showInputPageField: true }
    }
};

const AsyncPaginationTableWrapper = (props: IDataTableProps<MockRowType>) => {
    const [data, setData] = useState<MockRowType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockData);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handlePageChange = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handlePageSizeChange = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const paginationProps = typeof props?.pagination === "object" ? props?.pagination : {};

    return (
        <DataTable
            data={data}
            loading={isLoading}
            pagination={{
                ...paginationProps,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange
            }}
            {...props}
        />
    );
};

export const AsyncDataFetchingWithPagination: Story = {
    render: (props) => <AsyncPaginationTableWrapper {...props} />,
    args: {
        columns: mockColumns,
        loadingText: "Loading data...",
        pagination: {
            pageSize: 10,
            rowsPerPageOptions: [5, 10, 20],
            showInputPageField: true
        }
    }
};

export const WithManageColumns: Story = {
    render: (props) => <DataTable {...props} />,
    args: {
        data: mockData,
        columns: mockColumns,
        manageColumnsConfig: {
            enabled: true,
            available: true,
            texts: {
                searchPlaceholder: "Search...",
                cancelText: "Cancel",
                saveText: "Save changes",
                restoreDefaultsText: "Restore defaults",
                buttonText: "Manage columns"
            }
        }
    }
};
