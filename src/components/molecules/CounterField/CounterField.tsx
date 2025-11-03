import React, { ChangeEvent, FC, FocusEvent, MouseEvent } from "react";
import classNames from "classnames";

import { Minus, Plus } from "@geneui/icons";

import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import TextField from "@components/molecules/TextField";

// Styles
import "./CounterField.scss";

export interface ICounterFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The value of the counter (controlled).
     * This is what will be returned in onChange and stored as the selected value.
     */
    value?: number;
    /**
     * The initial value of the counter (uncontrolled).
     */
    defaultValue?: number;
    /**
     * Disables the counter field, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     * Makes the counter field read-only, preventing manual input changes.
     */
    readOnly?: boolean;

    // BOUNDARIES & STEP
    /**
     * The minimum allowed value.
     */
    min?: number;
    /**
     * The amount by which the value increases or decreases.
     */
    step?: number;

    // APPEARANCE & LAYOUT
    /**
     * Size of the component. Possible values: `small | medium | large`
     */
    size?: "small" | "medium" | "large";
    /**
     * The status/validation state of the component. Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     * The main label for the counter field.
     */
    label?: string;
    /**
     * Additional descriptive text that appears alongside the `label`, typically displayed as a tooltip.
     */
    infoText?: string;
    /**
     * Helper text that appears below the counter field.
     */
    helperText?: string;
    /**
     * Indicates that the field is required.
     */
    required?: boolean;

    // ACTIONS
    /**
     * Fires when the user changes the counter value (via buttons or input).
     */
    onChange?: (value: number, event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => void;
    /**
     * Fires when the input field loses focus.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Fires when the input field receives focus.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
}

/**
 * CounterField allows users to increment or decrement a numeric value using buttons or direct input.
 * It supports both controlled and uncontrolled modes, with customizable min values and step increments.
 */
const CounterField: FC<ICounterFieldProps> = ({
    label,
    infoText,
    required,
    disabled,
    readOnly,
    helperText,
    status = "rest",
    // value,
    // defaultValue,
    // onChange,
    // onBlur,
    // onFocus,
    // min,
    // step = 1,
    size = "medium",
    className
}) => {
    return (
        <div
            className={classNames(
                "counterField",
                `counterField_status_${status}`,
                {
                    counterField_disabled: disabled,
                    counterField_readOnly: readOnly
                },
                className
            )}
            aria-required={required}
            aria-invalid={status === "error"}
            {...((disabled || readOnly) && { tabIndex: -1 })}
        >
            {label && (
                <Label
                    text={label}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    infoText={infoText}
                    size={size === "large" ? "medium" : size}
                />
            )}

            <div className="counterField__inputContainer">
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_decrement"
                    layout="fill"
                    size={size}
                    Icon={Minus}
                    aria-label="Decrement value"
                />
                <TextField
                    numericOnly
                    autoComplete="off"
                    className="counterField__input"
                    size={size}
                    disabled={disabled}
                    readOnly={readOnly}
                    status={status}
                />
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_increment"
                    layout="fill"
                    size={size}
                    Icon={Plus}
                    aria-label="Increment value"
                />
            </div>

            {helperText && (
                <div className="counterField__infoContainer">
                    <HelperText text={helperText} disabled={disabled} status={status} />
                </div>
            )}
        </div>
    );
};

export default CounterField;
