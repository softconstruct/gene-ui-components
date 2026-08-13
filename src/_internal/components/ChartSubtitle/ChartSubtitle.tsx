import React, { FC } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

// Styles
import "./ChartSubtitle.scss";

interface IChartSubtitleProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Subtitle text content.
     */
    children: string;
}

/**
 * Chart subtitle shown above the plot area. Alignment follows the nearest `dir` (LTR/RTL) context.
 */
const ChartSubtitle: FC<IChartSubtitleProps> = ({ className, children }) => (
    <Text as="p" variant="bodyMediumRegular" className={classNames("chartSubtitle", className)}>
        {children}
    </Text>
);

export { IChartSubtitleProps, ChartSubtitle as default };
