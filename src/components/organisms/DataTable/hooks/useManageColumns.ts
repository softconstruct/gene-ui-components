import { ChangeEvent, useEffect, useState } from "react";
import { Column } from "@tanstack/react-table";

// Types
import { ColumnVisibilityState } from "@components/organisms/DataTable/types";

interface IUseManageColumnsParams<TData> {
    columns: Column<TData>[];
    columnVisibility: ColumnVisibilityState;
    defaultColumnVisibility: ColumnVisibilityState;
    onApplyColumnVisibility: (nextVisibility: ColumnVisibilityState) => void;
    onToggle?: (open: boolean) => void;
}

export const useManageColumns = <TData>({
    columns,
    columnVisibility,
    defaultColumnVisibility,
    onApplyColumnVisibility,
    onToggle
}: IUseManageColumnsParams<TData>) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState<Record<string, unknown>>({});
    const [columnsToRender, setColumnsToRender] = useState<Column<TData>[]>(columns);
    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibilityState>(columnVisibility);

    const openPopover = () => {
        setDraftVisibility(columnVisibility);
        setColumnsToRender(columns);
        setPopoverOpen(true);
        onToggle?.(true);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setColumnsToRender(columns);
        setDraftVisibility(columnVisibility);
        onToggle?.(false);
    };

    const handleCancel = () => {
        closePopover();
    };

    const handleSave = () => {
        onApplyColumnVisibility(draftVisibility);
        setPopoverOpen(false);
        onToggle?.(false);
    };

    const handleRestoreDefaults = () => {
        setDraftVisibility(defaultColumnVisibility);
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

    useEffect(() => {
        if (!popoverOpen) {
            setDraftVisibility(columnVisibility);
            setColumnsToRender(columns);
        }
    }, [columns, columnVisibility, popoverOpen]);

    return {
        popoverOpen,
        propsForPopover,
        setPropsForPopover,
        columnsToRender,
        draftVisibility,
        openPopover,
        closePopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleRestoreDefaults,
        handleToggleColumnVisibility
    };
};
