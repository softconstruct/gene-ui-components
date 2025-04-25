import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Navigation.scss";

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Navigation component props interface
}

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({ className }) => {
    return <div className={classNames("navigation", className)}>Navigation</div>;
};

export { INavigationProps, Navigation as default };
