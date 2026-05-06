import { ChangeEvent, useEffect, useState } from "react";
import { Column, ColumnPinningState } from "@tanstack/react-table";

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
    onToggle?: (open: boolean) => void;
}

export const useManageColumns = <TData>({
    columns,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    columnPinning,
    defaultColumnPinning,
    onApplyColumnPinning,
    onToggle
}: IUseManageColumnsParams<TData>) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState<Record<string, unknown>>({});
    const [columnsToRender, setColumnsToRender] = useState<Column<TData>[]>(columns);

    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibilityState>(columnVisibility);
    const [draftPinning, setDraftPinning] = useState<ColumnPinningState>(columnPinning);

    const openPopover = () => {
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setColumnsToRender(columns);
        setPopoverOpen(true);
        onToggle?.(true);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setColumnsToRender(columns);
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        onToggle?.(false);
    };

    const handleCancel = () => {
        closePopover();
    };

    const handleSave = () => {
        onApplyColumnVisibility(draftVisibility);
        onApplyColumnPinning(draftPinning);
        setPopoverOpen(false);
        onToggle?.(false);
    };

    const handleRestoreDefaults = () => {
        setDraftVisibility(defaultColumnVisibility);
        setDraftPinning(defaultColumnPinning);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();

        if (!searchValue) {
            setColumnsToRender(columns);
            return;
        }

        setColumnsToRender(
            columns.filter((column) => {
                const { header } = column.columnDef;
                const headerText = typeof header === "string" ? header : "";

                return headerText.toLowerCase().includes(searchValue) || column.id.toLowerCase().includes(searchValue);
            })
        );
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

    useEffect(() => {
        if (!popoverOpen) {
            setDraftVisibility(columnVisibility);
            setDraftPinning(columnPinning);
            setColumnsToRender(columns);
        }
    }, [columns, columnVisibility, columnPinning, popoverOpen]);

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
        handleToggleColumnPinning
    };
};
