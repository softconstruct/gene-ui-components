import React, { memo } from "react";
import { Cell, ColumnDef, flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import { EXPANDABLE_CELL_SIZE_REM } from "@components/organisms/DataTable/constants";

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
     * Required so that state-dependent renderers (pinned column background)
     * invalidate the memo when the column toggles.
     */
    isPinned?: boolean | "left" | "right";
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
const TableBodyCell = <TData, TValue>({ cell, renderer, isExpanded, isPinned }: ITableBodyCellProps<TData, TValue>) => {
    const isExpanderCell = cell.column.id === "expander";
    return (
        <td
            className={classNames("tableBodyCell", {
                tableBodyCell_expander: isExpanderCell,
                tableBodyCell_expander_expanded: isExpanded,
                tableBodyCell_pinned: isPinned !== false
            })}
            style={{
                width: isExpanderCell ? EXPANDABLE_CELL_SIZE_REM : undefined,
                minWidth: isExpanderCell ? EXPANDABLE_CELL_SIZE_REM : undefined,
                maxWidth: 250 // temp
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
    prev.isPinned === next.isPinned;

/**
 * `React.memo` erases the generic signature; this helper restores it without
 * an unsafe `as typeof TableBodyCell` cast on the consumer side.
 */
const memoGeneric = <TProps,>(
    component: (props: TProps) => React.ReactElement | null,
    isEqual: (prev: TProps, next: TProps) => boolean
): typeof component => memo(component, isEqual) as unknown as typeof component;

const MemoizedTableBodyCell = memoGeneric(TableBodyCell, areCellsEqual);

export { areCellsEqual };
export default MemoizedTableBodyCell;
