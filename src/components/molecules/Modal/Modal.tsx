import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Modal.scss";

interface IModalProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Modal component props interface
}

/**
 * Modal component displays content in a layer above the main application, effectively focusing the user's attention on a specific task or information. It is often used for actions that require user input, such as confirmation dialogs, forms, or important notifications.
 */
const Modal: FC<IModalProps> = ({ className }) => {
    return <div className={classNames("modal", className)}>Modal</div>;
};

export { IModalProps, Modal as default };
