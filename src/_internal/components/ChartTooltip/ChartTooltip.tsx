import React, { FC, useState } from "react";
import { Placement } from "@floating-ui/utils";
import classNames from "classnames";

// Components
import { Popover, PopoverBody } from "@components/atoms/Popover";
import Text from "@components/atoms/Text";

// Styles
import "./ChartTooltip.scss";

/** Prefer above the point; if needed flip to the sides — never below (under the cursor). */
const CHART_TOOLTIP_FALLBACK_PLACEMENTS: Placement[] = [
    "top-start",
    "top-end",
    "right",
    "left",
    "right-start",
    "left-start",
    "right-end",
    "left-end"
];

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
     * Controls tooltip visibility. Parent chart should set this from point hover.
     */
    open?: boolean;
    /**
     * Anchor X offset relative to the positioned chart body.
     */
    left?: number;
    /**
     * Anchor Y offset relative to the positioned chart body.
     */
    top?: number;
    /**
     * Remount key when the hovered point changes so Floating UI remeasures the moved anchor.
     */
    pointKey?: string | number;
    /**
     * Called when the Popover requests close (Escape / outside dismiss).
     */
    onClose?: () => void;
}

/**
 * Shared chart hover tooltip. Owns Popover positioning/arrow chrome so individual charts
 * only pass open state, anchor coordinates, and row items.
 */
const ChartTooltip: FC<IChartTooltipProps> = ({
    className,
    items,
    open = false,
    left = 0,
    top = 0,
    pointKey = "idle",
    onClose
}) => {
    const [popoverProps, setPopoverProps] = useState<Record<string, unknown>>({});

    return (
        <>
            <span className="chartTooltip__anchor" {...popoverProps} style={{ left, top }} aria-hidden />
            {/* Remount on point change so Floating UI remeasures the moved 0×0 anchor. */}
            <Popover
                key={pointKey}
                setProps={setPopoverProps}
                open={open}
                hasCloseButton={false}
                withArrow
                size="fitContent"
                position="top-center"
                margin={8}
                fallbackPlacements={CHART_TOOLTIP_FALLBACK_PLACEMENTS}
                disableMobileSpreadsheet
                className="chartTooltip__popover"
                onClose={onClose}
            >
                <PopoverBody withPadding={false} withScrollbar={false}>
                    {items.length > 0 && (
                        <div className={classNames("chartTooltip", className)}>
                            <div className="chartTooltip__content">
                                {items.map(({ name, value, color }) => (
                                    <div key={`${name}-${value}`} className="chartTooltip__row">
                                        <span
                                            className="chartTooltip__swatch"
                                            style={{ backgroundColor: color }}
                                            aria-hidden
                                        />
                                        <Text as="span" variant="captionLargeMedium" className="chartTooltip__text">
                                            {`${name}: ${value}`}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </PopoverBody>
            </Popover>
        </>
    );
};

export { IChartTooltipProps, IChartTooltipItem, ChartTooltip as default };
