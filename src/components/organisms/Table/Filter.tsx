import React, { FC } from "react";

interface IFilterProps {
    onBlur: () => void;
    filterValue?: string;
    filterPlaceholder?: string;
    handleColumnFilter: (event: string) => void;
}

const Filter: FC<IFilterProps> = ({ filterValue, handleColumnFilter, onBlur, filterPlaceholder }) => {
    return (
        <input
            type="text"
            value={filterValue}
            onBlur={onBlur}
            placeholder={filterPlaceholder}
            onChange={(e) => handleColumnFilter(e.target.value)}
        />
    );
};
export default Filter;
