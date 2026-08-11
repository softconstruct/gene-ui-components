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
    /**
     * Whether the related series is currently visible on the chart.
     * @default true
     */
    visible?: boolean;
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
    /**
     * Called when a legend item is clicked (typically to toggle series visibility).
     */
    onItemClick?: (item: IChartLegendItem, index: number) => void;
}

/**
 * Horizontal chart legend with color swatches. Item order and alignment follow the nearest `dir` context.
 * When `onItemClick` is provided, items act as toggles for series visibility.
 */
const ChartLegend: FC<IChartLegendProps> = ({ className, items, onItemClick }) => {
    if (!items?.length) {
        return null;
    }

    return (
        <ul className={classNames("chartLegend", className)}>
            {items.map((item, index) => {
                const { name, color, visible = true } = item;
                const isInteractive = Boolean(onItemClick);

                return (
                    <li key={`${name}-${color}`} className="chartLegend__item">
                        <button
                            type="button"
                            className={classNames("chartLegend__button", {
                                chartLegend__button_hidden: !visible,
                                chartLegend__button_interactive: isInteractive
                            })}
                            disabled={!isInteractive}
                            aria-pressed={visible}
                            onClick={() => onItemClick?.(item, index)}
                        >
                            <span className="chartLegend__swatch" style={{ backgroundColor: color }} aria-hidden />
                            <Text as="span" variant="captionLargeMedium" className="chartLegend__label">
                                {name}
                            </Text>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export { IChartLegendProps, IChartLegendItem, ChartLegend as default };
