import React, { FC } from "react";

import "./ActionableListNodeWrapper.scss";

export type TActionableListLevel = 1 | 2 | 3 | 4 | 5;

export interface IActionableListNodeWrapperProps {
    /**
     * Depth (1–5) shared by all sibling rows in this group. Sets `actionableList__wrapper_level_*` and inline-start inset.
     */
    level: TActionableListLevel;
    /**
     * Nested row nodes rendered inside this level wrapper.
     */
    children?: React.ReactNode;
}

const ActionableListNodeWrapper: FC<IActionableListNodeWrapperProps> = ({ level, children }) => {
    return <div className={`actionableList__wrapper actionableList__wrapper_level_${level}`}>{children}</div>;
};

export default ActionableListNodeWrapper;
