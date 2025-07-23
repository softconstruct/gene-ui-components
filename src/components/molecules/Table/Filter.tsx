import React, { ReactNode } from "react";
import { Column } from "@tanstack/react-table";

const Filter = ({
    column,
    onBlur
}: {
    column: Column<Record<string, string | ReactNode | Record<string, string>>, unknown>;
    onBlur: () => void;
}) => {
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
