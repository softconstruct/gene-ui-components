import React, { FC, forwardRef } from "react";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import classNames from "classnames";

import { ColActions } from "./ColActions";
// Components
import { Row } from "./types";

interface ITableHeadProps {
    columns: HeaderGroup<Row>[];
    selectAllText?: string;
    withStickyHeader?: boolean;
}

interface IHeaderCellProps {
    header: Header<Row, unknown>;
    selectAllText?: string;
}

const HeaderCell: FC<IHeaderCellProps> = ({ header, selectAllText }) => {
    if (header.isPlaceholder) return null;

    const colDef = header.column.columnDef;
    if (!colDef) return null;

    if (colDef.type === "RowCheckbox" || colDef.type === "Expand") {
        return flexRender(header.column.columnDef.header, header.getContext());
    }

    return (
        <th
            key={`${header.id}_header`}
            colSpan={header.colSpan}
            scope={header.subHeaders.length ? "colgroup" : "col"}
            className={classNames("table__th", {
                table__th_group: header.subHeaders.length,
                table__td_pinned: header.column.getIsPinned()
                // table__th_active: !!activeHeaders?.[header.id]
            })}
        >
            <div className="table__content table__content_empty">
                <div className="table__content table__content_header">
                    <span className="table__th_text ellipsis-text">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <ColActions
                        header={header}
                        // onColAction={onColAction}
                        selectAllText={selectAllText}
                    />
                </div>
            </div>
        </th>
    );
};

const THead = forwardRef<HTMLTableSectionElement, ITableHeadProps>(
    ({ columns, selectAllText, withStickyHeader }, ref) => {
        return (
            <thead
                ref={ref}
                className={classNames({
                    table__thead_sticky: withStickyHeader
                })}
            >
                {columns.map((headerGroup) => (
                    <tr key={headerGroup.id} className="table__row table__row_thead">
                        {headerGroup.headers.map((header) => (
                            <HeaderCell key={header.id} header={header} selectAllText={selectAllText} />
                        ))}
                    </tr>
                ))}
            </thead>
        );
    }
);

export { ITableHeadProps, THead as default };
