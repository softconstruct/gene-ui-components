import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./DatePicker.scss";

interface IDatePickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill DatePicker component props interface
}

/**
 * Date picker allows users to input dates by either selecting from a visual calendar or typing directly into a form field.
 */
const DatePicker: FC<IDatePickerProps> = ({ className }) => {
    return <div className={classNames("datePicker", className)}>DatePicker</div>;
};

export { IDatePickerProps, DatePicker as default };
