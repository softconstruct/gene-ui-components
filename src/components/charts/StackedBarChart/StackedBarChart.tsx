import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./StackedBarChart.scss";

interface IStackedBarChartProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * Vertical multi-series stacked bar (column) chart built on Highcharts.
 * Series stack within each category; hover shows the category's per-series values.
 * Chart animations are disabled by default.
 */
const StackedBarChart: FC<IStackedBarChartProps> = ({ className }) => {
    return <div className={classNames("stackedBarChart", className)}>StackedBarChart</div>;
};

export { IStackedBarChartProps, StackedBarChart as default };
