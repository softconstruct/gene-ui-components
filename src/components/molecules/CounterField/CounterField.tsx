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
    value?: number | string;
    /**
     * The initial value of the counter (uncontrolled).
     */
    defaultValue?: number;
    /**
     * Disables the counter field, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     * Displays the counter field as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     * The amount by which the value increases or decreases.
     */
    step?: number;
    /**
     * The minimum value allowed for the counter.
     * The decrement button will be disabled when the value reaches or is below this minimum.
     */
    min?: number;
    /**
     * The maximum value allowed for the counter.
     * The increment button will be disabled when the value reaches or exceeds this maximum.
     */
    max?: number;
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
    /**
     * If true, the input element will automatically receive focus when the component mounts.
     *  Default value is `false`.
     */
    autoFocus?: boolean;
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
    onInputBlur,
    onInputFocus,
    step = 1,
    min,
    max,
    size = "medium",
    className,
    autoFocus
}) => {
    const isControlled = value !== undefined;

    const clampedDefaultValue = useMemo(() => {
        let clamped = defaultValue;
        if (min !== undefined && clamped < min) {
            clamped = min;
        }
        if (max !== undefined && clamped > max) {
            clamped = max;
        }
        return clamped;
    }, [defaultValue, min, max]);

    const [internalStringValue, setInternalStringValue] = useState(String(clampedDefaultValue));

    const clampedValueProp = useMemo(() => {
        if (value === undefined) return value;
        const numValue = typeof value === "string" ? Number(value) : value;
        if (!Number.isFinite(numValue)) return value;

        let clamped = numValue;
        if (min !== undefined && clamped < min) {
            clamped = min;
        }
        if (max !== undefined && clamped > max) {
            clamped = max;
        }
        return String(clamped);
    }, [value, min, max]);

    const currentStringValue = isControlled ? clampedValueProp : internalStringValue;

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
        const clampedValue = min !== undefined ? Math.max(nextValue, min) : nextValue;
        const nextValueString = String(clampedValue);
        if (!isControlled) {
            setInternalStringValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };

    const handleIncrement = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = validNumericValue + step;
        const clampedValue = max !== undefined ? Math.min(nextValue, max) : nextValue;
        const nextValueString = String(clampedValue);
        if (!isControlled) {
            setInternalStringValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };

    const inputId = useMemo(() => `counter-field-${nanoid()}`, []);

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onInputFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = Number(inputValue);
        if (Number.isFinite(numericValue)) {
            let clampedValue = numericValue;
            if (min !== undefined && clampedValue < min) {
                clampedValue = min;
            }
            if (max !== undefined && clampedValue > max) {
                clampedValue = max;
            }
            if (clampedValue !== numericValue) {
                const clampedValueString = String(clampedValue);

                if (!isControlled) {
                    setInternalStringValue(clampedValueString);
                }
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: clampedValueString
                    }
                } as ChangeEvent<HTMLInputElement>;

                onChange?.(clampedValueString, syntheticEvent);
            }
        }
        onInputBlur?.(e);
    };

    const isIncrementDisabled = useMemo(() => {
        if (disabled || readOnly) return true;
        if (max === undefined) return false;
        return validNumericValue >= max;
    }, [disabled, readOnly, max, validNumericValue]);

    const isDecrementDisabled = useMemo(() => {
        if (disabled || readOnly) return true;
        if (min === undefined) return false;
        return validNumericValue <= min;
    }, [disabled, readOnly, min, validNumericValue]);

    return (
        <div
            className={classNames(
                "counterField",
                `counterField_status_${status}`,
                {
                    counterField_disabled: disabled,
                    counterField_readOnly: readOnly && !disabled
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
                    disabled={isDecrementDisabled}
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
                    readOnly={readOnly}
                    status={status}
                    autoFocus={autoFocus}
                />
                <Button
                    appearance="secondary"
                    className="counterField__button counterField__button_increment_action"
                    layout="fill"
                    size={size}
                    Icon={Plus}
                    disabled={isIncrementDisabled}
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
