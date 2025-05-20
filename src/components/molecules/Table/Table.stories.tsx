import React, { ComponentType, ReactNode } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import Checkbox from "../Checkbox";
// Components
import Table, { ITableProps } from "./index";
import { makeData, Person } from "./makeData";
import TableLayoutTmp from "./TableLayoutTmp";
import { TableCol } from "./type";

const meta: Meta<ITableProps> = {
    title: "Molecules/Table",
    component: Table,
    argTypes: {
        // fill Table component argTypes
    },
    args: {
        // fill Table component args
    },
    subcomponents: {
        Layout: TableLayoutTmp as ComponentType<unknown>
    }
};

type Story = StoryObj<ITableProps>;
const columns: TableCol<Person>[] = [
    {
        id: "pin",
        header: () => "Pin",
        cell: ({ row }) =>
            row.getIsPinned() ? (
                <button onClick={() => row.pin(false)} type="button">
                    ❌
                </button>
            ) : (
                <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => row.pin("top")} type="button">
                        ⬆️
                    </button>
                    <button onClick={() => row.pin("bottom")} type="button">
                        ⬇️
                    </button>
                </div>
            )
    },
    {
        editable: true,
        accessorKey: "firstName",
        header: ({ table }) => (
            <>
                <button
                    type="button"
                    {...{
                        onClick: table.getToggleAllRowsExpandedHandler()
                    }}
                >
                    {table.getIsAllRowsExpanded() ? "👇" : "👉"}
                </button>
                <Checkbox
                    name="checkbox"
                    value="0123"
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler()
                    }}
                />
                First Name
            </>
        ),
        cell: ({ row, getValue }) => {
            return (
                <div
                    style={{
                        paddingLeft: `${row.depth * 2}rem`
                    }}
                >
                    <Checkbox
                        name="TMP"
                        value="TMP"
                        {...{
                            checked: row.getIsSelected(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler()
                        }}
                    />
                    {row.getCanExpand() ? (
                        // eslint-disable-next-line react/button-has-type
                        <button
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: { cursor: "pointer" }
                            }}
                        >
                            {row.getIsExpanded() ? "👇" : "👉"}
                        </button>
                    ) : (
                        "🔵"
                    )}
                    {getValue() as ReactNode}
                    {/* <span contentEditable={column.columnDef.editable && editableMode}>{getValue()}</span> */}
                </div>
            );
        },
        footer: (props) => props.column.id
    },
    {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        accessorKey: "lastName",
        sortable: true,
        copyable: true,
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>
    },
    {
        accessorKey: "age",
        header: () => "Age",
        size: 50,
        sortable: true,
        copyable: true,
        editable: true
    },
    {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        size: 50
    },
    {
        editable: true,
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "progress",
        header: "Profile Progress",
        size: 80
    }
];

const data = makeData(90, 2, 2);
export const TableStory: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        return <Table columns={columns} externalData={data} pageSizes={[10, 20, 30, 42]} />;
    }
});

export const TableLayout: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: () => {
        return <TableLayoutTmp />;
    }
});
export default meta;
