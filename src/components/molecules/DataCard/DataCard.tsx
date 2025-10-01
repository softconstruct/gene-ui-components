import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./DataCard.scss";

interface IDataCardProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill DataCard component props interface
}

/**
 * Data Card Component is a responsive alternative to a data table, designed specifically for smaller screens or mobile devices.
 */
const DataCard: FC<IDataCardProps> = ({ className }) => {
    return <div className={classNames("dataCard", className)}>DataCard</div>;
};

export { IDataCardProps, DataCard as default };
