import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Rate.scss";

interface IRateProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Rate component props interface
}

const Rate: FC<IRateProps> = ({ className }) => {
    return <div className={classNames("rate", className)}>Rate</div>;
};

export { IRateProps, Rate as default };
