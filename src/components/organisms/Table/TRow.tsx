import React, { FC, useContext } from "react";
import { flexRender, Row as RowData } from "@tanstack/react-table";
import classNames from "classnames";

import { TableContext } from "@components/organisms/Table/Table";

import { CellClassNames } from "./constants";
import RowActions from "./RowActions";
// Components
import { Row } from "./types";

interface ITRow {
    row: RowData<Row>;
}

const TRow: FC<ITRow> = ({ row }) => {
    const { rowActions } = useContext(TableContext);
    return (
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
                        style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.getSize()
                        }}
                    >
                        <div className={classNames(`table__content ${CellClassNames[colDef.type]}`)}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                );
            })}
            {rowActions && (
                <td className="table__td table__actionsWrapper">
                    <div className="table__actions" role="group">
                        {rowActions.map((action) => {
                            return (
                                <RowActions
                                    key={action.type}
                                    {...action}
                                    type={action.type === "pin" && row.getIsPinned() ? "pinFilled" : action.type}
                                />
                            );
                        })}
                    </div>
                </td>
            )}
        </tr>
    );
};

export { ITRow, TRow as default };
