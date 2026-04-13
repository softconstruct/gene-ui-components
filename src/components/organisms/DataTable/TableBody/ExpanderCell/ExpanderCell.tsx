import React from "react";
import { CellContext } from "@tanstack/react-table";

import { ChevronDown, ChevronRight } from "@geneui/icons";

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
    const toggleHandler = () => {
        row.toggleExpanded(!row.getIsExpanded());
    };
    return (
        <button type="button" onClick={toggleHandler}>
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </button>
    );
};

export default ExpanderCell;
