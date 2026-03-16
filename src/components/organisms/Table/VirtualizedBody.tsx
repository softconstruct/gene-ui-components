import React, { FC, useEffect } from "react";
import { Row as RowData } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import TRowVirtualized from "@components/organisms/Table/TRowVirtualized";

import { Row } from "./types";

interface IVirtualizedBody {
    rows: RowData<Row>[];
    scrollElement: HTMLDivElement | null;
    onLoadMore?: () => void;
    hasMore?: boolean;
    estimateSize?: number;
    overscan: number;
}

const VirtualizedBody: FC<IVirtualizedBody> = ({
    rows,
    scrollElement,
    onLoadMore,
    hasMore,
    estimateSize = 33,
    overscan
}) => {
    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        estimateSize: () => estimateSize,
        getScrollElement: () => scrollElement,
        measureElement:
            typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom = virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

    const columnCount = rows[0]?.getVisibleCells().length ?? 1;

    useEffect(() => {
        if (!onLoadMore || !hasMore || virtualItems.length === 0) return;
        const lastItem = virtualItems[virtualItems.length - 1];
        const lastIndex = lastItem.index;
        const threshold = rows.length - overscan;
        if (lastIndex >= threshold) {
            onLoadMore();
        }
    }, [virtualItems, rows.length, onLoadMore, hasMore]);

    if (!scrollElement) {
        return <tbody />;
    }

    return (
        <tbody>
            {paddingTop > 0 && (
                <tr style={{ height: paddingTop }} aria-hidden="true">
                    <td colSpan={columnCount} aria-hidden="true" />
                </tr>
            )}
            {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                    <TRowVirtualized key={row.id} row={row} virtualRow={virtualRow} rowVirtualizer={rowVirtualizer} />
                );
            })}
            {paddingBottom > 0 && (
                <tr style={{ height: paddingBottom }} aria-hidden="true">
                    <td colSpan={columnCount} aria-hidden="true" />
                </tr>
            )}
        </tbody>
    );
};

export { VirtualizedBody as default };
