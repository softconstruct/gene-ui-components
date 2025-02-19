import React, { FC } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";

// Styles
import "./Switch.scss";

interface ISwitchProps {
    /**
     * Label for the switch
     */
    label?: string;
    /**
     * Additional helper text displayed below the switch
     */
    helperText?: string;
    /**
     * If true, the switch will be disabled
     */
    disabled?: boolean;
    /**
     * If true, the switch will be read-only
     */
    readOnly?: boolean;
    /**
     * The alignment of the label relative to the switch </br>
     * Possible values: `after | before | top`
     */
    labelAlignment?: "after" | "before" | "top";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * A switch component allows users to toggle between two states, typically "on" and "off". It is commonly used in settings and preferences to enable or disable features or functionalities.
 */
const Switch: FC<ISwitchProps> = ({ className, label, helperText, disabled, readOnly, labelAlignment = "after" }) => {
    return (
        <div
            className={classNames(
                "switch",
                {
                    switch_labelAfter: labelAlignment === "after",
                    switch_labelBefore: labelAlignment === "before",
                    switch_labelTop: labelAlignment === "top"
                },
                className
            )}
        >
            <label className="switch__label">
                <input type="checkbox" className="switch__input" disabled={disabled} readOnly={!disabled && readOnly} />
                <span className="switch__slider" />
                {label && <span className="switch__labelText">{label}</span>}
            </label>
            {helperText && <HelperText text={helperText} className="switch__helperText" isDisabled={disabled} />}
        </div>
    );
};

export { ISwitchProps, Switch as default };
