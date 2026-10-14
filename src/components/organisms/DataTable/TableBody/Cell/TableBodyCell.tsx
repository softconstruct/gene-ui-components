import React, { memo } from "react";
import { Cell, ColumnDef, flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import { areCellsEqual, getCellContentStyle, getCellStyle } from "@components/organisms/DataTable/helper";

import { EXPANDER_COLUMN_ID } from "../../constants";
import { CellWidthContext } from "../../context";

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
     * Sticky inset (px) of the cell when its column is pinned.
     */
    offset: number;
    /**
     * Rendered width (px) of the cell's column, so that the content re-checks its truncation when it changes.
     */
    width: number;
    /**
     * Actual rtl/ltr mode.
     */
    dirMode: string;
    /**
     * Snapshot of `cell.getValue()` captured by the parent at render time.
     * Not read during render (the live `cell` context is used instead) — it exists
     * so the memo invalidates when a data value changes in place.
     */
    // eslint-disable-next-line react/no-unused-prop-types -- consumed by the areCellsEqual memo comparator
    value: unknown;
    /**
     * Snapshot of `row.original` captured by the parent at render time.
     * Invalidates the memo for custom `renderCell` renderers, which can read
     * any field of the row — not only this column's value.
     */
    // eslint-disable-next-line react/no-unused-prop-types -- consumed by the areCellsEqual memo comparator
    rowData: TData;
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
    width,
    dirMode
}: ITableBodyCellProps<TData, TValue>) => {
    const isExpanderCell = cell.column.id === EXPANDER_COLUMN_ID;
    const isRTL = dirMode === "rtl";
    const explicitSize = cell.column.columnDef.meta?.explicitSize;

    return (
        <td
            className={classNames("tableBodyCell", {
                tableBodyCell_expander: isExpanderCell,
                tableBodyCell_expander_expanded: isExpanded,
                tableBodyCell_pinned: isPinned
            })}
            style={getCellStyle(explicitSize, offset, isPinned, isRTL)}
        >
            <CellWidthContext.Provider value={width}>
                <div className="tableBodyCell__content" style={getCellContentStyle(explicitSize)}>
                    {flexRender(renderer, cell.getContext())}
                </div>
            </CellWidthContext.Provider>
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
