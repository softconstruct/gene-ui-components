import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./DonutChart.scss";

interface IDonutChartProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill DonutChart component props interface
}

const DonutChart: FC<IDonutChartProps> = ({ className }) => {
    return <div className={classNames("donutChart", className)}>DonutChart</div>;
};

export { IDonutChartProps, DonutChart as default };
