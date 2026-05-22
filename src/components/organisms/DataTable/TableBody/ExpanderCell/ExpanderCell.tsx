import React from "react";
import { CellContext } from "@tanstack/react-table";

import { ChevronDown, ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { DataTableRowExpandChangeHandler } from "@components/organisms/DataTable/types";

interface IExpanderCellProps<TData, TValue> extends CellContext<TData, TValue> {
    onRowExpandChange?: DataTableRowExpandChangeHandler<TData>;
}

/**
 * Renders the expander toggle button injected as a leading column of an expandable {@link DataTable}.
 * Surfaces accessibility metadata (`aria-expanded`, `aria-label`) and adapts the chevron direction in RTL.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 * @param props - The properties for the component.
 * @returns A button that toggles the expanded state of the parent row.
 */
const ExpanderCell = <TData, TValue>({ row, onRowExpandChange }: IExpanderCellProps<TData, TValue>) => {
    const isExpanded = row.getIsExpanded();
    const isRTLMode = typeof document !== "undefined" && document.dir === "rtl";
    const CollapsedChevronIcon = isRTLMode ? ChevronLeft : ChevronRight;

    const toggleHandler = () => {
        const nextExpanded = !row.getIsExpanded();
        row.toggleExpanded(nextExpanded);
        onRowExpandChange?.({ isExpanded: nextExpanded, row: row.original, rowId: row.id });
    };

    return (
        <Button
            layout="text"
            appearance="secondary"
            size="small"
            Icon={isExpanded ? ChevronDown : CollapsedChevronIcon}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse row" : "Expand row"}
            onClick={toggleHandler}
        />
    );
};

export default ExpanderCell;
