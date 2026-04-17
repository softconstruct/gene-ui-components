import React from "react";
import { CellContext } from "@tanstack/react-table";

import { ChevronDown, ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";

/**
 * Renders an individual table body cell (`<td>`).
 * This component acts as a wrapper that uses TanStack Table's `flexRender`
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
    const isExpanded = row.getIsExpanded();

    const toggleHandler = () => {
        row.toggleExpanded(!isExpanded);
    };
    return (
        <Button
            layout="text"
            appearance="secondary"
            size="small"
            Icon={isExpanded ? ChevronDown : ExpanderChevronIcon}
            onClick={toggleHandler}
        />
    );
};

export default ExpanderCell;
