import React, { FC } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

// Styles
import "./ChartTooltip.scss";

interface IChartTooltipItem {
    /**
     * Series / channel label.
     */
    name: string;
    /**
     * Formatted value text (e.g. `40%`).
     */
    value: string;
    /**
     * Swatch color. Accepts any valid CSS color (including `var(--guit-...)`).
     */
    color: string;
}

interface IChartTooltipProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tooltip rows to display.
     */
    items: IChartTooltipItem[];
    /**
     * Shows the caret pointing to the hovered point.
     */
    withCaret?: boolean;
    /**
     * Renders the bordered/shadowed surface around the rows.
     * Set to `false` when embedding inside Popover (Popover already provides chrome + arrow).
     * @default true
     */
    withSurface?: boolean;
}

/**
 * Chart hover tooltip surface (swatch + `name: value`). Shared visual contract for chart hover UI.
 */
const ChartTooltip: FC<IChartTooltipProps> = ({ className, items, withCaret = true, withSurface = true }) => {
    if (!items?.length) {
        return null;
    }

    return (
        <div
            className={classNames("chartTooltip", className, {
                chartTooltip_noSurface: !withSurface
            })}
        >
            <div className="chartTooltip__content">
                {items.map((item) => (
                    <div key={`${item.name}-${item.value}`} className="chartTooltip__row">
                        <span className="chartTooltip__swatch" style={{ backgroundColor: item.color }} aria-hidden />
                        <Text as="span" variant="captionLargeMedium" className="chartTooltip__text">
                            {`${item.name}: ${item.value}`}
                        </Text>
                    </div>
                ))}
            </div>
            {withCaret && <span className="chartTooltip__caret" aria-hidden />}
        </div>
    );
};

export { IChartTooltipProps, IChartTooltipItem, ChartTooltip as default };
