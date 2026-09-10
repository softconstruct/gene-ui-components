import React, { useEffect, useRef } from "react";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

// Styles
import "./TableHeaderCell.scss";

import { CUSTOM_CELL_MAX_SIZE, EXPANDER_COLUMN_ID } from "../../constants";
import { useDataTableContext } from "../../context";
import { getCellStyle } from "../../helper";

/**
 * Props for the {@link TableHeaderCell} component.
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this column.
 */
interface ITableHeaderCellProps<TData, TValue> {
    /**
     * The TanStack Table header instance.
     * Contains the column definition, context data, and structural information
     * (like whether this specific cell is a placeholder in a grouped header setup).
     */
    header: Header<TData, TValue>;
    offset: number;
}

/**
 * Renders an individual table header cell (`<th>`).
 * * This component checks if the header is a structural placeholder (used in complex,
 * multi-row header groups). If it is a placeholder, it renders empty content.
 * Otherwise, it uses TanStack Table's `flexRender` utility to display the defined header UI.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this column.
 * @param props - The properties for the component.
 * @returns A table header cell element containing the rendered column header, or an empty cell if it's a placeholder.
 */
const TableHeaderCell = <TData, TValue>({ header, offset }: ITableHeaderCellProps<TData, TValue>) => {
    const { dirMode } = useDataTableContext();
    const isExpanderHeader = header.column.id === EXPANDER_COLUMN_ID;
    const isPinned = header.column.getIsPinned();
    const isRTL = dirMode === "rtl";

    const explicitSize = header.column.columnDef.meta?.explicitSize;
    const isCustomCell = Boolean(header.column.columnDef.meta?.isCustomCell);

    const { table } = header.getContext();
    const thRef = useRef<HTMLTableCellElement>(null);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (thRef.current && explicitSize === undefined) {
            const observer = new ResizeObserver((entries) => {
                const entry = entries[0];
                const rect = entry.target.getBoundingClientRect();
                const newWidth = Math.round(rect.width);

                table.setColumnSizing((old) => {
                    const currentSize = old[header.column.id] ?? header.column.columnDef.size ?? CUSTOM_CELL_MAX_SIZE;
                    if (Math.abs(currentSize - newWidth) > 1) {
                        return {
                            ...old,
                            [header.column.id]: newWidth
                        };
                    }
                    return old;
                });
            });

            observer.observe(thRef.current);
            return () => observer.disconnect();
        }
    }, [explicitSize, header.column.id, table]);

    return (
        <th
            ref={thRef}
            className={classNames("tableHeaderCell", {
                tableHeaderCell_expander: isExpanderHeader,
                tableHeaderCell_pinned: isPinned
            })}
            style={getCellStyle(
                isExpanderHeader,
                header.column.columnDef.size ?? CUSTOM_CELL_MAX_SIZE,
                explicitSize,
                offset,
                isPinned,
                isRTL,
                isCustomCell
            )}
        >
            {!isExpanderHeader ? (
                <div className="tableHeaderCell__content">
                    <Text className="tableHeaderCell__text" as="span" variant="labelMediumSemibold">
                        {flexRender(header.column.columnDef.header, header.getContext()) as string}
                    </Text>
                </div>
            ) : null}
        </th>
    );
};

export default TableHeaderCell;
