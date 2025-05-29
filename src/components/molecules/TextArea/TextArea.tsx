import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./TextArea.scss";

interface ITextAreaProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TextArea component props interface
}

/**
 * Text area is a larger input field in a user interface designed for users to enter and edit multiline text.
 */
const TextArea: FC<ITextAreaProps> = ({ className }) => {
    return <div className={classNames("textArea", className)}>TextArea</div>;
};

export { ITextAreaProps, TextArea as default };
