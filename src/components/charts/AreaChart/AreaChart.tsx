import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./AreaChart.scss";

interface IAreaChartProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill AreaChart component props interface
}

/**
 * Multi-series area chart built on Highcharts. Smooth overlapping areas with a fading fill; hover shows a crosshair with every series' value at that category. Chart animations are disabled by default.
 */
const AreaChart: FC<IAreaChartProps> = ({ className }) => {
    return <div className={classNames("areaChart", className)}>AreaChart</div>;
};

export { IAreaChartProps, AreaChart as default };
