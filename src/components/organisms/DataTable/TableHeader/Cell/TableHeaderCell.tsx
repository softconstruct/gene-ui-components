import React, { useEffect, useRef } from "react";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { EXPANDER_COLUMN_ID } from "../../constants";
import { useDataTableContext } from "../../context";
import { getCellContentStyle, getCellStyle } from "../../helper";

// Styles
import "./TableHeaderCell.scss";

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
 * Otherwise, it uses TanStack Table's `flexRender` utility to display the defined header UI
 * on a single line, truncated with a tooltip when it exceeds the maximum cell width.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this column.
 * @param props - The properties for the component.
 * @returns A table header cell element containing the rendered column header, or an empty cell if it's a placeholder.
 */
const TableHeaderCell = <TData, TValue>({ header, offset }: ITableHeaderCellProps<TData, TValue>) => {
    const { dirMode } = useDataTableContext();
    const { column } = header;
    const isExpanderHeader = column.id === EXPANDER_COLUMN_ID;
    const isPinned = column.getIsPinned();
    const isRTL = dirMode === "rtl";
    const explicitSize = column.columnDef.meta?.explicitSize;
    const label = flexRender(column.columnDef.header, header.getContext()) as string;

    const { table } = header.getContext();
    const thRef = useRef<HTMLTableCellElement>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);

    const isTruncated = useEllipsisDetection(labelRef, [column.getSize()]);

    useEffect(() => {
        const th = thRef.current;
        if (!th || explicitSize !== undefined) return () => undefined;

        const observer = new ResizeObserver(([entry]) => {
            const newWidth = Math.round(entry.target.getBoundingClientRect().width);
            const currentSize = table.getState().columnSizing[column.id] ?? column.columnDef.size ?? 0;

            if (Math.abs(currentSize - newWidth) > 1) {
                table.setColumnSizing((old) => ({ ...old, [column.id]: newWidth }));
            }
        });

        observer.observe(th);
        return () => observer.disconnect();
    }, [column.id, explicitSize, table]);

    return (
        <th
            ref={thRef}
            className={classNames("tableHeaderCell", {
                tableHeaderCell_expander: isExpanderHeader,
                tableHeaderCell_pinned: isPinned
            })}
            style={getCellStyle(explicitSize, offset, isPinned, isRTL)}
        >
            {!isExpanderHeader ? (
                <div className="tableHeaderCell__content" style={getCellContentStyle(explicitSize)}>
                    <Tooltip text={label} isVisible={isTruncated}>
                        <Text ref={labelRef} className="tableHeaderCell__text" as="span" variant="labelMediumSemibold">
                            {label}
                        </Text>
                    </Tooltip>
                </div>
            ) : null}
        </th>
    );
};

export default TableHeaderCell;
