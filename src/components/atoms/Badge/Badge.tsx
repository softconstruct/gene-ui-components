import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Badge.scss";

interface IBadgeProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Badge component props interface
}

/**
 * Numeric Badge component is a small, circular indicator that displays numerical information, often used to highlight counts or statuses. It is typically positioned adjacent to icons or labels, providing users with a quick visual cue about the number of notifications, messages, or items requiring attention.
 */
const Badge: FC<IBadgeProps> = ({ className }) => {
    return <div className={classNames("badge", className)}>Badge</div>;
};

export { IBadgeProps, Badge as default };
