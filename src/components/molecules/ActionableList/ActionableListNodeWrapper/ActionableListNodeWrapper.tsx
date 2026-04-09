import React, { FC } from "react";
import classNames from "classnames";

import "./ActionableListNodeWrapper.scss";

const clampLevel = (level: number): 1 | 2 | 3 | 4 | 5 =>
    Math.min(Math.max(Math.floor(level), 1), 5) as 1 | 2 | 3 | 4 | 5;

export interface IActionableListNodeWrapperProps {
    /**
     * Depth (1–5) shared by all sibling rows in this group. Sets `actionableList__wrapper_level_*` and inline-start inset.
     */
    level: number;
    className?: string;
    children?: React.ReactNode;
}

const ActionableListNodeWrapper: FC<IActionableListNodeWrapperProps> = ({ level, className, children }) => {
    const L = clampLevel(level);
    return (
        <div className={classNames("actionableList__wrapper", `actionableList__wrapper_level_${L}`, className)}>
            {children}
        </div>
    );
};

export default ActionableListNodeWrapper;
