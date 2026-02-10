import React, { FC } from "react";
import { Column } from "@tanstack/react-table";

import { Row } from "./types";

interface IFilterProps {
    column: Column<Row, unknown>;
    onBlur: () => void;
    filterPlaceholder?: string;
}

const Filter: FC<IFilterProps> = ({ column, onBlur, filterPlaceholder }) => {
    return (
        <input
            type="text"
            value={(column.getFilterValue() ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            onBlur={onBlur}
            placeholder={filterPlaceholder}
        />
    );
};
export default Filter;
