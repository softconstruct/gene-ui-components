import React from "react";
import { Column } from "@tanstack/react-table";

import { Row } from "@components/molecules/Table/type";

const Filter = ({ column, onBlur }: { column: Column<Row, unknown>; onBlur: () => void }) => {
    return (
        <input
            type="text"
            value={(column.getFilterValue() ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onBlur={onBlur}
            placeholder="Search..."
        />
    );
};
export default Filter;
