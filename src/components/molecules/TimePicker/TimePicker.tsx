import React, { forwardRef } from "react";
import classNames from "classnames";

// Styles
import "./TimePicker.scss";

interface ITimePickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TimePicker component props interface
}

/**
 * Time Picker component allows users to easily select a specific time, typically using an intuitive visual interface like a clock or list of time values.
 */
const TimePicker = forwardRef<HTMLDivElement, ITimePickerProps>(({ className }, ref) => {
    return (
        <div className={classNames("timePicker", className)} ref={ref}>
            TimePicker
        </div>
    );
});

export { ITimePickerProps, TimePicker as default };
