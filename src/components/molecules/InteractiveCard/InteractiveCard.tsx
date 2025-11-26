import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./InteractiveCard.scss";

interface IInteractiveCardProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill InteractiveCard component props interface
}

/**
 * Interactive Card component displays information and engage users through actionable content. Unlike static cards, Interactive Cards respond to user interactions, such as clicks or hovers, triggering actions or revealing additional information.
 */
const InteractiveCard: FC<IInteractiveCardProps> = ({ className }) => {
    return <div className={classNames("interactiveCard", className)}>InteractiveCard</div>;
};

export { IInteractiveCardProps, InteractiveCard as default };
