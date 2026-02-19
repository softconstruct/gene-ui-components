import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./PopoverConfirm.scss";

interface IPopoverConfirmProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill PopoverConfirm component props interface
}

/**
 * Popover Confirm designed to request and capture user confirmation for actions in a visually prominent yet non-intrusive manner. It overlays the primary content to present a confirmation dialog that includes clear options for users to confirm or cancel the action.
 */
const PopoverConfirm: FC<IPopoverConfirmProps> = ({ className }) => {
    return <div className={classNames("popoverConfirm", className)}>PopoverConfirm</div>;
};

export { IPopoverConfirmProps, PopoverConfirm as default };
