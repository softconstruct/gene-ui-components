import React, { FC, JSX, useContext } from "react";
import classNames from "classnames";

import { ArrowBounceDown, ArrowBounceUp, ArrowRight, IconProps, Tag } from "@geneui/icons";

// Styles
import "./Widget.scss";

import {
    Button,
    GeneUIDesignSystemContext,
    Label,
    SegmentedControl,
    SegmentedControlButton,
    Text
} from "../../../index";

type WidgetTrend = "up" | "down";

const trendIcons: Record<WidgetTrend, FC<IconProps>> = {
    up: ArrowBounceUp,
    down: ArrowBounceDown
};

interface IWidgetProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The title text displayed in the widget's header via the `Label` component.
     */
    title?: string;
    /**
     * Additional informational text displayed alongside the title.
     * When provided, an info icon will be displayed next to the title,
     * which can be hovered over to reveal the additional context via a tooltip.
     */
    infoText?: string;
    /**
     * Icon component displayed in the widget body info section.
     */
    Icon?: FC<IconProps>;
    /**
     * Swappable content to be displayed in the widget body swap area.
     * When provided, this content will be rendered alongside the widget info section.
     */
    swappableElement?: JSX.Element;
    /**
     * Primary metric value displayed in the widget body.
     * When provided, it is rendered as the main heading value above the percentage change.
     */
    value?: string;
    /**
     * Direction of the metric change shown beside the percentage value.
     * Renders an arrow icon with success styling for `up` or error styling for `down`.
     * Possible values: `up` | `down`
     */
    trend?: WidgetTrend;
    /**
     * Percentage or delta text displayed beside the trend icon.
     * When provided, it is rendered within the trend section next to the direction arrow.
     */
    trendValue?: string;
}

/**
 * Widget components are versatile, self-contained elements that provide specific functionality or display information in a compact, interactive format. These components are designed to be easily embedded within various parts of a digital interface, such as dashboards, sidebars, or standalone sections, offering users quick access to key features and data.
 */
const Widget: FC<IWidgetProps> = ({ className, title, infoText, Icon, swappableElement, value, trend, trendValue }) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
    const TrendIcon = trend ? trendIcons[trend] : null;

    return (
        <div className={classNames("widget", className)}>
            <div className="widget__header">
                <Label className="widget__label" text={title} infoText={infoText} />
                <div className="widget__controls">
                    <SegmentedControl value="test1" size="small">
                        <SegmentedControlButton name="test 1" Icon={Tag}>
                            {isMobileBreakpoint ? "" : "test 1"}
                        </SegmentedControlButton>
                        <SegmentedControlButton name="test 2" Icon={Tag}>
                            {isMobileBreakpoint ? "" : "test 2"}
                        </SegmentedControlButton>
                    </SegmentedControl>
                    <Button Icon={ArrowRight} appearance="secondary" layout="text" size="small" />
                </div>
            </div>
            <div className="widget__body">
                <div className="widget__content">
                    {Icon && (
                        <div className="widget__iconWrapper">
                            <Icon size={28} />
                        </div>
                    )}
                    <div className="widget__info">
                        <div className="widget__values">
                            {value && (
                                <Text as="h4" variant="headingLargeSemibold" className="widget__value">
                                    {value}
                                </Text>
                            )}
                            <div className="widget__trendWrapper">
                                {TrendIcon && (
                                    <TrendIcon
                                        size={16}
                                        className={classNames("widget__trendIcon", `widget__trendIcon_${trend}`)}
                                    />
                                )}
                                {trendValue && (
                                    <Text as="span" variant="labelLargeSemibold">
                                        {trendValue}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {swappableElement && <div className="widget__swap">{swappableElement}</div>}
            </div>
        </div>
    );
};

export { IWidgetProps, Widget as default };
