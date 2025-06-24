import React from "react";
import { createColumnHelper } from "@tanstack/react-table";

import { TableCol } from "@components/molecules/Table/type";

const columnHelper = createColumnHelper<TableCol<unknown>>();

// Make some columns!
export const defaultColumns = [
    // Grouping Column
    columnHelper.group({
        header: "Group Name",
        sortingFn: "alphanumeric",
        type: "text",
        footer: (props) => props.column.id,
        columns: [
            columnHelper.group({
                id: "expand",
                type: "expand"
            }),
            // Display Column
            columnHelper.group({
                id: "rowCheckbox",
                type: "rowCheckbox"
            }),
            // Accessor Column
            columnHelper.accessor("graph", {
                id: "graph",
                type: "graph",
                sortable: true,
                editable: false,
                copyable: false,
                header: () => <div>Graph</div>,
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor("title", {
                id: "title",
                type: "text",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Title</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "number",
                type: "number",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Number</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "description",
                type: "longText",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Description</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "dropdown",
                type: "dropdown",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: true,
                copyable: true,
                cell: (info) => info.getValue(),
                header: () => <span>Dropdown</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "status",
                type: "status",
                sortable: true,
                editable: false,
                sortingFn: "alphanumeric",
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Status</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "pill",
                type: "pill",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: false,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Pill</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "icon",
                type: "icon",
                sortable: true,
                sortingFn: "alphanumeric",
                editable: false,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Icon</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "flag",
                type: "flag",
                sortable: true,
                editable: false,
                sortingFn: "alphanumeric",
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Flag</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "checkbox",
                type: "checkbox",
                sortable: true,
                editable: true,
                sortingFn: "alphanumeric",
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Checkbox</span>,
                footer: (props) => props.column.id
            }),
            // Accessor Column
            columnHelper.accessor((row) => row.lastName, {
                id: "switch",
                type: "switch",
                sortingFn: "alphanumeric",
                sortable: true,
                editable: true,
                copyable: false,
                cell: (info) => info.getValue(),
                header: () => <span>Switch</span>,
                footer: (props) => props.column.id
            })
        ]
    })
];
