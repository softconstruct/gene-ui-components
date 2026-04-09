import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./ActionableList.scss";

interface IActionableListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ActionableList component props interface
}

/**
 * Actionable List component provides users with a highly interactive, multi-functional list of items, organized in a hierarchical structure that supports up to five levels of nested items.
 */
const ActionableList: FC<IActionableListProps> = ({ className }) => {
    return <div className={classNames("actionableList", className)}>ActionableList</div>;
};

export { IActionableListProps, ActionableList as default };
