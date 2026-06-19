import React from "react";
import { HeaderGroup } from "@tanstack/table-core";
import classNames from "classnames";

// Styles
import "./TableHeader.scss";

// Components
import TableHeaderCell from "./Cell/TableHeaderCell";

/**
 * Props for the {@link TableHeader} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableHeaderProps<TData> {
    /**
     * An array of TanStack Table header group instances.
     * Contains the nested structure required to render table headers,
     * natively supporting both simple flat headers and complex multi-level grouped headers.
     */
    headerGroups: HeaderGroup<TData>[];
    /**
     * Set sticky header.
     */
    sticky?: boolean;
}

/**
 * Renders the `<thead>` section of the table.
 * * Iterates over the provided header groups to generate header rows (`<tr>`),
 * and then maps through each group's individual headers to render
 * {@link TableHeaderCell} components.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns The table header element containing all rendered header rows and cells.
 */
const TableHeader = <TData,>({ headerGroups, sticky }: ITableHeaderProps<TData>) => (
    <thead
        className={classNames("tableHeader", {
            tableHeader__sticky: sticky
        })}
    >
        {headerGroups.map((headerGroup) => (
            <tr className="tableHeader__row" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHeaderCell key={header.id} header={header} offset={header.column.getStart("left")} />
                ))}
            </tr>
        ))}
    </thead>
);

export default TableHeader;
