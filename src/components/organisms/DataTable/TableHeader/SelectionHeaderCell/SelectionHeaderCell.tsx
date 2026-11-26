import React from "react";

// Components
import Checkbox from "@components/molecules/Checkbox";

import { useDataTableContext } from "../../context";
import { getPageCheckboxState } from "../../helper";

/**
 * Header checkbox of the selection column: selects or unselects the rows of the current page.
 */
const SelectionHeaderCell = <TData,>() => {
    const { table, bulkActionsConfig } = useDataTableContext<TData>();

    if (!bulkActionsConfig) return null;

    const pageRowIds = table.getRowModel().rows.map((row) => row.id);
    const pageCheckboxState = getPageCheckboxState(bulkActionsConfig.selectedRowIds, pageRowIds);

    return (
        <Checkbox
            checked={pageCheckboxState === "checked"}
            indeterminate={pageCheckboxState === "indeterminate"}
            disabled={bulkActionsConfig.isSelectionDisabled || pageRowIds.length === 0}
            onChange={bulkActionsConfig.onTogglePage}
        />
    );
};

export default SelectionHeaderCell;
