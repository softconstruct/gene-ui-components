import { ChangeEvent, useEffect, useState } from "react";
import { Column, ColumnOrderState, ColumnPinningState } from "@tanstack/react-table";

// Types
import { ColumnVisibilityState } from "@components/organisms/DataTable/types";

interface IUseManageColumnsParams<TData> {
    columns: Column<TData>[];

    columnVisibility: ColumnVisibilityState;
    defaultColumnVisibility: ColumnVisibilityState;
    onApplyColumnVisibility: (nextVisibility: ColumnVisibilityState) => void;

    columnPinning: ColumnPinningState;
    defaultColumnPinning: ColumnPinningState;
    onApplyColumnPinning: (nextPinning: ColumnPinningState) => void;

    columnOrder: ColumnOrderState;
    defaultColumnOrder: ColumnOrderState;
    onApplyColumnOrder: (nextOrder: ColumnOrderState) => void;

    onToggle?: (open: boolean) => void;
}

const sortColumns = <TData>(cols: Column<TData>[], order: string[]) => {
    if (!order.length) return cols;
    return [...cols].sort((a, b) => {
        const aIndex = order.indexOf(a.id);
        const bIndex = order.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
};

export const useManageColumns = <TData>({
    columns,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning,
    columnOrder,
    defaultColumnOrder,
    onApplyColumnOrder,
    onToggle
}: IUseManageColumnsParams<TData>) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState<Record<string, unknown>>({});

    const initialOrder = columnOrder.length ? columnOrder : defaultColumnOrder;

    const [columnsToRender, setColumnsToRender] = useState<Column<TData>[]>(sortColumns(columns, initialOrder));

    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibilityState>(columnVisibility);
    const [draftPinning, setDraftPinning] = useState<ColumnPinningState>(columnPinning);
    const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnOrderState>(initialOrder);

    const openPopover = () => {
        const currentOrder = columnOrder.length ? columnOrder : defaultColumnOrder;
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setDraftColumnOrder(currentOrder);
        setColumnsToRender(sortColumns(columns, currentOrder));
        setPopoverOpen(true);
        onToggle?.(true);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setDraftColumnOrder(columnOrder.length ? columnOrder : defaultColumnOrder);
        setColumnsToRender(sortColumns(columns, columnOrder.length ? columnOrder : defaultColumnOrder));
        onToggle?.(false);
    };

    const handleCancel = () => closePopover();

    const handleSave = () => {
        onApplyColumnVisibility(draftVisibility);
        onApplyColumnPinning(draftPinning);
        onApplyColumnOrder(draftColumnOrder);
        setPopoverOpen(false);
        onToggle?.(false);
    };

    const handleRestoreDefaults = () => {
        setDraftVisibility(defaultColumnVisibility);
        setDraftPinning(defaultColumnPinning);
        setDraftColumnOrder(defaultColumnOrder);
        setColumnsToRender(sortColumns(columns, defaultColumnOrder));
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();

        if (!searchValue) {
            setColumnsToRender(sortColumns(columns, draftColumnOrder));
            return;
        }

        const filtered = columns.filter((column) => {
            const { header } = column.columnDef;
            const headerText = typeof header === "string" ? header : "";

            return headerText.toLowerCase().includes(searchValue) || column.id.toLowerCase().includes(searchValue);
        });

        setColumnsToRender(sortColumns(filtered, draftColumnOrder));
    };

    const handleToggleColumnVisibility = (column: Column<TData>) => {
        setDraftVisibility((prev) => ({
            ...prev,
            [column.id]: !(prev[column.id] ?? true)
        }));
    };

    const handleToggleColumnPinning = (column: Column<TData>) => {
        setDraftPinning((prev) => {
            const leftPinned = prev.left || [];
            const isPinned = leftPinned.includes(column.id);

            return {
                ...prev,
                left: isPinned ? leftPinned.filter((id) => id !== column.id) : [...leftPinned, column.id]
            };
        });
    };

    const handleColumnReorder = (sourceId: string, destinationId: string, edge: string | null) => {
        setDraftColumnOrder((prev) => {
            const newOrder = [...prev];
            const sourceIndex = newOrder.indexOf(sourceId);
            const destIndex = newOrder.indexOf(destinationId);

            if (sourceIndex === -1 || destIndex === -1) return prev;

            newOrder.splice(sourceIndex, 1);

            let finalIndex = destIndex;
            if (sourceIndex < destIndex) {
                finalIndex = edge === "bottom" ? destIndex : destIndex - 1;
            } else {
                finalIndex = edge === "bottom" ? destIndex + 1 : destIndex;
            }

            newOrder.splice(finalIndex, 0, sourceId);
            return newOrder;
        });
    };

    useEffect(() => {
        if (!popoverOpen) {
            setDraftVisibility(columnVisibility);
            setDraftPinning(columnPinning);
            const order = columnOrder.length ? columnOrder : defaultColumnOrder;
            setDraftColumnOrder(order);
            setColumnsToRender(sortColumns(columns, order));
        }
    }, [columns, columnVisibility, columnPinning, columnOrder, defaultColumnOrder, popoverOpen]);

    useEffect(() => {
        if (popoverOpen) {
            setColumnsToRender((prev) => sortColumns(prev, draftColumnOrder));
        }
    }, [draftColumnOrder, popoverOpen]);

    return {
        popoverOpen,
        propsForPopover,
        setPropsForPopover,
        columnsToRender,
        draftVisibility,
        draftPinning,
        openPopover,
        closePopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleRestoreDefaults,
        handleToggleColumnVisibility,
        handleToggleColumnPinning,
        handleColumnReorder
    };
};
