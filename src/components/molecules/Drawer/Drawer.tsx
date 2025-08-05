import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Drawer.scss";

interface IDrawerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Drawer component props interface
}

/**
 * Drawer component slides in from the edge of the screen, allowing users to access additional content or actions without leaving the current view. It can be anchored to the left, right, top, or bottom of the screen and typically overlays or pushes the existing content, depending on situation.
 */
const Drawer: FC<IDrawerProps> = ({ className }) => {
    return <div className={classNames("drawer", className)}>Drawer</div>;
};

export { IDrawerProps, Drawer as default };
