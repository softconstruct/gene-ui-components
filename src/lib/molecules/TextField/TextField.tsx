import React, { FC } from 'react';

// Styles
import './TextField.scss';

interface ITextFieldProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Text field is an input element in a user interface where users can enter and edit text. Text fields are commonly used in forms for collecting user data such as names, email addresses, and messages.
 */
const TextField: FC<ITextFieldProps> = ({ size }) => {
    return <div className="textField">TextField</div>;
};

export { ITextFieldProps, TextField as default };
