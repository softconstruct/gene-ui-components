import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Pagination.scss";

interface IPaginationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Pagination component props interface
}

const Pagination: FC<IPaginationProps> = ({ className }) => {
    return <div className={classNames("pagination", className)}>Pagination</div>;
};

export { IPaginationProps, Pagination as default };
