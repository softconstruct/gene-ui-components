import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { mockColumns, mockData } from "../../../../stories/data/__dataTable";
// Components
import DataTable, { IDataTableProps } from "./index";

type MockRowType = (typeof mockData)[0];

const meta: Meta<IDataTableProps<MockRowType>> = {
    title: "Molecules/DataTable",
    component: DataTable,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        pagination: args({ control: "object", ...propCategory.functionality }),
        columns: args({ control: "false", ...propCategory.content }),
        data: args({ control: "false", ...propCategory.content }),
        noDataTexts: args({ control: "object", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        noDataAvailableActions: args({ control: "false", ...propCategory.functionality }),
        sticky: args({ control: "boolean", ...propCategory.appearance })
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
        pagination: { rowsPerPageOptions: [2, 10, 20, 50, 100], showInputPageField: true }
    }
};

export const NoDataAvailable: Story = {
    render: (props) => <DataTable {...props} />,
    args: { columns: mockColumns }
};

export const Loading: Story = {
    render: (props) => <DataTable {...props} />,
    args: { columns: mockColumns, loading: true }
};

export const WithPagination: Story = {
    render: (props) => <DataTable {...props} />,
    args: { columns: mockColumns, data: mockData, pagination: true }
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
            {...props}
            data={data}
            loading={isLoading}
            pagination={{
                ...paginationProps,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange
            }}
        />
    );
};

export const AsyncDataFetchingWithPagination: Story = {
    render: (props) => <AsyncPaginationTableWrapper {...props} />,
    args: {
        columns: mockColumns,
        loadingText: "Loading data...",
        pagination: {
            rowsPerPageOptions: [5, 10, 20],
            showInputPageField: true
        }
    }
};
