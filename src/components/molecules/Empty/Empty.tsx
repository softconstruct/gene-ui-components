import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Empty.scss";

interface IEmptyProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;

    /**
     * message description
     */
    // message?: unknown;
    /**
     * description description
     */
    // description?: unknown;
}

/**
 * The Empty component visually represents chronological events or steps in a process. It is commonly used in dashboards, order tracking, and activity feeds to display key milestones or updates in a structured manner.
 */
const Empty: FC<IEmptyProps> = ({ className }) => {
    return <div className={classNames("empty", className)}>Empty</div>;
};

export { IEmptyProps, Empty as default };
