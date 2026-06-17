import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Column, ColumnOrderState, ColumnPinningState, Table } from "@tanstack/react-table";

// Types
import { ColumnVisibilityState, ManageColumnsConfig } from "../../types";

const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
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
    initialColumnVisibility
}: IUseManageColumnsParams<TData>) => {
    const columns = table.getAllLeafColumns();
    const { columnVisibility } = table.getState();
    const { columnPinning } = table.getState();
    const { columnOrder } = table.getState();

    const defaultColumnVisibility = initialColumnVisibility;
    const defaultColumnPinning: ColumnPinningState = { left: [], right: [] };
    const defaultColumnOrder = useMemo(() => columns.map((c) => c.id), [columns]);

    const isControlled = manageColumnsConfig && manageColumnsConfig.open !== undefined;

    const [internalOpen, setInternalOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState<Record<string, unknown>>({});

    const [searchValue, setSearchValue] = useState("");

    const popoverOpen = manageColumnsConfig?.open ?? internalOpen;

    const [initialOrderRef] = useState<string[]>(() => {
        return defaultColumnOrder.length > 0 ? defaultColumnOrder : columns.map((c) => c.id);
    });

    const initialOrder = columnOrder.length ? columnOrder : initialOrderRef;

    const [columnsToRender, setColumnsToRender] = useState<Column<TData>[]>(sortColumns(columns, initialOrder));

    const [draftVisibility, setDraftVisibility] = useState<ColumnVisibilityState>(columnVisibility);
    const [draftPinning, setDraftPinning] = useState<ColumnPinningState>(columnPinning);
    const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnOrderState>(initialOrder);

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
            (col) => (draftVisibility[col.id] ?? true) === (defaultColumnVisibility[col.id] ?? true)
        );
        const pinEqual =
            arraysEqual(draftPinning.left || [], defaultColumnPinning.left || []) &&
            arraysEqual(draftPinning.right || [], defaultColumnPinning.right || []);
        const orderEqual = arraysEqual(draftColumnOrder, initialOrderRef);
        return visEqual && pinEqual && orderEqual;
    }, [
        draftVisibility,
        defaultColumnVisibility,
        draftPinning,
        defaultColumnPinning,
        draftColumnOrder,
        initialOrderRef,
        columns
    ]);

    const setPopoverOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
    };

    const openPopover = () => {
        const currentOrder = columnOrder.length ? columnOrder : initialOrderRef;
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        setDraftColumnOrder(currentOrder);
        setColumnsToRender(sortColumns(columns, currentOrder));
        setSearchValue("");
        resetDiffTracker();
        setPopoverOpen(!popoverOpen);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setDraftVisibility(columnVisibility);
        setDraftPinning(columnPinning);
        const order = columnOrder.length ? columnOrder : initialOrderRef;
        setDraftColumnOrder(order);
        setColumnsToRender(sortColumns(columns, order));
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

        const pinnedIds = draftColumnOrder.filter((id) => allPinnedIds.includes(id));
        const unpinnedIds = draftColumnOrder.filter((id) => !allPinnedIds.includes(id));
        const finalOrder = [...pinnedIds, ...unpinnedIds];

        const newLeftPinned = finalOrder.filter((id) => leftPinned.includes(id));
        const newRightPinned = finalOrder.filter((id) => rightPinned.includes(id));
        const finalPinning = { ...draftPinning, left: newLeftPinned, right: newRightPinned };

        const pinningChanged = !arraysEqual(leftPinned, newLeftPinned) || !arraysEqual(rightPinned, newRightPinned);

        const diffPayload: IManageColumnsDiffPayload = {
            visibilityChanges,
            pinningChanges: diffTracker.pinning.size > 0 || pinningChanged ? finalPinning : null,
            orderChanges: diffTracker.orderChanged || !arraysEqual(finalOrder, columnOrder) ? finalOrder : null
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
        setDraftVisibility(defaultColumnVisibility);
        setDraftPinning(defaultColumnPinning);
        setDraftColumnOrder(initialOrderRef);
        setColumnsToRender(sortColumns(columns, initialOrderRef));
        setSearchValue("");

        setDiffTracker(() => {
            const newVis = new Set<string>();
            const newPin = new Set<string>();
            columns.forEach((col) => {
                if ((defaultColumnVisibility[col.id] ?? true) !== (columnVisibility[col.id] ?? true))
                    newVis.add(col.id);

                const originalPinned = (columnPinning.left || []).includes(col.id);
                const defaultPinned = (defaultColumnPinning.left || []).includes(col.id);
                if (originalPinned !== defaultPinned) newPin.add(col.id);
            });
            const activeOrder = columnOrder.length ? columnOrder : initialOrderRef;
            return { visibility: newVis, pinning: newPin, orderChanged: !arraysEqual(initialOrderRef, activeOrder) };
        });

        if (manageColumnsConfig?.onRestoreDefaults) {
            manageColumnsConfig.onRestoreDefaults();
        }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        setSearchValue(val);

        if (manageColumnsConfig?.onSearch) {
            manageColumnsConfig.onSearch(val);
        }

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

    const handleSearchClear = () => {
        setSearchValue("");
        setColumnsToRender(sortColumns(columns, draftColumnOrder));
    };

    const handleToggleColumnVisibility = (column: Column<TData>) => {
        if (manageColumnsConfig?.disabledColumns?.includes(column.id)) return;

        setDraftVisibility((prev) => {
            const nextVal = !(prev[column.id] ?? true);
            const originalVal = columnVisibility[column.id] ?? true;

            setDiffTracker((prevDiffs) => {
                const newVis = new Set(prevDiffs.visibility);
                if (nextVal !== originalVal) newVis.add(column.id);
                else newVis.delete(column.id);
                return { ...prevDiffs, visibility: newVis };
            });

            return { ...prev, [column.id]: nextVal };
        });
        if (manageColumnsConfig?.onColumnVisibilityChange) {
            manageColumnsConfig?.onColumnVisibilityChange();
        }
    };

    const handleToggleColumnPinning = (column: Column<TData>) => {
        setDraftPinning((prev) => {
            const leftPinned = prev.left || [];
            const isPinnedNext = !leftPinned.includes(column.id);
            const originalPinned = (columnPinning.left || []).includes(column.id);

            setDiffTracker((prevDiffs) => {
                const newPin = new Set(prevDiffs.pinning);
                if (isPinnedNext !== originalPinned) newPin.add(column.id);
                else newPin.delete(column.id);
                return { ...prevDiffs, pinning: newPin };
            });

            return {
                ...prev,
                left: isPinnedNext ? [...leftPinned, column.id] : leftPinned.filter((id) => id !== column.id)
            };
        });
        if (manageColumnsConfig?.onColumnPin) {
            manageColumnsConfig?.onColumnPin();
        }
    };

    const isSearchActive = searchValue.trim().length > 0;

    const handleToggleAllColumnsVisibility = (checked: boolean) => {
        setDraftVisibility((prev) => {
            const nextVisibility = { ...prev };

            setDiffTracker((prevDiffs) => {
                const newVis = new Set(prevDiffs.visibility);
                const columnsToToggle = isSearchActive ? columnsToRender : columns;

                let targetChecked = checked;
                if (isSearchActive) {
                    const allVisibleChecked = columnsToToggle.every((col) => nextVisibility[col.id] ?? true);
                    targetChecked = !allVisibleChecked;
                }

                columnsToToggle.forEach((col) => {
                    if (manageColumnsConfig?.disabledColumns?.includes(col.id)) return;

                    const originalVal = columnVisibility[col.id] ?? true;
                    nextVisibility[col.id] = targetChecked;

                    if (targetChecked !== originalVal) newVis.add(col.id);
                    else newVis.delete(col.id);
                });
                return { ...prevDiffs, visibility: newVis };
            });

            return nextVisibility;
        });
        if (manageColumnsConfig?.onSelectAllColumnsVisibility) {
            manageColumnsConfig?.onSelectAllColumnsVisibility();
        }
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

            const activeOrder = columnOrder.length ? columnOrder : initialOrderRef;
            setDiffTracker((prevDiffs) => ({
                ...prevDiffs,
                orderChanged: !arraysEqual(newOrder, activeOrder)
            }));

            if (manageColumnsConfig?.onColumnOrderChange) {
                manageColumnsConfig?.onColumnOrderChange();
            }
            return newOrder;
        });
    };

    useEffect(() => {
        if (!popoverOpen) {
            setDraftVisibility(columnVisibility);
            setDraftPinning(columnPinning);
            const order = columnOrder.length ? columnOrder : initialOrderRef;
            setDraftColumnOrder(order);
            setColumnsToRender(sortColumns(columns, order));
            setSearchValue("");
            resetDiffTracker();
        }
    }, [columns, columnVisibility, columnPinning, columnOrder, initialOrderRef, popoverOpen]);

    useEffect(() => {
        if (popoverOpen) {
            setColumnsToRender((prev) => {
                const orderToUse =
                    !draftColumnOrder || draftColumnOrder.length === 0 ? initialOrderRef : draftColumnOrder;
                return sortColumns(prev, orderToUse);
            });
        }
    }, [draftColumnOrder, popoverOpen, initialOrderRef]);

    const globalVisibleColumnsCount = columns.filter((col) => draftVisibility[col.id] ?? true).length;
    const allColumnsChecked = columns.length > 0 && globalVisibleColumnsCount === columns.length;
    const allColumnsIndeterminate = globalVisibleColumnsCount > 0 && globalVisibleColumnsCount < columns.length;

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
