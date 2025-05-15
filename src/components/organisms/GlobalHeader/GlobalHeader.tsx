import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./GlobalHeader.scss";

interface IGlobalHeaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill GlobalHeader component props interface
}

/**
 * Global Header component is a persistent navigation element that appears at the top of an application or website. It serves as a central hub for accessing key features and tools, ensuring consistent and intuitive navigation across all pages.
 */
const GlobalHeader: FC<IGlobalHeaderProps> = ({ className }) => {
    return <div className={classNames("globalHeader", className)}>GlobalHeader</div>;
};

export { IGlobalHeaderProps, GlobalHeader as default };
