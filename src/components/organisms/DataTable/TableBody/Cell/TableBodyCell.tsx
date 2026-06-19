import React, { memo, ReactElement } from "react";
import { Cell, ColumnDef, flexRender } from "@tanstack/react-table";
import classNames from "classnames";

// Styles
import "./TableBodyCell.scss";

import { EXPANDABLE_CELL_SIZE_REM } from "../../constants";

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
interface ITableBodyCellProps<TData, TValue> {
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

    return (
        <td
            className={classNames("tableBodyCell", {
                tableBodyCell_expander: isExpanderCell,
                tableBodyCell_expander_expanded: isExpanded,
                tableBodyCell_pinned: isPinned
            })}
            style={{
                width: isExpanderCell ? EXPANDABLE_CELL_SIZE_REM : `${cell.column.getSize()}px`,
                minWidth: isExpanderCell ? EXPANDABLE_CELL_SIZE_REM : `${cell.column.getSize()}px`,
                ...(isPinned && {
                    left: !isRTL ? `${offset}px` : undefined,
                    right: isRTL ? `${offset}px` : undefined
                })
            }}
        >
            <div className="tableBodyCell__content">{flexRender(renderer, cell.getContext())}</div>
        </td>
    );
};

/**
 * Custom equality for {@link TableBodyCell}'s memo. Compares only the
 * primitive snapshot props — the `cell` instance itself is intentionally
 * ignored because TanStack creates a new one on every render.
 */
const areCellsEqual = <TData, TValue>(
    prev: ITableBodyCellProps<TData, TValue>,
    next: ITableBodyCellProps<TData, TValue>
) =>
    prev.cell.id === next.cell.id &&
    prev.isExpanded === next.isExpanded &&
    prev.renderer === next.renderer &&
    prev.isPinned === next.isPinned &&
    prev.offset === next.offset &&
    prev.dirMode === next.dirMode;

/**
 * `React.memo` erases the generic signature; this helper restores it without
 * an unsafe `as typeof TableBodyCell` cast on the consumer side.
 */
const memoGeneric = <TProps,>(
    component: (props: TProps) => ReactElement | null,
    isEqual: (prev: TProps, next: TProps) => boolean
): typeof component => memo(component, isEqual) as unknown as typeof component;

const MemoizedTableBodyCell = memoGeneric(TableBodyCell, areCellsEqual);

export { areCellsEqual };
export default MemoizedTableBodyCell;
