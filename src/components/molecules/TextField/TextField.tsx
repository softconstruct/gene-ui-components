import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./TextField.scss";

interface ITextFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TextField component props interface
}

/**
 * Text field is an input element in a user interface where users can enter and edit text. Text fields are commonly used in forms for collecting user data such as names, email addresses, and messages.
 */
const TextField: FC<ITextFieldProps> = ({ className }) => {
    return <div className={classNames("textField", className)}>TextField</div>;
};

export { ITextFieldProps, TextField as default };
