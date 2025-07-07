import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./RadioGroup.scss";

interface IRadioGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill RadioGroup component props interface
}

/**
 * A radio group allows users to select one option from a group of related choices. Each radio in the group is accompanied by a label, and only one radio within the group can be selected at any time.
 */
const RadioGroup: FC<IRadioGroupProps> = ({ className }) => {
    return <div className={classNames("radioGroup", className)}>RadioGroup</div>;
};

export { IRadioGroupProps, RadioGroup as default };
