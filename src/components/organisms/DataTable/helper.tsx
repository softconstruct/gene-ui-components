import React, { ReactNode, useRef } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";
import { EXPANDABLE_CELL_WIDTH } from "@components/organisms/DataTable/constants";
import ExpanderCell from "@components/organisms/DataTable/TableBody/ExpanderCell/ExpanderCell";
import { DataTableColumn, DataTableRowExpandChangeHandler, ITableData } from "@components/organisms/DataTable/types";

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

export const TableColumnsAdapter = <TData extends ITableData>(
    columns: DataTableColumn<TData>[],
    expandable: boolean,
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>
) => {
    const adapted: ColumnDef<TData, ReactNode>[] = columns.map((col, index) => {
        const isAccessorColumn = Boolean(col.accessorKey);

        const base: ColumnDef<TData> = {
            id: col.id ?? (col.accessorKey ? String(col.accessorKey) : `display_${index}`),
            header: col.header ?? (col.accessorKey ? String(col.accessorKey) : ""),
            size: col.size,
            ...(isAccessorColumn ? { accessorKey: col.accessorKey } : {})
        };

        if (!col.renderCell) return base;

        return {
            ...base,
            cell: (ctx: CellContext<TData, ReactNode>) =>
                col.renderCell?.({
                    value: isAccessorColumn ? ctx.getValue() : undefined,
                    row: ctx.row.original,
                    rowId: ctx.row.id
                })
        };
    });

    if (!expandable) return adapted;

    return [
        {
            id: "expander",
            header: "",
            cell: (ctx: CellContext<TData, ReactNode>) => (
                <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
            ),
            size: EXPANDABLE_CELL_WIDTH
        },
        ...adapted
    ];
};
