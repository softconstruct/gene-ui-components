import React, { FC } from "react";
import classNames from "classnames";

import { ChevronDown, ChevronUp } from "@geneui/icons";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

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
    return (
        <div className={classNames("numberField", className)}>
            <Label text="Label" />
            {/* Sizes // numberField__wrapper_size_large // numberField__wrapper_size_medium // numberField__wrapper_size_small */}
            <div className="numberField__wrapper numberField__wrapper_size_large">
                {/* States // numberField__inputWrapper_readOnly // numberField__inputWrapper_disabled */}
                <div className="numberField__inputWrapper">
                    <input className="numberField__input" type="text" />
                </div>
                <div className="numberField__actions">
                    {/* States // numberField__action_readOnly // numberField__action_disabled */}
                    <button type="button" className="numberField__action numberField__action_up">
                        <ChevronUp size={16} />
                    </button>
                    <button type="button" className="numberField__action numberField__action_down">
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
            <HelperText text="Helper Text" />
        </div>
    );
};

export { INumberFieldProps, NumberField as default };
