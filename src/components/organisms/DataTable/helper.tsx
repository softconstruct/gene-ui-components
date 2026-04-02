import React, { useRef } from "react";
import { CellContext } from "@tanstack/react-table";

import { ChevronDown, ChevronRight } from "@geneui/icons";

import Text from "@components/atoms/Text";
// Components
import Tooltip from "@components/molecules/Tooltip";

// hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

export const DefaultCellComponent = ({ value }: { value: string }) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef);
    return (
        <Tooltip text={value} isVisible={isTruncated}>
            <Text ref={textRef} className="tableBodyCell__text" as="span" variant="labelMediumMedium">
                {value}
            </Text>
        </Tooltip>
    );
};

export const ExpanderCell = <TData,>({ row }: CellContext<TData, unknown>) => {
    const toggleHandler = () => {
        row.toggleExpanded(!row.getIsExpanded());
    };
    return (
        <button type="button" onClick={toggleHandler}>
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </button>
    );
};
