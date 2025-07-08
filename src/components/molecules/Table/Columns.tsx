import React from "react";

import { RowData, TableCol } from "@components/molecules/Table/type";

export const defaultColumns: TableCol<RowData>[] = [
    {
        id: "groupName",
        header: () => <div>Group Name</div>,
        accessorKey: "groupName",
        order: 0,
        type: "text",
        footer: (props) => props.column.id,
        columns: [
            {
                id: "expand",
                isVisible: true,
                order: 0,
                enableGlobalFilter: false,
                type: "expand",
                accessorKey: "expand",
                header: () => null
            },
            {
                id: "rowCheckbox",
                isVisible: true,
                order: 0,
                enableGlobalFilter: false,
                type: "rowCheckbox",
                accessorKey: "rowCheckbox",
                header: () => null
            },
            {
                id: "graph",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
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
                isVisible: true,
                order: 2,
                enableGlobalFilter: true,
                type: "text",
                accessorFn: (row) => row.text?.data,
                enableSorting: true,
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Title</span>,
                footer: (props) => props.column.id
            },
            {
                id: "number",
                isVisible: true,
                order: 1,
                enableGlobalFilter: true,
                type: "number",
                accessorFn: (row) => row.number?.data,
                enableSorting: true,
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Number</span>,
                footer: (props) => props.column.id
            },
            {
                id: "description",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "longText",
                accessorKey: "longText",
                editable: true,
                copyable: true,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Description</span>,
                footer: (props) => props.column.id
            },
            {
                id: "dropdown",
                isVisible: true,
                order: 2,
                enableGlobalFilter: true,
                type: "dropdown",
                accessorKey: "dropdown",
                editable: true,
                copyable: true,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Dropdown</span>,
                footer: (props) => props.column.id
            },
            {
                id: "status",
                isVisible: true,
                order: 2,
                enableGlobalFilter: true,
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
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "pill",
                accessorKey: "pill",
                editable: false,
                copyable: false,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Pill</span>,
                footer: (props) => props.column.id
            },
            {
                id: "icon",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "icon",
                accessorKey: "icon",
                editable: false,
                copyable: false,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Icon</span>,
                footer: (props) => props.column.id
            },
            {
                id: "flag",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "flag",
                accessorKey: "flag",
                editable: false,
                copyable: false,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Flag</span>,
                footer: (props) => props.column.id
            },
            {
                id: "checkbox",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "checkbox",
                accessorKey: "checkbox",
                editable: true,
                copyable: false,
                enableSorting: true,
                enablePopoverFilter: true,
                filterOptions: ["On", "Off"],
                cell: (info) => info.getValue(),
                header: () => <span>Checkbox</span>,
                footer: (props) => props.column.id
            },
            {
                id: "switch",
                isVisible: true,
                order: 2,
                enableGlobalFilter: false,
                type: "switch",
                accessorKey: "switch",
                editable: true,
                copyable: false,
                enableSorting: true,
                cell: (info) => info.getValue(),
                header: () => <span>Switch</span>,
                footer: (props) => props.column.id
            }
        ] as TableCol<RowData>[]
    }
];
