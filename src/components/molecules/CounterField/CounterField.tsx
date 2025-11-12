import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useState } from "react";
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

    // ARIA LABELS
    /**
     * The aria label for the increment button.
     */
    ariaLabelIncrement?: string;
    /**
     * The aria label for the decrement button.
     */
    ariaLabelDecrement?: string;
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
 * The Counter Field component is an input field designed to increment or decrement a numerical value.
 * It typically includes buttons for increasing or decreasing the count and can be configured to accept user input directly.
 */
const CounterField: FC<ICounterFieldProps> = ({
    label,
    infoText,
    required,
    disabled,
    readOnly,
    helperText,
    ariaLabelIncrement = "Increment value",
    ariaLabelDecrement = "Decrement value",
    status = "rest",
    value,
    defaultValue = 0,
    onChange,
    onBlur,
    onFocus,
    min = 0,
    step = 1,
    size = "medium",
    className
}) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState(defaultValue || min);

    const currentValue = isControlled ? value : internalValue;

    const clampToMin = (nextValue: number) => {
        if (nextValue < min) {
            return min;
        }
        return nextValue;
    };

    const updateValue = (nextValue: number, event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => {
        const clampedValue = clampToMin(nextValue);

        if (!isControlled) {
            setInternalValue(clampedValue);
        }

        onChange?.(clampedValue, event);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue === "" || inputValue === "-") {
            const nextValue = min;
            updateValue(nextValue, event);
            return;
        }
        const parsedValue = parseInt(inputValue, 10);

        if (!Number.isNaN(parsedValue)) {
            updateValue(parsedValue, event);
        }
    };

    const handleDecrement = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = currentValue - step;
        updateValue(nextValue, event);
    };

    const handleIncrement = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = currentValue + step;
        updateValue(nextValue, event);
    };

    const isDecrementDisabled = disabled || readOnly || currentValue <= min;

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => onBlur?.(e);

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
                    className="counterField__button counterField__button_decrement_action"
                    layout="fill"
                    size={size}
                    Icon={Minus}
                    disabled={isDecrementDisabled}
                    aria-label={ariaLabelDecrement}
                    onClick={handleDecrement}
                />
                <TextField
                    numericOnly
                    autoComplete="off"
                    onBlur={onBlurHandler}
                    onFocus={onFocusHandler}
                    onChange={handleInputChange}
                    className="counterField__input"
                    size={size}
                    value={String(currentValue)}
                    disabled={disabled}
                    readOnly={readOnly}
                    status={status}
                />
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_increment_action"
                    layout="fill"
                    size={size}
                    Icon={Plus}
                    disabled={disabled || readOnly}
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

export default CounterField;
