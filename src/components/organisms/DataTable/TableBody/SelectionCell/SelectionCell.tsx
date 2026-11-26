import React from "react";
import { CellContext } from "@tanstack/react-table";

// Components
import Checkbox from "@components/molecules/Checkbox";

import { useDataTableContext } from "../../context";

/**
 * Row checkbox of the selection column of a {@link DataTable} with `bulkActionsConfig`.
 */
const SelectionCell = <TData, TValue>({ row }: CellContext<TData, TValue>) => {
    const { bulkActionsConfig } = useDataTableContext<TData>();

    if (!bulkActionsConfig) return null;

    return (
        <Checkbox
            checked={row.getIsSelected()}
            disabled={bulkActionsConfig.isSelectionDisabled}
            onChange={() => bulkActionsConfig.onToggleRow(row.id)}
        />
    );
};

export default SelectionCell;
