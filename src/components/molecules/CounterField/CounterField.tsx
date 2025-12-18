import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useMemo, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { Minus, Plus } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import TextField from "@components/molecules/TextField";

// Styles
import "./CounterField.scss";

interface ICounterFieldProps {
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
     * The amount by which the value increases or decreases.
     */
    step?: number;
    /**
     * Size of the component.<br> Possible values: `small | medium | large`
     */
    size?: "small" | "medium" | "large";
    /**
     * The status/validation state of the component.<br> Possible values: `rest | warning | error`
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
    /**
     * The aria label for the increment button.
     */
    ariaLabelIncrement?: string;
    /**
     * The aria label for the decrement button.
     */
    ariaLabelDecrement?: string;
    /**
     * Fires when the user changes the counter value (via buttons or input).
     * Receives the raw input string value - parent can convert to number if needed.
     */
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => void;
    /**
     * Fires when the input field loses focus.
     */
    onInputBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Fires when the input field receives focus.
     */
    onInputFocus?: (event: FocusEvent<HTMLInputElement>) => void;
}

/**
 * The Counter Field component is an input field designed to increment or decrement a numerical value.
 * It typically includes buttons for increasing or decreasing the count and can be configured to accept user input directly.
 */
const CounterField: FC<ICounterFieldProps> = ({
    label,
    infoText,
    required,
    disabled,
    helperText,
    ariaLabelIncrement = "Increment value",
    ariaLabelDecrement = "Decrement value",
    status = "rest",
    value,
    defaultValue = 0,
    onChange,
    onInputBlur,
    onInputFocus,
    step = 1,
    size = "medium",
    className
}) => {
    const isControlled = value !== undefined;

    const [internalStringValue, setInternalStringValue] = useState(String(defaultValue));

    const currentStringValue = isControlled ? String(value) : internalStringValue;

    const validNumericValue = useMemo(() => {
        const numericValue = Number(currentStringValue);
        return Number.isFinite(numericValue) ? numericValue : 0;
    }, [currentStringValue]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        if (!isControlled) {
            setInternalStringValue(inputValue);
        }

        onChange?.(inputValue, event);
    };

    const handleDecrement = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = validNumericValue - step;
        const nextValueString = String(nextValue);
        if (!isControlled) {
            setInternalStringValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };

    const handleIncrement = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = validNumericValue + step;
        const nextValueString = String(nextValue);
        if (!isControlled) {
            setInternalStringValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };

    const inputId = useMemo(() => `counter-field-${nanoid()}`, []);

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onInputFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => onInputBlur?.(e);

    return (
        <div
            className={classNames(
                "counterField",
                `counterField_status_${status}`,
                {
                    counterField_disabled: disabled
                },
                className
            )}
            aria-required={required}
            aria-invalid={status === "error"}
        >
            {label && (
                <Label
                    text={label}
                    required={required}
                    disabled={disabled}
                    infoText={infoText}
                    size={size === "large" ? "medium" : size}
                    labelFor={inputId}
                />
            )}
            <div className="counterField__inputContainer">
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_decrement_action"
                    layout="fill"
                    size={size}
                    Icon={Minus}
                    disabled={disabled}
                    aria-label={ariaLabelDecrement}
                    onClick={handleDecrement}
                />
                <TextField
                    id={inputId}
                    type="number"
                    autoComplete="off"
                    onBlur={onBlurHandler}
                    onFocus={onFocusHandler}
                    onChange={handleInputChange}
                    className="counterField__input"
                    size={size}
                    value={currentStringValue}
                    disabled={disabled}
                    status={status}
                />
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_increment_action"
                    layout="fill"
                    size={size}
                    Icon={Plus}
                    disabled={disabled}
                    aria-label={ariaLabelIncrement}
                    onClick={handleIncrement}
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

export { ICounterFieldProps, CounterField as default };
