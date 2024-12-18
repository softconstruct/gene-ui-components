import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Tabs.scss";

interface ITabsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Tabs component props interface
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */
const Tabs: FC<ITabsProps> = ({ className }) => {
    return <div className={classNames("tabs", className)}>Tabs</div>;
};

export { ITabsProps, Tabs as default };
