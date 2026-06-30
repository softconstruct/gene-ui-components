import React, { FC, JSX, useContext } from "react";
import classNames from "classnames";

import { ArrowBounceDown, ArrowRight, IconProps, Tag } from "@geneui/icons";

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
}

/**
 * Widget components are versatile, self-contained elements that provide specific functionality or display information in a compact, interactive format. These components are designed to be easily embedded within various parts of a digital interface, such as dashboards, sidebars, or standalone sections, offering users quick access to key features and data.
 */
const Widget: FC<IWidgetProps> = ({ className, title, infoText, Icon, swappableElement }) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
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
                            <Text as="h4" variant="headingLargeSemibold">
                                $ 17.00
                            </Text>
                            <div className="widget__percentWrapper">
                                {/* widget__percent_down // widget__percent_up */}
                                <ArrowBounceDown size={16} className="widget__percent widget__percent_down" />-
                                <Text as="span" variant="labelLargeSemibold">
                                    32%
                                </Text>
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
