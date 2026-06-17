import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";
import { EXPANDABLE_CELL_SIZE_REM } from "@components/organisms/DataTable/constants";

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
const TableHeaderCell = <TData, TValue>({ header }: ITableHeaderCellProps<TData, TValue>) => {
    const isExpanderHeader = header.column.id === "expander";
    const isPinned = header.column.getIsPinned();

    return (
        <th
            className={classNames("tableHeaderCell", {
                tableHeaderCell_expander: isExpanderHeader,
                tableHeaderCell_pinned: isPinned
            })}
            style={{
                width: isExpanderHeader ? EXPANDABLE_CELL_SIZE_REM : undefined,
                minWidth: isExpanderHeader ? EXPANDABLE_CELL_SIZE_REM : undefined,
                maxWidth: 250 // temp
            }}
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
