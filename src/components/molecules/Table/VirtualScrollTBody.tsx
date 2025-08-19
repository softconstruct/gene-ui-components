import React, { FC, useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import TableRow from "@components/molecules/Table/TableRow";

import { Row as RowData } from ".";

interface IVirtualScrollTBody {
    topRows: Row<RowData>[];
    centerRows: Row<RowData>[];
    columnCount: number;
    tableContainerRef: HTMLDivElement;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
    withDynamicFetch?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    onRowClick?: (event: string) => void;
    onRowPin?: (rowId: string) => void;
    onRowTag?: (rowId: string) => void;
    onRowClock?: (rowId: string) => void;
    onRowReload?: (rowId: string) => void;
    onRowCopy?: (rowId: string) => void;
    onRowDownload?: (rowId: string) => void;
    onRowShow?: (rowId: string) => void;
    onRowDelete?: (rowId: string) => void;
    onCellEdit?: (rowIndex: number, columnType: string, value: any) => void;
}

const VirtualScrollTBody: FC<IVirtualScrollTBody> = ({
    topRows,
    centerRows,
    columnCount,
    tableContainerRef,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    expandable,
    withCheckbox,
    editableMode,
    onRowClick,
    onCellEdit,
    onRowPin,
    onRowTag,
    onRowClock,
    onRowReload,
    onRowCopy,
    onRowDownload,
    onRowShow,
    onRowDelete
}) => {
    const rowVirtualizer = useVirtualizer({
        count: centerRows.length,
        getScrollElement: () => tableContainerRef,
        estimateSize: () => 34,
        overscan: 20
    });

    useEffect(() => {
        if (!withDynamicFetch) return;
        if ((rowVirtualizer.range?.endIndex ?? 0) >= centerRows.length - 10 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage?.();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, centerRows.length]);

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
                    expandable={expandable}
                    withCheckbox={withCheckbox}
                    editableMode={editableMode}
                    onRowClick={onRowClick}
                    {...(onCellEdit && { handleCellEdit: onCellEdit })}
                    {...(onRowDelete && { onRowDelete })}
                    {...(onRowPin && { onRowPin })}
                    {...(onRowTag && { onRowTag })}
                    {...(onRowClock && { onRowClock })}
                    {...(onRowReload && { onRowReload })}
                    {...(onRowCopy && { onRowCopy })}
                    {...(onRowDownload && { onRowDownload })}
                    {...(onRowShow && { onRowShow })}
                />
            ))}
            {virtualItems.map((virtualRow) => {
                const row = centerRows[virtualRow.index];
                return (
                    <TableRow
                        key={row.id}
                        row={row}
                        rowIndex={virtualRow.index}
                        expandable={expandable}
                        withCheckbox={withCheckbox}
                        editableMode={editableMode}
                        onRowClick={onRowClick}
                        {...(onCellEdit && { handleCellEdit: onCellEdit })}
                        {...(onRowDelete && { onRowDelete })}
                        {...(onRowPin && { onRowPin })}
                        {...(onRowTag && { onRowTag })}
                        {...(onRowClock && { onRowClock })}
                        {...(onRowReload && { onRowReload })}
                        {...(onRowCopy && { onRowCopy })}
                        {...(onRowDownload && { onRowDownload })}
                        {...(onRowShow && { onRowShow })}
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
