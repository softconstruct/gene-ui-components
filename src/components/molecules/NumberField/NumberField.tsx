import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./NumberField.scss";

interface INumberFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill NumberField component props interface
}

/**
 * Number Field designed to capture numeric data from users. It is specifically configured to accept only numerical values, ensuring accurate data entry for fields requiring quantities, measurements, or other numerical inputs.
 */
const NumberField: FC<INumberFieldProps> = ({ className }) => {
    return <div className={classNames("numberField", className)}>NumberField</div>;
};

export { INumberFieldProps, NumberField as default };
