import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./HeatMap.scss";

interface IHeatMapProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill HeatMap component props interface
}

const HeatMap: FC<IHeatMapProps> = ({ className }) => {
    return <div className={classNames("heatMap", className)}>HeatMap</div>;
};

export { IHeatMapProps, HeatMap as default };
