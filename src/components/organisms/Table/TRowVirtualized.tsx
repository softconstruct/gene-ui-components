import React, { FC } from "react";
import { flexRender, Row as RowData } from "@tanstack/react-table";
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";

import { CellClassNames } from "./constants";
import { Row } from "./types";

interface ITRowVirtualized {
    row: RowData<Row>;
    virtualRow: VirtualItem;
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

const TRowVirtualized: FC<ITRowVirtualized> = ({ row, virtualRow, rowVirtualizer }) => {
    return (
        <tr
            className={classNames(`table__row table__row_tbody table__row_${row.original.rowStatus}`)}
            role="row"
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
        >
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
    );
};

export { ITRowVirtualized, TRowVirtualized as default };
