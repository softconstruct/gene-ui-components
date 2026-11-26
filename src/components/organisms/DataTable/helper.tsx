import React, { CSSProperties, ReactNode, useRef } from "react";
import { Cell, CellContext, ColumnDef, RowSelectionState } from "@tanstack/react-table";

// Components
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import NumberField from "@components/molecules/NumberField";
import TextField from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { EXPANDER_COLUMN_ID, EXPANDER_COLUMN_SIZE, SELECTION_COLUMN_ID, SELECTION_COLUMN_SIZE } from "./constants";
import { useCellWidth } from "./context";
import ExpanderCell from "./TableBody/ExpanderCell/ExpanderCell";
import SelectionCell from "./TableBody/SelectionCell/SelectionCell";
import {
    DataTableCellValue,
    DataTableColumn,
    DataTableColumnType,
    DataTableRenderEditCellArgs,
    DataTableRowExpandChangeHandler,
    PageCheckboxState
} from "./types";

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
    /**
     * Text this cell copies, resolved by the parent. Absent when the column is not `copyable` or has
     * a custom `renderCell`, and empty when the column copies but this cell has nothing to copy; the
     * copy control is not rendered for either.
     */
    copyValue?: string;
    /**
     * Whether this cell renders an editor instead of its read-only content, that is whether the table
     * is in edit mode and the column is `editable`.
     */
    isCellEditing: boolean;
    /**
     * Whether the editor of this cell is interactive.
     */
    isEditDisabled?: boolean;
    /**
     * Value the editor shows: the draft from `editValues` when the cell has one, the value from
     * `data` otherwise.
     */
    editValue: unknown;
    /**
     * Snapshot of `column.columnDef.meta.renderEditCell` — the renderer reference. Catches
     * consumers updating the `columns` prop with a new renderer closure.
     */
    renderEditCell?: (args: DataTableRenderEditCellArgs<TData, unknown>) => ReactNode;
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

/**
 * Text the copy control of a cell puts on the clipboard: `getCopyValue` when the column defines one,
 * the cell's value as text otherwise. `undefined` on a column that is not `copyable`, and an empty
 * string when the column is but this cell has nothing to copy; the control is rendered for neither.
 */
export const resolveCopyValue = <TData,>(cell: Cell<TData, unknown>, value: unknown): string | undefined => {
    const { copyable, getCopyValue } = cell.column.columnDef.meta ?? {};

    if (!copyable) {
        return undefined;
    }

    if (!getCopyValue) {
        return String(value ?? "");
    }

    return getCopyValue({
        value: value as DataTableCellValue<TData>,
        row: cell.row.original,
        rowId: cell.row.id
    });
};

export const areCellsEqual = <TData, TValue>(prev: ICellProps<TData, TValue>, next: ICellProps<TData, TValue>) =>
    prev.cell.id === next.cell.id &&
    prev.isExpanded === next.isExpanded &&
    prev.renderer === next.renderer &&
    prev.isPinned === next.isPinned &&
    prev.offset === next.offset &&
    prev.width === next.width &&
    prev.dirMode === next.dirMode &&
    prev.value === next.value &&
    prev.rowData === next.rowData &&
    prev.copyValue === next.copyValue &&
    prev.isCellEditing === next.isCellEditing &&
    prev.isEditDisabled === next.isEditDisabled &&
    prev.editValue === next.editValue &&
    prev.renderEditCell === next.renderEditCell;

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

export type DataTableColumnTypeDefinition = {
    renderValue: (value: unknown) => ReactNode;
    renderEditControl: (args: DataTableRenderEditCellArgs<unknown, unknown>) => ReactNode;
};

export const DEFAULT_COLUMN_TYPE: DataTableColumnType = "text";

export const columnTypes: Record<DataTableColumnType, DataTableColumnTypeDefinition> = {
    text: {
        renderValue: (value) => <DefaultCellComponent value={String(value ?? "")} />,
        renderEditControl: ({ value, disabled, onChange }) => (
            <TextField
                size="small"
                value={String(value ?? "")}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
            />
        )
    },
    number: {
        renderValue: (value) => <DefaultCellComponent value={String(value ?? "")} />,
        renderEditControl: ({ value, disabled, onChange }) => (
            <NumberField
                size="small"
                value={typeof value === "number" || typeof value === "string" ? value : ""}
                disabled={disabled}
                onChange={(nextValue) => onChange(nextValue)}
            />
        )
    },
    boolean: {
        renderValue: (value) => <DefaultCellComponent value={typeof value === "boolean" ? String(value) : ""} />,
        renderEditControl: ({ value, disabled, onChange }) => (
            <Checkbox
                checked={Boolean(value)}
                disabled={disabled}
                onChange={(event) => onChange(event.target.checked)}
            />
        )
    }
};

export const resolveColumnType = (type?: DataTableColumnType): DataTableColumnTypeDefinition =>
    columnTypes[type as DataTableColumnType] ?? columnTypes[DEFAULT_COLUMN_TYPE];

/**
 * Normalizes the public {@link DataTableColumn} shape into TanStack `ColumnDef[]`.
 * Pure transformation: does not inject any non-data columns.
 */
export const adaptColumns = <TData,>(columns: DataTableColumn<TData>[]): ColumnDef<TData, ReactNode>[] =>
    columns.map((col, index) => {
        const {
            accessorKey,
            id,
            header,
            size,
            type,
            copyable,
            getCopyValue,
            renderCell,
            renderEditCell,
            defaultVisible,
            defaultPinned,
            editable
        } = col;
        const isAccessorColumn = Boolean(accessorKey);
        const typeDefaults = resolveColumnType(type);
        const isCopyable = copyable && !renderCell;

        const base: ColumnDef<TData> = {
            id: id ?? accessorKey ?? `display_${index}`,
            header: header ?? accessorKey ?? "",
            ...(size !== undefined && { size }),
            meta: {
                explicitSize: size,
                defaultVisible,
                defaultPinned,
                editable,
                copyable: isCopyable,
                getCopyValue: isCopyable ? getCopyValue : undefined,
                renderEditCell: editable ? (renderEditCell ?? typeDefaults.renderEditControl) : undefined
            },
            ...(isAccessorColumn ? { accessorKey } : {})
        };

        return {
            ...base,
            cell: renderCell
                ? (ctx: CellContext<TData, ReactNode>) =>
                      renderCell({
                          value: (isAccessorColumn ? ctx.getValue() : undefined) as DataTableCellValue<TData>,
                          row: ctx.row.original,
                          rowId: ctx.row.id
                      })
                : (ctx: CellContext<TData, ReactNode>) => typeDefaults.renderValue(ctx.getValue())
        };
    });

/**
 * A fixed-width column the table adds itself, without a header label (expander, selection, …).
 */
const createBuiltInColumn = <TData,>(
    id: string,
    size: number,
    cell: ColumnDef<TData, ReactNode>["cell"]
): ColumnDef<TData, ReactNode> => ({
    id,
    header: "",
    size,
    meta: { explicitSize: size },
    cell
});

/**
 * The expander column of expandable rows.
 */
export const getExpanderColumn = <TData,>(onRowExpandChange?: DataTableRowExpandChangeHandler<TData>) =>
    createBuiltInColumn<TData>(EXPANDER_COLUMN_ID, EXPANDER_COLUMN_SIZE, (ctx: CellContext<TData, ReactNode>) => (
        <ExpanderCell {...ctx} onRowExpandChange={onRowExpandChange} />
    ));

/**
 * The checkbox column of the row selection.
 */
export const getSelectionColumn = <TData,>() =>
    createBuiltInColumn<TData>(SELECTION_COLUMN_ID, SELECTION_COLUMN_SIZE, (ctx: CellContext<TData, ReactNode>) => (
        <SelectionCell {...ctx} />
    ));

/**
 * Handles a click on a row checkbox: selects the row, or unselects it if it is already selected.
 */
export const toggleRowSelection = (selectedRowIds: string[], rowId: string): string[] =>
    selectedRowIds.includes(rowId) ? selectedRowIds.filter((id) => id !== rowId) : [...selectedRowIds, rowId];

/**
 * State of the header checkbox: how many of the current page's rows are selected.
 * Rows selected on other pages don't count.
 */
export const getPageCheckboxState = (selectedRowIds: string[], pageRowIds: string[]): PageCheckboxState => {
    if (pageRowIds.length === 0) return "unchecked";

    const selected = new Set(selectedRowIds);
    const selectedOnPage = pageRowIds.filter((id) => selected.has(id)).length;

    if (selectedOnPage === 0) return "unchecked";
    return selectedOnPage === pageRowIds.length ? "checked" : "indeterminate";
};

/**
 * Handles a click on the header checkbox. It changes only the rows of the current page:
 * - if all of them are selected, unselects them;
 * - otherwise (none or some selected), selects the ones that aren't selected yet.
 * Rows selected on other pages stay selected.
 */
export const togglePageSelection = (selectedRowIds: string[], pageRowIds: string[]): string[] => {
    const pageIds = new Set(pageRowIds);

    if (getPageCheckboxState(selectedRowIds, pageRowIds) === "checked") {
        return selectedRowIds.filter((id) => !pageIds.has(id));
    }

    const selected = new Set(selectedRowIds);
    return [...selectedRowIds, ...pageRowIds.filter((id) => !selected.has(id))];
};

/**
 * Converts the selection to TanStack's `rowSelection` state, so `row.getIsSelected()` works.
 */
export const toRowSelectionState = (selectedRowIds: string[]): RowSelectionState =>
    Object.fromEntries(selectedRowIds.map((id) => [id, true]));
