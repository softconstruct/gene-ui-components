import React, { FC, useEffect, useState } from "react";
import { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import Scrollbars from "react-scrollbars-custom";

import TableRow from "@components/molecules/Table/TableRow";

import { Row as RowData } from ".";

interface IVirtualScrollTBody {
    topRows: Row<RowData>[];
    centerRows: Row<RowData>[];
    columnCount: number;
    scrollbarContainerRef: Scrollbars | null;
    withExpandable?: boolean;
    withCheckbox?: boolean;
    withEditMode: boolean;
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
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    withExpandable,
    withCheckbox,
    withEditMode
}) => {
    const [needToFetchData, setNeedToFetchData] = useState(false);

    const rowVirtualizer = useVirtualizer({
        count: centerRows.length,
        getScrollElement: () =>
            scrollbarContainerRef?.contentElement ? scrollbarContainerRef.contentElement?.parentElement : null,

        onChange: () => {
            if ((rowVirtualizer.range?.endIndex ?? 0) >= centerRows.length - 10 && hasNextPage && !isFetchingNextPage) {
                setNeedToFetchData(true);
            } else {
                setNeedToFetchData(false);
            }
        },
        estimateSize: () => 34,
        overscan: 20
    });

    useEffect(() => {
        if (!withDynamicFetch) return;
        if (needToFetchData) {
            fetchNextPage?.();
        }
    }, [needToFetchData]);

    const virtualItems = rowVirtualizer.getVirtualItems();

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
                    withExpandable={withExpandable}
                    withCheckbox={withCheckbox}
                    withEditMode={withEditMode}
                />
            ))}
            {virtualItems.map((virtualRow) => {
                const row = centerRows[virtualRow.index];
                return (
                    <TableRow
                        key={row.id}
                        row={row}
                        rowIndex={virtualRow.index}
                        withExpandable={withExpandable}
                        withCheckbox={withCheckbox}
                        withEditMode={withEditMode}
                    />
                );
            })}
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
