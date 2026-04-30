import React, { ReactNode, useRef } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";
import { EXPANDABLE_CELL_WIDTH } from "@components/organisms/DataTable/constants";
import ExpanderCell from "@components/organisms/DataTable/TableBody/ExpanderCell/ExpanderCell";
import { DataTableColumn, DataTableRowExpandChangeHandler } from "@components/organisms/DataTable/types";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

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
export const withExpanderColumn = <TData,>(
    columns: ColumnDef<TData, ReactNode>[],
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>
): ColumnDef<TData, ReactNode>[] => [
    {
        id: "expander",
        header: "",
        size: EXPANDABLE_CELL_WIDTH,
        cell: (ctx: CellContext<TData, ReactNode>) => <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
    },
    ...columns
];
