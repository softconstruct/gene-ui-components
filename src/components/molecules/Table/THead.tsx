import React, { forwardRef, useContext, useState } from "react";
import { flexRender, Header, Table } from "@tanstack/react-table";
import classNames from "classnames";

import Checkbox from "@components/molecules/Checkbox";
import { ColActions } from "@components/molecules/Table/ColActions";
import { TableContext } from "@components/molecules/Table/Table";

import { Row, TableCol } from ".";

interface ITableHead {
    table: Table<Row>;
    expandable?: boolean;
    withCheckbox?: boolean;
    withStickyHeader?: boolean;
    selectAllText?: string;
    rowCount?: number;
}

const THead = forwardRef<HTMLTableSectionElement, ITableHead>(
    ({ table, expandable, withCheckbox, withStickyHeader, selectAllText, rowCount }, ref) => {
        const { onSelectAllRows } = useContext(TableContext);
        const [activeHeaders, setActiveHeaders] = useState<Record<string, boolean> | null>(null);

        const onColAction = (colId: string, value: boolean) => {
            setActiveHeaders({ ...activeHeaders, [colId]: value });
        };

        const getAriaSortValue = (
            sortDirection: false | "asc" | "desc"
        ): "ascending" | "descending" | "none" | undefined => {
            if (sortDirection === "asc") {
                return "ascending";
            }
            if (sortDirection === "desc") {
                return "descending";
            }
            return undefined;
        };

        const renderTableHeaderCell = (header: Header<Row, unknown>) => {
            if (header.isPlaceholder) return null;

            if ((header.column.columnDef as TableCol<Row>).type === "RowCheckbox" && withCheckbox) {
                const isAllSelected = table.getIsAllPageRowsSelected();
                const isSomeSelected = table.getIsSomePageRowsSelected();
                return (
                    <th
                        key={`${header.id}_header`}
                        colSpan={header.colSpan}
                        className={classNames("table__th", {
                            table__th_group: header.subHeaders.length
                        })}
                        scope="col"
                    >
                        <div className="table__content table__content_empty">
                            <Checkbox
                                name="column"
                                value="column"
                                checked={isAllSelected}
                                indeterminate={isSomeSelected}
                                aria-label={
                                    isAllSelected
                                        ? `Deselect all ${rowCount || 0} rows`
                                        : `Select all ${rowCount || 0} rows`
                                }
                                aria-checked={isAllSelected}
                                onChange={() => {
                                    table.toggleAllPageRowsSelected();
                                    onSelectAllRows?.();
                                }}
                            />
                        </div>
                    </th>
                );
            }
            if ((header.column.columnDef as TableCol<Row>).type === "Expand" && expandable) {
                return (
                    <th
                        key={`${header.id}_header`}
                        colSpan={header.colSpan}
                        className={classNames("table__th", {
                            table__th_group: header.subHeaders.length
                        })}
                        scope="col"
                        aria-label="Expand row"
                    >
                        <div className="table__content table__content_empty" />
                    </th>
                );
            }

            if (header.id === "rowCheckbox") return null;
            if (header.id === "expand") return null;

            const headerText = flexRender(header.column.columnDef.header, header.getContext());
            const sortDirection = header.column.getIsSorted();

            return (
                <th
                    key={`${header.id}_header`}
                    colSpan={header.colSpan}
                    scope={header.subHeaders.length ? "colgroup" : "col"}
                    className={classNames("table__th", {
                        table__th_group: header.subHeaders.length,
                        table__th_active: !!activeHeaders?.[header.id]
                    })}
                    aria-sort={getAriaSortValue(sortDirection)}
                    aria-label={sortDirection || undefined}
                >
                    <div className="table__content table__content_empty">
                        <div className="table__content table__content_header">
                            <span className="table__th_text ellipsis-text">{headerText}</span>
                            {header.id !== "expand" && (
                                <ColActions header={header} onColAction={onColAction} selectAllText={selectAllText} />
                            )}
                        </div>
                    </div>
                </th>
            );
        };
        return (
            <thead
                ref={ref}
                className={classNames({
                    table__thead_sticky: withStickyHeader
                })}
            >
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={`${headerGroup.id}_header`} className="table__row table__row_thead">
                        {headerGroup.headers.map((header) => renderTableHeaderCell(header))}
                    </tr>
                ))}
            </thead>
        );
    }
);

export { THead as default };
