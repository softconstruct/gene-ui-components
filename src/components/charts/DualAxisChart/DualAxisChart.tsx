import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./DualAxisChart.scss";

interface IDualAxisChartProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill DualAxisChart component props interface
}

/**
 * Dual axis chart built on Highcharts. Renders a column series and a smooth line series over shared categories, each on its own Y axis, to compare two measures with different scales; hovering a column or line point shows a tooltip for that point. Chart animations are disabled by default.
 */
const DualAxisChart: FC<IDualAxisChartProps> = ({ className }) => {
    return <div className={classNames("dualAxisChart", className)}>DualAxisChart</div>;
};

export { IDualAxisChartProps, DualAxisChart as default };
