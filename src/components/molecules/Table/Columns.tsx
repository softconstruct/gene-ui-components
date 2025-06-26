import React from "react";

export const defaultColumns = [
    {
        header: "Group Name",
        type: "text",
        footer: (props) => props.column.id,
        columns: [
            {
                id: "expand",
                type: "expand",
                accessorKey: "expand"
            },
            {
                id: "rowCheckbox",
                type: "rowCheckbox",
                accessorKey: "rowCheckbox"
            },
            {
                id: "graph",
                type: "graph",
                accessorKey: "graph",
                editable: false,
                copyable: false,
                header: () => <div>Graph</div>,
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id
            },
            {
                id: "title",
                type: "text",
                accessorKey: "text",
                enableSorting: true,
                sortingFn: (rowA, rowB, columnId) => {
                    const a: string = rowA.getValue(columnId)?.data ?? "";
                    const b: string = rowB.getValue(columnId)?.data ?? "";
                    return a.localeCompare(b);
                },
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Title</span>,
                footer: (props) => props.column.id
            },
            {
                id: "number",
                type: "number",
                accessorKey: "number",
                enableSorting: true,
                sortingFn: (rowA, rowB, columnId) => {
                    const a: number = rowA.getValue(columnId)?.data ?? "";
                    const b: number = rowB.getValue(columnId)?.data ?? "";
                    return a - b;
                },
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Number</span>,
                footer: (props) => props.column.id
            },
            {
                id: "description",
                type: "longText",
                accessorKey: "longText",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Description</span>,
                footer: (props) => props.column.id
            },
            {
                id: "dropdown",
                type: "dropdown",
                accessorKey: "dropdown",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Dropdown</span>,
                footer: (props) => props.column.id
            },
            {
                id: "status",
                type: "status",
                accessorKey: "status",
                enableSorting: true,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Status</span>,
                footer: (props) => props.column.id
            },
            {
                id: "pill",
                type: "pill",
                accessorKey: "pill",
                editable: false,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Pill</span>,
                footer: (props) => props.column.id
            },
            {
                id: "icon",
                type: "icon",
                accessorKey: "icon",
                editable: false,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Icon</span>,
                footer: (props) => props.column.id
            },
            {
                id: "flag",
                type: "flag",
                accessorKey: "flag",
                editable: false,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Flag</span>,
                footer: (props) => props.column.id
            },
            {
                id: "checkbox",
                type: "checkbox",
                accessorKey: "checkbox",
                editable: true,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Checkbox</span>,
                footer: (props) => props.column.id
            },
            {
                id: "switch",
                type: "switch",
                accessorKey: "switch",
                editable: true,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Switch</span>,
                footer: (props) => props.column.id
            }
        ]
    }
];
