import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import Scrollbars from "react-scrollbars-custom";

import Loader from "@components/atoms/Loader";
import TableRow from "@components/molecules/Table/TableRow";

import { Row as RowData, TableCol } from ".";

const DATA_OFFSET = 20;

interface IVirtualScrollTBody {
    topRows: Row<RowData>[];
    centerRows: Row<RowData>[];
    columnCount: number;
    scrollbarContainerRef: Scrollbars | null;
    columnsMap: Map<string, TableCol<RowData>>;
    withExpandable?: boolean;
    withCheckbox?: boolean;
    withEditMode: boolean;
    hasRowActions?: boolean;
    withDynamicFetch?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
}

const VirtualScrollTBody: FC<IVirtualScrollTBody> = ({
    topRows,
    centerRows,
    columnCount,
    scrollbarContainerRef,
    columnsMap,
    hasRowActions = false,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    withExpandable,
    withCheckbox,
    withEditMode
}) => {
    const parentRef = useRef<HTMLElement | null>(null);
    const lastFetchIndexRef = useRef<number | null>(null);
    const [pendingRowsLength, setPendingRowsLength] = useState<number | null>(null);

    useEffect(() => {
        if (scrollbarContainerRef?.contentElement?.parentElement) {
            parentRef.current = scrollbarContainerRef.contentElement.parentElement;
        }
    }, [scrollbarContainerRef]);

    const getScrollElement = useCallback(() => {
        return parentRef.current ?? scrollbarContainerRef?.contentElement?.parentElement ?? null;
    }, [scrollbarContainerRef]);

    const estimateSize = useCallback(
        (index: number) => {
            const row = centerRows[index];
            if (!row) return 34;
            if (withExpandable && row.getIsExpanded()) {
                return 68;
            }
            return 34;
        },
        [centerRows, withExpandable]
    );

    const rowVirtualizer = useVirtualizer({
        count: centerRows.length,
        getScrollElement,
        estimateSize,
        overscan: 20
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    useEffect(() => {
        lastFetchIndexRef.current = null;
        setPendingRowsLength(null);
    }, [centerRows.length]);

    useEffect(() => {
        if (!withDynamicFetch || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const lastVirtualItem = virtualItems.length ? virtualItems[virtualItems.length - 1] : undefined;
        if (!lastVirtualItem) return;

        const threshold = Math.max(0, centerRows.length - DATA_OFFSET);
        if (lastVirtualItem.index >= threshold && lastFetchIndexRef.current !== lastVirtualItem.index) {
            lastFetchIndexRef.current = lastVirtualItem.index;
            setPendingRowsLength(centerRows.length);
            fetchNextPage?.();
        }
    }, [virtualItems, withDynamicFetch, hasNextPage, isFetchingNextPage, fetchNextPage, centerRows.length]);

    useEffect(() => {
        if (pendingRowsLength !== null && centerRows.length > pendingRowsLength) {
            setPendingRowsLength(null);
        }
    }, [centerRows.length, pendingRowsLength]);

    useEffect(() => {
        if (!hasNextPage) {
            setPendingRowsLength(null);
        }
    }, [hasNextPage]);

    useEffect(() => {
        if (!isFetchingNextPage) {
            lastFetchIndexRef.current = null;
        }
    }, [isFetchingNextPage]);

    const expandedState = useMemo(() => centerRows.map((row) => row.getIsExpanded()).join(","), [centerRows]);

    useEffect(() => {
        if (withExpandable) {
            rowVirtualizer.measure();
        }
    }, [withExpandable, expandedState, rowVirtualizer]);

    return (
        <>
            {virtualItems.length > 0 && (
                <tr style={{ height: virtualItems[0]?.start || 0 }}>
                    <td colSpan={columnCount} aria-hidden="true" />
                </tr>
            )}
            {topRows.map((row) => (
                <TableRow
                    key={row.id}
                    row={row}
                    rowIndex={row.index}
                    columnsMap={columnsMap}
                    withExpandable={withExpandable}
                    withCheckbox={withCheckbox}
                    withEditMode={withEditMode}
                    hasRowActions={hasRowActions}
                />
            ))}
            {virtualItems.map((virtualRow) => {
                const row = centerRows[virtualRow.index];
                if (!row) return null;
                return (
                    <TableRow
                        key={row.id}
                        row={row}
                        rowIndex={virtualRow.index}
                        columnsMap={columnsMap}
                        withExpandable={withExpandable}
                        withCheckbox={withCheckbox}
                        withEditMode={withEditMode}
                        hasRowActions={hasRowActions}
                    />
                );
            })}
            {withDynamicFetch && (isFetchingNextPage || pendingRowsLength !== null) && (
                <tr className="table__row table__row_tbody table__row_default">
                    <td colSpan={columnCount}>
                        <Loader size="small" />
                    </td>
                </tr>
            )}
            {virtualItems.length > 0 && (
                <tr
                    style={{
                        height: rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0)
                    }}
                >
                    <td colSpan={columnCount} aria-hidden="true" />
                </tr>
            )}
        </>
    );
};

export { VirtualScrollTBody as default };
