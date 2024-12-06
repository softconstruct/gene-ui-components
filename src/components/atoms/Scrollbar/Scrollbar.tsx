import React, { FC, JSX } from "react";
import classNames from "classnames";
// Styles
import "./Scrollbar.scss";

interface IScrollbarProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    children: JSX.Element;
}

/**
 * Scrollbar is a UI element that allows users to navigate through content that extends beyond the visible area of a container or window. It typically appears along the right side or bottom of the viewport, providing a draggable handle and directional arrows for vertical or horizontal scrolling, enabling users to access all available content.
 */
const Scrollbar: FC<IScrollbarProps> = ({ className, children }) => {
    return (
        <div className={classNames("scrollbar", className)}>
            <div className="scrollbar__container">{children}</div>
            <div className="scrollbar__track scrollbar__track_direction_vertical" />
            <div className="scrollbar__track scrollbar__track_direction_horizontal" />
        </div>
    );
};

export { IScrollbarProps, Scrollbar as default };
