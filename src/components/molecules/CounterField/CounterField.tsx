import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./CounterField.scss";

interface ICounterFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill CounterField component props interface
}

/**
 * CounterField
 */
const CounterField: FC<ICounterFieldProps> = ({ className }) => {
    return <div className={classNames("counterField", className)}>CounterField</div>;
};

export { ICounterFieldProps, CounterField as default };
