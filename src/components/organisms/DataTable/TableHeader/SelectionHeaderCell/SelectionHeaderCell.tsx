import React from "react";

// Components
import Checkbox from "@components/molecules/Checkbox";

import { useDataTableContext } from "../../context";

/**
 * Header checkbox of the selection column: selects or unselects the rows of the current page.
 */
const SelectionHeaderCell = <TData,>() => {
    const { table, bulkActionsConfig } = useDataTableContext<TData>();

    if (!bulkActionsConfig) return null;

    return (
        <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            disabled={bulkActionsConfig.isSelectionDisabled || table.getRowModel().rows.length === 0}
            onChange={() => table.toggleAllPageRowsSelected()}
        />
    );
};

export default SelectionHeaderCell;
