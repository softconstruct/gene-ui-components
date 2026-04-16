import React from "react";
import { CellContext } from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronLeft, ChevronRight } from "@geneui/icons";

// Styles
import "./ExpanderCell.scss";

/**
 * Renders an individual table body cell (`<td>`).
 * * This component acts as a wrapper that uses TanStack Table's `flexRender`
 * utility to evaluate and render the appropriate content based on the
 * specific column definitions.
 *
 * @template TData - The shape of the overall row data object.
 * @template TValue - The type of the specific value held within this cell.
 * @param props - The properties for the component.
 * @returns A table cell element with the rendered content.
 */
const ExpanderCell = <TData, TValue>({ row }: CellContext<TData, TValue>) => {
    const isRTLMode = document.dir === "rtl";
    const ExpanderChevronIcon = isRTLMode ? ChevronLeft : ChevronRight;

    const isPinned = row.getIsPinned();
    const isExpanded = row.getIsExpanded();
    const isSelected = row.getIsSelected?.() ?? false;

    const toggleHandler = () => {
        row.toggleExpanded(!isExpanded);
    };
    return (
        <button
            type="button"
            onClick={toggleHandler}
            className={classNames("tableExpander", {
                tableExpander_pinned: isPinned,
                tableExpander_color_highlighted: isExpanded,
                tableExpander_selected: isSelected
            })}
        >
            {isExpanded ? <ChevronDown /> : <ExpanderChevronIcon />}
        </button>
    );
};

export default ExpanderCell;
