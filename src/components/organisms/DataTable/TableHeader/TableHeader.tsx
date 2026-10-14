import React, { useEffect, useRef } from "react";
import { HeaderGroup } from "@tanstack/table-core";
import classNames from "classnames";

// Context
import { useDataTableContext } from "../context";
// Components
import TableHeaderCell from "./Cell/TableHeaderCell";

// Styles
import "./TableHeader.scss";

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
    /**
     * Whether the body rows render a trailing row-actions cell.
     * When `true` a matching (empty) header cell is rendered so header and body
     * rows keep an equal cell count.
     */
    hasRowActions?: boolean;
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
const TableHeader = <TData,>({ headerGroups, sticky, hasRowActions }: ITableHeaderProps<TData>) => {
    const { table } = useDataTableContext<TData>();
    const theadRef = useRef<HTMLTableSectionElement>(null);

    // Ids of the rendered columns, split by sizing mode. A column can switch mode without changing its id
    // (its `size` added or removed through a new `columns` prop), so both lists drive the observer below.
    const headers = headerGroups.flatMap((group) => group.headers);
    const isAutoSized = (header: (typeof headers)[number]) => header.column.columnDef.meta?.explicitSize === undefined;
    const autoSizedIdsKey = headers
        .filter(isAutoSized)
        .map((header) => header.column.id)
        .join("|");
    const explicitSizedIdsKey = headers
        .filter((header) => !isAutoSized(header))
        .map((header) => header.column.id)
        .join("|");

    // Mirrors the rendered width of auto-sized columns into TanStack (pinned columns are offset by it).
    // One observer for the whole header, so a resize updates the column sizing (and re-renders the table) once.
    useEffect(() => {
        const thead = theadRef.current;
        if (!thead) return () => undefined;

        // A width measured while the column was auto-sized would otherwise override its new explicit `size`
        const explicitSizedIds = explicitSizedIdsKey ? explicitSizedIdsKey.split("|") : [];
        const staleIds = explicitSizedIds.filter((id) => id in table.getState().columnSizing);
        if (staleIds.length) {
            table.setColumnSizing((old) => {
                const next = { ...old };
                staleIds.forEach((id) => delete next[id]);
                return next;
            });
        }

        const observer = new ResizeObserver((entries) => {
            const { columnSizing } = table.getState();
            const updates: Record<string, number> = {};

            entries.forEach(({ target }) => {
                const { columnId } = (target as HTMLElement).dataset;
                if (!columnId) return;

                const newWidth = Math.round(target.getBoundingClientRect().width);
                const currentSize = columnSizing[columnId] ?? table.getColumn(columnId)?.columnDef.size ?? 0;

                if (Math.abs(currentSize - newWidth) > 1) {
                    updates[columnId] = newWidth;
                }
            });

            if (Object.keys(updates).length) {
                table.setColumnSizing((old) => ({ ...old, ...updates }));
            }
        });

        thead.querySelectorAll("th[data-column-id]").forEach((th) => observer.observe(th));
        return () => observer.disconnect();
    }, [table, autoSizedIdsKey, explicitSizedIdsKey]);

    return (
        <thead
            ref={theadRef}
            className={classNames("tableHeader", {
                tableHeader__sticky: sticky
            })}
        >
            {headerGroups.map((headerGroup) => (
                <tr className="tableHeader__row" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHeaderCell key={header.id} header={header} offset={header.column.getStart("left")} />
                    ))}
                    {hasRowActions && <th className="tableHeaderCell tableHeaderCell_actions" aria-hidden="true" />}
                </tr>
            ))}
        </thead>
    );
};

export default TableHeader;
