import React, { FC } from 'react';

// Styles
import './Checkbox.scss';

interface ICheckboxProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Checkbox component allows users to select one or more options from a set of choices. Each checkbox can be either checked or unchecked, indicating a binary state. Checkboxes are commonly used in forms, settings, and lists where multiple selections are needed.
 */
const Checkbox: FC<ICheckboxProps> = ({ size }) => {
    return <div className="checkbox">Checkbox</div>;
};

export { ICheckboxProps, Checkbox as default };
