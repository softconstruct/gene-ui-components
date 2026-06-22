import React, { ReactNode, useRef } from "react";
import { Cell, CellContext, ColumnDef } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { EXPANDABLE_CELL_SIZE_REM } from "./constants";
import ExpanderCell from "./TableBody/ExpanderCell/ExpanderCell";
import { DataTableColumn, DataTableRowExpandChangeHandler } from "./types";

/**
 * Props for the TableBodyCell component, defined here to be used by areCellsEqual.
 */
export interface ICellProps<TData extends object, TValue> {
    cell: Cell<TData, TValue>;
    isExpanded: boolean;
    renderer: ColumnDef<TData, TValue>["cell"];
    isPinned?: boolean;
    offset: number;
    dirMode: string;
}

export const getCellStyle = (
    isExpander: boolean,
    columnSize: number,
    offset: number,
    isPinned: boolean | string | undefined,
    isRTL: boolean
) => ({
    width: isExpander ? EXPANDABLE_CELL_SIZE_REM : `${columnSize}px`,
    minWidth: isExpander ? EXPANDABLE_CELL_SIZE_REM : `${columnSize}px`,
    ...(isPinned && {
        left: !isRTL ? `${offset}px` : undefined,
        right: isRTL ? `${offset}px` : undefined
    })
});

/**
 * Custom equality for TableBodyCell's memo. Compares only the
 * primitive snapshot props — the cell instance itself is intentionally
 * ignored because TanStack creates a new one on every render.
 */
export const areCellsEqual = <TData extends object, TValue>(
    prev: ICellProps<TData, TValue>,
    next: ICellProps<TData, TValue>
) =>
    prev.cell.id === next.cell.id &&
    prev.isExpanded === next.isExpanded &&
    prev.renderer === next.renderer &&
    prev.isPinned === next.isPinned &&
    prev.offset === next.offset &&
    prev.dirMode === next.dirMode;

export const DefaultCellComponent = ({ value }: { value: string }) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef);
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
export const adaptColumns = <TData extends object>(columns: DataTableColumn<TData>[]): ColumnDef<TData, ReactNode>[] =>
    columns.map((col, index) => {
        const { accessorKey, id, header, size, renderCell } = col;
        const isAccessorColumn = Boolean(accessorKey);

        const base: ColumnDef<TData> = {
            id: id ?? accessorKey ?? `display_${index}`,
            header: header ?? accessorKey ?? "",
            size,
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
export const withExpanderColumn = <TData extends object>(
    columns: ColumnDef<TData, ReactNode>[],
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>
): ColumnDef<TData, ReactNode>[] => [
    {
        id: "expander",
        header: "",
        cell: (ctx: CellContext<TData, ReactNode>) => <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
    },
    ...columns
];
