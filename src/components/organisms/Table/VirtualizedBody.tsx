import React, { FC } from "react";
import { Row as RowData } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import TRowVirtualized from "@components/organisms/Table/TRowVirtualized";

import { Row } from "./types";

interface IVirtualizedBody {
    rows: RowData<Row>[];
    scrollElement: HTMLDivElement | null;
}

const VirtualizedBody: FC<IVirtualizedBody> = ({ rows, scrollElement }) => {
    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        estimateSize: () => 33,
        getScrollElement: () => scrollElement,
        measureElement:
            typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 5
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom = virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

    const columnCount = rows[0]?.getVisibleCells().length ?? 1;

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
