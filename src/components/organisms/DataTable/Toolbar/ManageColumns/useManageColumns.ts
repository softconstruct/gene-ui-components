import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Column, ColumnOrderState, ColumnPinningState, Table } from "@tanstack/react-table";

import { EXPANDER_COLUMN_ID } from "../../constants";
// Types
import { ColumnVisibilityState, ManageColumnsConfig } from "../../types";

const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
};

/**
 * The expander is an internal, permanently pinned column (enforced by DataTable).
 * It must never appear in the manage-columns state, otherwise it can be hidden,
 * reordered, or counted by the select-all logic.
 */
const stripExpanderPinning = (pinning: ColumnPinningState): ColumnPinningState => ({
    left: (pinning.left || []).filter((id) => id !== EXPANDER_COLUMN_ID),
    right: (pinning.right || []).filter((id) => id !== EXPANDER_COLUMN_ID)
});

/**
 * Makes an order cover exactly the given columns: drops ids that no longer exist
 * and appends columns the order doesn't know yet (e.g. columns loaded after mount),
 * so reordering and saving always work on the full column list.
 */
const completeOrder = (order: string[], columnIds: string[]) => {
    const columnIdSet = new Set(columnIds);
    const knownIds = order.filter((id) => columnIdSet.has(id));
    const knownIdSet = new Set(knownIds);
    return [...knownIds, ...columnIds.filter((id) => !knownIdSet.has(id))];
};

export interface IManageColumnsDiffPayload {
    visibilityChanges: Record<string, boolean>;
    pinningChanges: ColumnPinningState | null;
    orderChanges: ColumnOrderState | null;
}

interface IUseManageColumnsParams<TData> {
    table: Table<TData>;
    manageColumnsConfig: ManageColumnsConfig;
    initialColumnVisibility: ColumnVisibilityState;
    initialColumnPinning: ColumnPinningState;
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
    table,
    manageColumnsConfig,
    initialColumnVisibility,
    initialColumnPinning
}: IUseManageColumnsParams<TData>) => {
    const allFlatColumns = table.getAllFlatColumns();
    const columns = useMemo(
        () => allFlatColumns.filter((column) => column.columns.length === 0 && column.id !== EXPANDER_COLUMN_ID),
        [allFlatColumns]
    );

    const { columnVisibility, columnPinning: tableColumnPinning, columnOrder } = table.getState();
    const columnPinning = useMemo(() => stripExpanderPinning(tableColumnPinning), [tableColumnPinning]);

    const defaultColumnOrder = useMemo(() => columns.map((c) => c.id), [columns]);
    const activeOrder = useMemo(
        () => completeOrder(columnOrder, defaultColumnOrder),
        [columnOrder, defaultColumnOrder]
    );

    const isControlled = manageColumnsConfig && manageColumnsConfig.open !== undefined;

    const [internalOpen, setInternalOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState({});

    const [searchValue, setSearchValue] = useState("");

    const popoverOpen = manageColumnsConfig?.open ?? internalOpen;

    const [columnsToRender, setColumnsToRender] = useState<Column<TData>[]>(() => sortColumns(columns, activeOrder));

    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibilityState>(columnVisibility);
    const [draftPinning, setDraftPinning] = useState<ColumnPinningState>(columnPinning);
    const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnOrderState>(activeOrder);

    const [diffTracker, setDiffTracker] = useState({
        visibility: new Set<string>(),
        pinning: new Set<string>(),
        orderChanged: false
    });

    const hasChanges = diffTracker.visibility.size > 0 || diffTracker.pinning.size > 0 || diffTracker.orderChanged;

    const resetDiffTracker = () => {
        setDiffTracker({ visibility: new Set(), pinning: new Set(), orderChanged: false });
    };

    const isDefaultState = useMemo(() => {
        const visEqual = columns.every(
            (col) => (draftVisibility[col.id] ?? true) === (initialColumnVisibility[col.id] ?? true)
        );
        const pinEqual =
            arraysEqual(draftPinning.left || [], initialColumnPinning.left || []) &&
            arraysEqual(draftPinning.right || [], initialColumnPinning.right || []);
        const orderEqual = arraysEqual(draftColumnOrder, defaultColumnOrder);
        return visEqual && pinEqual && orderEqual;
    }, [
        draftVisibility,
        initialColumnVisibility,
        draftPinning,
        initialColumnPinning,
        draftColumnOrder,
        defaultColumnOrder,
        columns
    ]);

    const setPopoverOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        manageColumnsConfig.onOpenChange?.(newOpen);
    };

    const openPopover = () => {
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setDraftColumnOrder(activeOrder);
        setColumnsToRender(sortColumns(columns, activeOrder));
        setSearchValue("");
        resetDiffTracker();
        setPopoverOpen(!popoverOpen);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setDraftColumnOrder(activeOrder);
        setColumnsToRender(sortColumns(columns, activeOrder));
        setSearchValue("");
        resetDiffTracker();
    };

    const handleCancel = () => closePopover();

    const handleSave = () => {
        const visibilityChanges: Record<string, boolean> = {};
        diffTracker.visibility.forEach((colId) => {
            visibilityChanges[colId] = draftVisibility[colId] ?? true;
        });

        const leftPinned = draftPinning.left || [];
        const rightPinned = draftPinning.right || [];
        const allPinnedIds = [...leftPinned, ...rightPinned];

        const draftOrder = completeOrder(draftColumnOrder, defaultColumnOrder);
        const pinnedIds = draftOrder.filter((id) => allPinnedIds.includes(id));
        const unpinnedIds = draftOrder.filter((id) => !allPinnedIds.includes(id));
        const finalOrder = [...pinnedIds, ...unpinnedIds];

        const newLeftPinned = finalOrder.filter((id) => leftPinned.includes(id));
        const newRightPinned = finalOrder.filter((id) => rightPinned.includes(id));
        const finalPinning = { ...draftPinning, left: newLeftPinned, right: newRightPinned };

        const pinningChanged = !arraysEqual(leftPinned, newLeftPinned) || !arraysEqual(rightPinned, newRightPinned);

        const diffPayload: IManageColumnsDiffPayload = {
            visibilityChanges,
            pinningChanges: diffTracker.pinning.size > 0 || pinningChanged ? finalPinning : null,
            orderChanges: diffTracker.orderChanged || !arraysEqual(finalOrder, activeOrder) ? finalOrder : null
        };

        table.setColumnVisibility(draftVisibility);
        table.setColumnPinning(finalPinning);
        table.setColumnOrder(finalOrder);

        setPopoverOpen(false);
        resetDiffTracker();

        if (manageColumnsConfig?.onSave) {
            manageColumnsConfig.onSave(diffPayload);
        }
    };

    const handleRestoreDefaults = () => {
        setDraftVisibility(initialColumnVisibility);
        setDraftPinning(initialColumnPinning);
        setDraftColumnOrder(defaultColumnOrder);
        setColumnsToRender(sortColumns(columns, defaultColumnOrder));
        setSearchValue("");

        setDiffTracker(() => {
            const newVis = new Set<string>();
            const newPin = new Set<string>();
            columns.forEach((col) => {
                if ((initialColumnVisibility[col.id] ?? true) !== (columnVisibility[col.id] ?? true))
                    newVis.add(col.id);

                const originalPinned = (columnPinning.left || []).includes(col.id);
                const defaultPinned = (initialColumnPinning.left || []).includes(col.id);
                if (originalPinned !== defaultPinned) newPin.add(col.id);
            });
            return { visibility: newVis, pinning: newPin, orderChanged: !arraysEqual(defaultColumnOrder, activeOrder) };
        });

        if (manageColumnsConfig?.onRestoreDefaults) {
            manageColumnsConfig.onRestoreDefaults();
        }
    };

    const filterColumnsBySearch = (searchQuery: string) => {
        const val = searchQuery.trim().toLowerCase();

        if (!val) {
            setColumnsToRender(sortColumns(columns, draftColumnOrder));
            return;
        }

        const filtered = columns.filter((column) => {
            const { header } = column.columnDef;
            const headerText = typeof header === "string" ? header : "";

            return headerText.toLowerCase().includes(val) || column.id.toLowerCase().includes(val);
        });

        setColumnsToRender(sortColumns(filtered, draftColumnOrder));
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);

        if (manageColumnsConfig?.onSearch) {
            manageColumnsConfig.onSearch(val);
        }

        filterColumnsBySearch(val);
    };

    const handleSearchClear = () => {
        setSearchValue("");
        setColumnsToRender(sortColumns(columns, draftColumnOrder));
    };

    const handleToggleColumnVisibility = (column: Column<TData>) => {
        if (manageColumnsConfig?.disabledColumns?.includes(column.id)) return;

        const nextVal = !(draftVisibility[column.id] ?? true);
        const originalVal = columnVisibility[column.id] ?? true;

        setDraftVisibility((prev) => ({ ...prev, [column.id]: nextVal }));
        setDiffTracker((prevDiffs) => {
            const newVis = new Set(prevDiffs.visibility);
            if (nextVal !== originalVal) newVis.add(column.id);
            else newVis.delete(column.id);
            return { ...prevDiffs, visibility: newVis };
        });

        if (manageColumnsConfig?.onColumnVisibilityChange) {
            manageColumnsConfig?.onColumnVisibilityChange();
        }
    };

    const handleToggleColumnPinning = (column: Column<TData>) => {
        if (manageColumnsConfig?.disabledColumns?.includes(column.id)) return;

        const leftPinned = draftPinning.left || [];
        const isPinnedNext = !leftPinned.includes(column.id);
        const originalPinned = (columnPinning.left || []).includes(column.id);

        setDraftPinning((prev) => ({
            ...prev,
            left: isPinnedNext ? [...(prev.left || []), column.id] : (prev.left || []).filter((id) => id !== column.id)
        }));
        setDiffTracker((prevDiffs) => {
            const newPin = new Set(prevDiffs.pinning);
            if (isPinnedNext !== originalPinned) newPin.add(column.id);
            else newPin.delete(column.id);
            return { ...prevDiffs, pinning: newPin };
        });

        if (manageColumnsConfig?.onColumnPin) {
            manageColumnsConfig?.onColumnPin();
        }
    };

    const isSearchActive = searchValue.trim().length > 0;

    const handleToggleAllColumnsVisibility = (checked: boolean) => {
        const columnsToToggle = isSearchActive ? columnsToRender : columns;
        const nextVisibility = { ...draftVisibility };
        const newVis = new Set(diffTracker.visibility);

        columnsToToggle.forEach((col) => {
            if (manageColumnsConfig?.disabledColumns?.includes(col.id)) return;

            const originalVal = columnVisibility[col.id] ?? true;
            nextVisibility[col.id] = checked;

            if (checked !== originalVal) {
                newVis.add(col.id);
            } else {
                newVis.delete(col.id);
            }
        });

        setDraftVisibility(nextVisibility);
        setDiffTracker((prevDiffs) => ({ ...prevDiffs, visibility: newVis }));

        if (manageColumnsConfig?.onSelectAllColumnsVisibility) {
            manageColumnsConfig?.onSelectAllColumnsVisibility();
        }
    };

    const handleColumnReorder = (sourceId: string, destinationId: string, edge: string | null) => {
        const currentOrder = completeOrder(draftColumnOrder, defaultColumnOrder);
        const sourceIndex = currentOrder.indexOf(sourceId);
        const destIndex = currentOrder.indexOf(destinationId);

        if (sourceIndex === -1 || destIndex === -1) return;

        const newOrder = [...currentOrder];
        newOrder.splice(sourceIndex, 1);

        let finalIndex = destIndex;
        if (sourceIndex < destIndex) {
            finalIndex = edge === "bottom" ? destIndex : destIndex - 1;
        } else {
            finalIndex = edge === "bottom" ? destIndex + 1 : destIndex;
        }

        newOrder.splice(finalIndex, 0, sourceId);

        setDraftColumnOrder(newOrder);
        setDiffTracker((prevDiffs) => ({
            ...prevDiffs,
            orderChanged: !arraysEqual(newOrder, activeOrder)
        }));

        if (manageColumnsConfig?.onColumnOrderChange) {
            manageColumnsConfig?.onColumnOrderChange();
        }
    };

    useEffect(() => {
        if (!popoverOpen) {
            setDraftVisibility(columnVisibility);
            setDraftPinning(columnPinning);
            setDraftColumnOrder(activeOrder);
            setColumnsToRender(sortColumns(columns, activeOrder));
            setSearchValue("");
            resetDiffTracker();
        }
    }, [columns, columnVisibility, columnPinning, activeOrder, popoverOpen]);

    useEffect(() => {
        if (popoverOpen) {
            setColumnsToRender((prev) => {
                return sortColumns(prev, completeOrder(draftColumnOrder, defaultColumnOrder));
            });
        }
    }, [draftColumnOrder, popoverOpen, defaultColumnOrder]);

    const columnsInScope = isSearchActive ? columnsToRender : columns;
    const visibleColumnsInScopeCount = columnsInScope.filter((col) => draftVisibility[col.id] ?? true).length;
    const allColumnsChecked = columnsInScope.length > 0 && visibleColumnsInScopeCount === columnsInScope.length;
    const allColumnsIndeterminate =
        visibleColumnsInScopeCount > 0 && visibleColumnsInScopeCount < columnsInScope.length;

    return {
        popoverOpen,
        propsForPopover,
        setPropsForPopover,
        columnsToRender,
        draftVisibility,
        draftPinning,
        allColumnsChecked,
        allColumnsIndeterminate,
        hasChanges,
        isDefaultState,
        searchValue,
        isSearchActive,
        openPopover,
        closePopover,
        handleCancel,
        handleSave,
        handleSearch,
        handleSearchClear,
        handleToggleAllColumnsVisibility,
        handleRestoreDefaults,
        handleToggleColumnVisibility,
        handleToggleColumnPinning,
        handleColumnReorder
    };
};
