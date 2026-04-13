import React, { FC } from "react";
import classNames from "classnames";

import "./ActionableListNodeWrapper.scss";

export type TActionableListLevel = 1 | 2 | 3 | 4 | 5;

export interface IActionableListNodeWrapperProps {
    /**
     * Depth (1–5) shared by all sibling rows in this group. Sets `actionableList__wrapper_level_*` and inline-start inset.
     */
    level: TActionableListLevel;
    className?: string;
    children?: React.ReactNode;
}

const ActionableListNodeWrapper: FC<IActionableListNodeWrapperProps> = ({ level, className, children }) => {
    return (
        <div className={classNames("actionableList__wrapper", `actionableList__wrapper_level_${level}`, className)}>
            {children}
        </div>
    );
};

export default ActionableListNodeWrapper;
