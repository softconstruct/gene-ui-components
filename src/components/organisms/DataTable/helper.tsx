import React, { CSSProperties, ReactNode, useRef } from "react";
import { Cell, CellContext, ColumnDef } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { EXPANDER_COLUMN_ID, EXPANDER_COLUMN_SIZE } from "./constants";
import { useCellWidth } from "./context";
import ExpanderCell from "./TableBody/ExpanderCell/ExpanderCell";
import { DataTableColumn, DataTableRowExpandChangeHandler } from "./types";

/**
 * Props for the TableBodyCell component, defined here to be used by areCellsEqual.
 */
export interface ICellProps<TData, TValue> {
    cell: Cell<TData, TValue>;
    isExpanded: boolean;
    renderer: ColumnDef<TData, TValue>["cell"];
    isPinned?: boolean;
    offset: number;
    /**
     * Rendered width (px) of the cell's column, as measured by its header cell.
     */
    width: number;
    dirMode: string;
    /**
     * Snapshot of `cell.getValue()` captured by the parent at render time.
     * Keeps memoized cells from going stale when data values change in place.
     */
    value: unknown;
    /**
     * Snapshot of `row.original` captured by the parent at render time.
     * Custom `renderCell` renderers read the whole row, so a new row object
     * must invalidate the memo even when this column's value is unchanged.
     */
    rowData: TData;
}

/**
 * Inline style of a header or body cell: the explicit column `size` (a fixed column for the table
 * layout, it takes no share of the free horizontal space) and the sticky inset of pinned columns.
 */
export const getCellStyle = (
    explicitSize: number | undefined,
    offset: number,
    isPinned: boolean | string | undefined,
    isRTL: boolean
): CSSProperties | undefined => {
    const roundedOffset = `${Math.round(offset)}px`;

    const style: CSSProperties = {
        ...(explicitSize !== undefined && { width: `${explicitSize}px` }),
        ...(isPinned && (isRTL ? { right: roundedOffset } : { left: roundedOffset }))
    };

    return Object.keys(style).length ? style : undefined;
};

/**
 * Inline style of the content wrapper of a cell: an explicit column `size` must also be the intrinsic
 * width of the content, a `width` on the cell alone is ignored by the table layout once the table overflows.
 */
export const getCellContentStyle = (explicitSize: number | undefined): CSSProperties | undefined =>
    explicitSize !== undefined ? { width: `${explicitSize}px`, maxWidth: "none" } : undefined;

export const areCellsEqual = <TData, TValue>(prev: ICellProps<TData, TValue>, next: ICellProps<TData, TValue>) =>
    prev.cell.id === next.cell.id &&
    prev.isExpanded === next.isExpanded &&
    prev.renderer === next.renderer &&
    prev.isPinned === next.isPinned &&
    prev.offset === next.offset &&
    prev.width === next.width &&
    prev.dirMode === next.dirMode &&
    prev.value === next.value &&
    prev.rowData === next.rowData;

export const DefaultCellComponent = ({ value }: { value: string }) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const columnWidth = useCellWidth();
    const isTruncated = useEllipsisDetection(textRef, [columnWidth]);

    return (
        <Tooltip text={value} isVisible={isTruncated}>
            <Text ref={textRef} className="tableBodyCell__text" as="span" variant="labelMediumMedium">
                {value}
            </Text>
        </Tooltip>
    );
};

/**
 * Normalizes the public {@link DataTableColumn} shape into TanStack `ColumnDef[]`.
 * Pure transformation: does not inject any non-data columns.
 */
export const adaptColumns = <TData,>(columns: DataTableColumn<TData>[]): ColumnDef<TData, ReactNode>[] =>
    columns.map((col, index) => {
        const { accessorKey, id, header, size, renderCell, defaultVisible, defaultPinned } = col;
        const isAccessorColumn = Boolean(accessorKey);

        const base: ColumnDef<TData> = {
            id: id ?? accessorKey ?? `display_${index}`,
            header: header ?? accessorKey ?? "",
            ...(size !== undefined && { size }),
            meta: {
                explicitSize: size,
                defaultVisible,
                defaultPinned
            },
            ...(isAccessorColumn ? { accessorKey } : {})
        };

        if (!renderCell) return base;

        return {
            ...base,
            cell: (ctx: CellContext<TData, ReactNode>) =>
                renderCell({
                    value: isAccessorColumn ? ctx.getValue() : undefined,
                    row: ctx.row.original,
                    rowId: ctx.row.id
                })
        };
    });

/**
 * Composes a leading "expander" column onto an already adapted column list.
 * Kept separate from {@link adaptColumns} so other special columns (selection,
 * drag-handle, …) can be composed the same way without further branching.
 */
export const withExpanderColumn = <TData,>(
    columns: ColumnDef<TData, ReactNode>[],
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>
): ColumnDef<TData, ReactNode>[] => [
    {
        id: EXPANDER_COLUMN_ID,
        header: "",
        size: EXPANDER_COLUMN_SIZE,
        meta: {
            explicitSize: EXPANDER_COLUMN_SIZE
        },
        cell: (ctx: CellContext<TData, ReactNode>) => <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
    },
    ...columns
];
