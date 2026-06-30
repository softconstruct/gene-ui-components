import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Widget.scss";

interface IWidgetProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Widget component props interface
}

/**
 * Widget components are versatile, self-contained elements that provide specific functionality or display information in a compact, interactive format. These components are designed to be easily embedded within various parts of a digital interface, such as dashboards, sidebars, or standalone sections, offering users quick access to key features and data.
 */
const Widget: FC<IWidgetProps> = ({ className }) => {
    return <div className={classNames("widget", className)}>Widget</div>;
};

export { IWidgetProps, Widget as default };
