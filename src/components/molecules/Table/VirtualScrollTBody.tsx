import React, { ChangeEvent, FC } from "react";
import { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import TableRow from "@components/molecules/Table/TableRow";

import { RowActions, RowData } from ".";

interface IVirtualScrollTBody {
    rows: Row<RowData>[];
    columnCount: number;
    tableContainerRef: HTMLDivElement;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode: boolean;
    rowActions: Partial<RowActions>;
    onRowClick?: (event: string) => void;
    onCellEdit: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        rowIndex: number,
        columnId: string
    ) => void;
}

const VirtualScrollTBody: FC<IVirtualScrollTBody> = ({
    rows,
    columnCount,
    tableContainerRef,
    expandable,
    withCheckbox,
    editableMode,
    rowActions,
    onRowClick,
    onCellEdit
}) => {
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 70,
        getScrollElement: () => tableContainerRef,
        overscan: 3
    });
    const virtualItems = rowVirtualizer.getVirtualItems();
    return (
        <>
            {virtualItems.length > 0 && (
                <tr style={{ height: virtualItems[0]?.start || 0 }}>
                    <td colSpan={columnCount} aria-hidden="true" />
                </tr>
            )}
            {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                    <TableRow
                        key={row.id}
                        row={row}
                        rowIndex={virtualRow.index}
                        expandable={expandable}
                        withCheckbox={withCheckbox}
                        editableMode={editableMode}
                        rowActions={rowActions}
                        onRowClick={onRowClick}
                        handleCellEdit={onCellEdit}
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
