import React from "react";
import { Column } from "@tanstack/react-table";

import { Row } from "@components/molecules/Table/type";

const Filter = ({
    column,
    onBlur,
    headerText
}: {
    column: Column<Row, unknown>;
    onBlur: () => void;
    headerText?: string;
}) => {
    return (
        <input
            type="text"
            value={(column.getFilterValue() ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onBlur={onBlur}
            placeholder="Search..."
            aria-label={`Search ${headerText || "column"}`}
            aria-describedby={headerText ? `filter-${column.id}-description` : undefined}
        />
    );
};
export default Filter;
