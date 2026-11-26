import { useCallback, useRef } from "react";
import { Table } from "@tanstack/react-table";

// Helpers
import { togglePageSelection, toggleRowSelection } from "../helper";
// Types
import { IDataTableBulkActionsConfig } from "../types";

/**
 * Selection handlers for the checkboxes and the toolbar.
 *
 * @param table - The TanStack table.
 * @param config - The consumer's bulk actions' config.
 * @param isSelectionDisabled - Whether changes are blocked (table loading or in edit mode).
 */
export const useBulkSelection = <TData>(
    table: Table<TData>,
    config: IDataTableBulkActionsConfig | undefined,
    isSelectionDisabled: boolean
) => {
    const latestRef = useRef({ config, isSelectionDisabled });
    latestRef.current = { config, isSelectionDisabled };

    const reportSelection = useCallback((getNext: (current: string[]) => string[]) => {
        const { config: currentConfig, isSelectionDisabled: isDisabled } = latestRef.current;
        if (!currentConfig || isDisabled) return;

        currentConfig.onSelectionChange({ selectedRowIds: getNext(currentConfig.selectedRowIds) });
    }, []);

    const onToggleRow = useCallback(
        (rowId: string) => reportSelection((current) => toggleRowSelection(current, rowId)),
        [reportSelection]
    );

    const onTogglePage = useCallback(() => {
        const pageRowIds = table.getRowModel().rows.map((row) => row.id);
        reportSelection((current) => togglePageSelection(current, pageRowIds));
    }, [reportSelection, table]);

    const onDeselect = useCallback(() => reportSelection(() => []), [reportSelection]);

    return { onToggleRow, onTogglePage, onDeselect };
};
