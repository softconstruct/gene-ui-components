import React, { memo } from "react";
import { Cell, ColumnDef, flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import { areCellsEqual, getCellStyle } from "@components/organisms/DataTable/helper";

// Styles
import "./TableBodyCell.scss";

/**
 * Props for the {@link TableBodyCell} component.
 *
 * The component accepts the live `cell` instance (needed by `flexRender` for
 * the rendering context) plus a set of primitive snapshots captured by the
 * parent at render time. Memoization compares only the snapshots, never the
 * live `cell` reference — TanStack recreates cell instances on every render,
 * and its live getters always return the current state, which makes them unsafe
 * for prev/next comparison inside `React.memo`.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 */
export interface ITableBodyCellProps<TData, TValue> {
    /**
     * TanStack Table cell instance — used only at render time to obtain the
     * `flexRender` context. Not part of the memo equality.
     */
    cell: Cell<TData, TValue>;
    /**
     * Snapshot of `row.getIsExpanded()` captured by the parent at render time.
     * Required so that state-dependent renderers (expander chevron, "open"
     * badges, …) invalidate the memo when the row toggles.
     */
    isExpanded: boolean;
    /**
     * Snapshot of `column.columnDef.cell` — the renderer reference. Catches
     * consumers updating the `columns` prop with a new renderer closure.
     */
    renderer: ColumnDef<TData, TValue>["cell"];
    /**
     * Snapshot of `column.getIsPinned()` captured by the parent at render time.
     */
    isPinned?: boolean;
    /**
     * Snapshot of `column.columnDef.size` captured by the parent at render time.
     */
    offset: number;
    /**
     * Actual rtl/ltr mode.
     */
    dirMode: string;
}

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
const TableBodyCell = <TData, TValue>({
    cell,
    renderer,
    isExpanded,
    isPinned,
    offset,
    dirMode
}: ITableBodyCellProps<TData, TValue>) => {
    const isExpanderCell = cell.column.id === "expander";
    const isRTL = dirMode === "rtl";

    const explicitSize = cell.column.columnDef.meta?.explicitSize;
    const isCustomCell = Boolean(cell.column.columnDef.meta?.isCustomCell);

    return (
        <td
            className={classNames("tableBodyCell", {
                tableBodyCell_expander: isExpanderCell,
                tableBodyCell_expander_expanded: isExpanded,
                tableBodyCell_pinned: isPinned
            })}
            style={getCellStyle(
                isExpanderCell,
                cell.column.getSize(),
                explicitSize,
                offset,
                isPinned,
                isRTL,
                isCustomCell
            )}
        >
            <div className="tableBodyCell__content">{flexRender(renderer, cell.getContext())}</div>
        </td>
    );
};

/**
 * By defining a strict interface with a generic call signature,
 * we force TypeScript to treat the Memoized component as a generic function!
 */
interface IMemoizedTableBodyCell {
    <TData, TValue>(props: ITableBodyCellProps<TData, TValue>): React.ReactElement | null;
}

const MemoizedTableBodyCell = memo(TableBodyCell, areCellsEqual) as IMemoizedTableBodyCell;

export default MemoizedTableBodyCell;
