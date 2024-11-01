import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./ButtonGroup.scss";

interface IButtonGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ButtonGroup component props interface
}

/**
 * A button group clusters multiple buttons together. Use button groups in toolbars, forms, and modals, etc.
 */
const ButtonGroup: FC<IButtonGroupProps> = ({ className }) => {
    return (
        <div className={classNames("buttonGroup buttonGroup_vertical", className)}>{/* Here should be buttons */}</div>
    );
};

export { IButtonGroupProps, ButtonGroup as default };
