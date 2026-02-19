import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { ChevronDown, ChevronUp } from "@geneui/icons";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Styles
import "./NumberField.scss";

// Helpers
import { NUMERIC_STRING_PATTERN } from "../../../constants";
import { clampValue } from "../../../helpers";

interface INumberFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The value of the number field (controlled).
     * This is what will be returned in onChange and stored as the selected value.<br>
     * Possible values: `number | string`
     */
    value?: number | string;
    /**
     * The initial value of the number field (uncontrolled).<br>
     * Possible values: `number | string`
     */
    defaultValue?: number | string;
    /**
     * Disables the number field, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     * Displays the number field as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     * The amount by which the value increases or decreases.
     */
    step?: number;
    /**
     * The minimum value allowed for the number field.
     * The decrement button will be disabled when the value reaches or is below this minimum.
     */
    min?: number;
    /**
     * The maximum value allowed for the number field.
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
     * The main label for the number field.
     */
    label?: string;
    /**
     * Additional descriptive text that appears alongside the `label`, typically displayed as a tooltip.
     */
    infoText?: string;
    /**
     * Helper text that appears below the number field.
     */
    helperText?: string;
    /**
     * `HTML` `name` attribute for the `input` element
     */
    name?: string;
    /**
     * Placeholder text when input is empty.
     */
    placeholder?: string;
    /**
     * Indicates that the field is required.
     */
    required?: boolean;
    /**
     * Fires when the user changes the number field value (via buttons or input).
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
    /**
     * `HTML` `id` attribute for the `input` element
     */
    id?: string;
}

const iconSizes: Record<"small" | "medium" | "large", 12 | 16> = {
    small: 12,
    medium: 16,
    large: 16
} as const;

/**
 * Number Field designed to capture numeric data from users. It is specifically configured to accept only numerical values, ensuring accurate data entry for fields requiring quantities, measurements, or other numerical inputs.
 */
const NumberField: FC<INumberFieldProps> = ({
    className,
    value,
    defaultValue,
    id,
    disabled,
    readOnly,
    step = 1,
    min,
    max,
    size = "medium",
    status,
    label,
    infoText,
    helperText,
    placeholder,
    required,
    onChange,
    onInputBlur,
    onInputFocus,
    autoFocus,
    name
}) => {
    const hasMax = max !== undefined;
    const hasMin = min !== undefined;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string>(() =>
        !isControlled ? clampValue(defaultValue, min, max) : ""
    );
    const hasClampedControlledValue = useRef(false);

    const getCurrentStringValue = (): string => {
        if (isControlled) {
            if (!hasClampedControlledValue.current) {
                hasClampedControlledValue.current = true;
                return clampValue(value, min, max);
            }
            return String(value ?? "");
        }
        return internalValue;
    };

    const currentStringValue = getCurrentStringValue();

    const numericValue = Number(currentStringValue);
    const validNumericValue = Number.isFinite(numericValue) ? numericValue : 0;

    const handleValueChange = (stepValue: number, event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = validNumericValue + stepValue;

        let clampedValue = nextValue;
        if (stepValue > 0 && hasMax) {
            clampedValue = Math.min(nextValue, max);
        } else if (stepValue < 0 && hasMin) {
            clampedValue = Math.max(nextValue, min);
        }

        const nextValueString = String(clampedValue);

        if (!isControlled) {
            setInternalValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };
    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>, type: "increment" | "decrement") =>
        handleValueChange(type === "increment" ? step : -step, event);

    const combinedTextSize = size === "large" ? "medium" : size;
    const generatedId = useMemo(() => id || `default-id-${nanoid()}`, [id]);
    const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        onInputFocus?.(event);
    };
    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Preserve empty string
        if (inputValue === "") {
            onInputBlur?.(e);
            return;
        }
        const clampedValueString = clampValue(inputValue, min, max);
        if (clampedValueString !== inputValue) {
            if (!isControlled) {
                setInternalValue(clampedValueString);
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
        onInputBlur?.(e);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value: currentValue } = event.target;

        if (currentValue !== "" && !NUMERIC_STRING_PATTERN.test(currentValue)) {
            return;
        }

        onChange?.(currentValue, event);

        if (!isControlled) {
            setInternalValue(currentValue);
        }
    };

    const buttonsDisabled = useMemo(() => {
        const baseDisabled = disabled || readOnly;
        return {
            increment: baseDisabled || (hasMax && validNumericValue >= max),
            decrement: baseDisabled || (hasMin && validNumericValue <= min)
        };
    }, [disabled, readOnly, max, min, validNumericValue]);

    const autoFocusProp = autoFocus ? { autoFocus } : {};

    const buttonClassnames = (actionType: "increment" | "decrement") => {
        return classNames(`numberField__action_${actionType}`, "numberField__action", {
            numberField__action_readOnly: readOnly && !disabled,
            numberField__action_disabled: buttonsDisabled[actionType]
        });
    };

    return (
        <div className={classNames("numberField", className)}>
            <Label
                text={label}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                size={combinedTextSize}
                infoText={infoText}
                labelFor={generatedId}
            />
            <div className={classNames(`numberField__wrapper numberField__wrapper_size_${size}`)}>
                <div
                    className={classNames("numberField__inputWrapper", {
                        numberField__inputWrapper_readOnly: readOnly && !disabled,
                        numberField__inputWrapper_disabled: disabled,
                        numberField__inputWrapper_error: status === "error"
                    })}
                >
                    <input
                        className="numberField__input"
                        type="number"
                        disabled={disabled}
                        readOnly={readOnly}
                        onFocus={handleInputFocus}
                        onBlur={onBlurHandler}
                        onChange={handleChange}
                        value={currentStringValue}
                        id={generatedId}
                        inputMode="numeric"
                        {...autoFocusProp}
                        placeholder={placeholder}
                        name={name}
                        step={step}
                        min={min}
                        max={max}
                    />
                </div>
                <div className="numberField__actions">
                    <button
                        type="button"
                        className={buttonClassnames("increment")}
                        onClick={(event) => handleButtonClick(event, "increment")}
                        disabled={buttonsDisabled.increment}
                    >
                        <ChevronUp size={iconSizes[size]} />
                    </button>
                    <button
                        type="button"
                        className={buttonClassnames("decrement")}
                        onClick={(event) => handleButtonClick(event, "decrement")}
                        disabled={buttonsDisabled.decrement}
                    >
                        <ChevronDown size={iconSizes[size]} />
                    </button>
                </div>
            </div>
            {helperText && (
                <HelperText
                    text={helperText}
                    disabled={disabled}
                    status={status}
                    size={combinedTextSize}
                    className="numberField__helperText"
                />
            )}
        </div>
    );
};

export { INumberFieldProps, NumberField as default };
