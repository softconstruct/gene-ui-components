import React, { memo } from "react";
import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

// Styles
import "./TableBodyCell.scss";

import { areCellsEqual, getCellStyle, ICellProps } from "../../helper";

/**
 * Renders an individual table body cell (`<td>`).
 * Memoized via {@link areCellsEqual} on primitive snapshots so that toggling
 * one row's expanded state, paginating, or any other table-level change does
 * not re-render unaffected cells.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 * @param props - The properties for the component.
 * @returns A table cell element with the rendered content.
 */
const TableBodyCell = <TData extends object, TValue>({
    cell,
    renderer,
    isExpanded,
    isPinned,
    offset,
    dirMode
}: ICellProps<TData, TValue>) => {
    const isExpanderCell = cell.column.id === "expander";
    const isRTL = dirMode === "rtl";

    return (
        <td
            className={classNames("tableBodyCell", {
                tableBodyCell_expander: isExpanderCell,
                tableBodyCell_expander_expanded: isExpanded,
                tableBodyCell_pinned: isPinned
            })}
            style={getCellStyle(isExpanderCell, cell.column.getSize(), offset, isPinned, isRTL)}
        >
            <div className="tableBodyCell__content">{flexRender(renderer, cell.getContext())}</div>
        </td>
    );
};

const MemoizedTableBodyCell = memo(TableBodyCell, areCellsEqual);

export default MemoizedTableBodyCell;
