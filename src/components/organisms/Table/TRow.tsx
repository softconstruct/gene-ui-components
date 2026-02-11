import React, { FC } from "react";
import { flexRender, Row as RowData } from "@tanstack/react-table";
import classNames from "classnames";

import { CellClassNames } from "./constants";
// Components
import { Row } from "./types";

interface ITRow {
    row: RowData<Row>;
}

const TRow: FC<ITRow> = ({ row }) => {
    return (
        <>
            <tr className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`)} role="row">
                {row.getVisibleCells().map((cell) => {
                    const colDef = cell.column.columnDef;
                    if (!colDef) return null;

                    return (
                        <td
                            key={cell.id}
                            className={classNames("table__td", {
                                table__td_pinned: cell.column.getIsPinned()
                            })}
                        >
                            <div className={classNames(`table__content ${CellClassNames[colDef.type]}`)}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        </td>
                    );
                })}
            </tr>
        </>
    );
};

export { ITRow, TRow as default };
