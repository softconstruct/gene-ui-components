import React, { ReactNode, useRef } from "react";
import { Cell, CellContext, ColumnDef } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { CELL_MAX_WIDTH, CUSTOM_CELL_MAX_SIZE, CUSTOM_CELL_MIN_SIZE, EXPANDABLE_CELL_SIZE_REM } from "./constants";
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
    dirMode: string;
}

export const getCellStyle = (
    isExpander: boolean,
    columnSize: number,
    explicitSize: number | undefined,
    offset: number,
    isPinned: boolean | string | undefined,
    isRTL: boolean,
    isCustomCell: boolean = false
) => {
    const roundedOffset = Math.round(offset);

    const baseStyle = {
        ...(isPinned && {
            left: !isRTL ? `${roundedOffset}px` : undefined,
            right: isRTL ? `${roundedOffset}px` : undefined
        })
    };

    if (isExpander) {
        return {
            ...baseStyle,
            width: EXPANDABLE_CELL_SIZE_REM,
            minWidth: EXPANDABLE_CELL_SIZE_REM,
            maxWidth: EXPANDABLE_CELL_SIZE_REM
        };
    }

    if (explicitSize !== undefined) {
        return {
            ...baseStyle,
            width: `${explicitSize}px`,
            minWidth: `${explicitSize}px`,
            maxWidth: isCustomCell ? "max-content" : CELL_MAX_WIDTH
        };
    }

    if (isCustomCell) {
        return {
            ...baseStyle,
            width: `${columnSize}px`,
            minWidth: "max-content",
            maxWidth: "max-content"
        };
    }

    return {
        ...baseStyle,
        width: `${columnSize}px`,
        minWidth: `${columnSize}px`,
        maxWidth: CELL_MAX_WIDTH
    };
};

export const areCellsEqual = <TData, TValue>(prev: ICellProps<TData, TValue>, next: ICellProps<TData, TValue>) =>
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
export const adaptColumns = <TData,>(columns: DataTableColumn<TData>[]): ColumnDef<TData, ReactNode>[] =>
    columns.map((col, index) => {
        const { accessorKey, id, header, size, renderCell } = col;
        const isAccessorColumn = Boolean(accessorKey);
        const isCustomCell = Boolean(renderCell);

        const base: ColumnDef<TData> = {
            id: id ?? accessorKey ?? `display_${index}`,
            header: header ?? accessorKey ?? "",
            size: size ?? (isCustomCell ? CUSTOM_CELL_MIN_SIZE : CUSTOM_CELL_MAX_SIZE),
            meta: {
                isCustomCell,
                explicitSize: size
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
        id: "expander",
        header: "",
        cell: (ctx: CellContext<TData, ReactNode>) => <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
    },
    ...columns
];
