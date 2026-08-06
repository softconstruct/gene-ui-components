import React, { FC } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

// Styles
import "./ChartLegend.scss";

interface IChartLegendItem {
    /**
     * Series / channel label.
     */
    name: string;
    /**
     * Swatch color. Accepts any valid CSS color (including `var(--guit-...)`).
     */
    color: string;
}

interface IChartLegendProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Legend entries to render.
     */
    items: IChartLegendItem[];
}

/**
 * Horizontal chart legend with color swatches. Item order and alignment follow the nearest `dir` context.
 */
const ChartLegend: FC<IChartLegendProps> = ({ className, items }) => {
    if (!items?.length) {
        return null;
    }

    return (
        <ul className={classNames("chartLegend", className)}>
            {items.map((item) => (
                <li key={`${item.name}-${item.color}`} className="chartLegend__item">
                    <span className="chartLegend__swatch" style={{ backgroundColor: item.color }} aria-hidden />
                    <Text as="span" variant="captionLargeMedium" className="chartLegend__label">
                        {item.name}
                    </Text>
                </li>
            ))}
        </ul>
    );
};

export { IChartLegendProps, IChartLegendItem, ChartLegend as default };
