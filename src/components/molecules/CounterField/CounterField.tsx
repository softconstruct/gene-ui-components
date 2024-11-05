import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./CounterField.scss";
import HelperText from "../../atoms/HelperText";

interface ICounterFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill CounterField component props interface
}

/**
 * The Counter Field component is an input field designed to increment or decrement a numerical value. It typically includes buttons for increasing or decreasing the count and can be configured to accept user input directly.
 */
const CounterField: FC<ICounterFieldProps> = ({ className }) => {
    return (
        <div className="counterField">
            {/* Sizes / large / medium / small */}
            <div className={classNames("counterField__wrapper counterField__wrapper_size_large", className)}>
                {/* Here should be the Button and the Text Field components */}
            </div>
            <HelperText type="danger" text="This field is required" />
        </div>
    );
};

export { ICounterFieldProps, CounterField as default };
