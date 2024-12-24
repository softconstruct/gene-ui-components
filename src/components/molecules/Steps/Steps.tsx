import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Steps.scss";

interface IStepsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Steps component props interface
}

/**
 * Step component is used to guide users through a sequential process by breaking it down into distinct steps. It is commonly employed in multi-step forms, checkout processes, or workflows that require users to complete tasks in a specific order.
 */
const Steps: FC<IStepsProps> = ({ className }) => {
    return <div className={classNames("steps", className)}>Steps</div>;
};

export { IStepsProps, Steps as default };
