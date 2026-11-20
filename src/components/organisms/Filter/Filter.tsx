import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Filter.scss";

interface IFilterProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Filter component props interface
}

const Filter: FC<IFilterProps> = ({ className }) => {
    return <div className={classNames("filter", className)}>Filter</div>;
};

export { IFilterProps, Filter as default };
