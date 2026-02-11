import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { ChevronDown, ChevronUp } from "@geneui/icons";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Styles
import "./NumberField.scss";

import { NUMERIC_STRING_PATTERN } from "../../../constants";

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

const iconSizes: Record<"small" | "medium" | "large", 16> = {
    small: 16,
    medium: 16,
    large: 16
} as const;

const clampValue = (value?: number | string, min?: number, max?: number): string => {
    if (value === undefined) return "";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return String(value);

    let clamped = numericValue;
    if (min !== undefined && clamped < min) {
        clamped = min;
    }
    if (max !== undefined && clamped > max) {
        clamped = max;
    }
    return String(clamped);
};

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
    required,
    onChange,
    onInputBlur,
    onInputFocus,
    autoFocus
}) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string>("");
    const firstRender = useRef(true);

    useEffect(() => {
        if (!isControlled) {
            setInternalValue(clampValue(defaultValue, min, max));
        }
        firstRender.current = false;
    }, []);

    const getCurrentStringValue = (): string => {
        if (isControlled) {
            return firstRender.current ? clampValue(value, min, max) : String(value ?? "");
        }
        return internalValue;
    };

    const currentStringValue = getCurrentStringValue();

    const numericValue = Number(currentStringValue);
    const validNumericValue = Number.isFinite(numericValue) ? numericValue : 0;

    const handleValueChange = (stepValue: number, event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = validNumericValue + stepValue;

        let clampedValue = nextValue;
        if (stepValue > 0 && max !== undefined) {
            clampedValue = Math.min(nextValue, max);
        } else if (stepValue < 0 && min !== undefined) {
            clampedValue = Math.max(nextValue, min);
        }

        const nextValueString = String(clampedValue);

        if (!isControlled) {
            setInternalValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };
    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>, isIncrement: boolean) =>
        handleValueChange(isIncrement ? step : -step, event);

    const labelSize = size === "large" ? "medium" : size;
    const helperTextSize = size === "large" ? "medium" : size;
    const generatedId = useMemo(() => id || `default-id-${nanoid()}`, [id]);
    const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        onInputFocus?.(event);
    };
    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
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
            increment: baseDisabled || (max !== undefined && validNumericValue >= max),
            decrement: baseDisabled || (min !== undefined && validNumericValue <= min)
        };
    }, [disabled, readOnly, max, min, validNumericValue]);

    const actionButtonClasses = classNames("numberField__action", {
        numberField__action_readOnly: readOnly && !disabled
    });

    return (
        <div className={classNames("numberField", className)}>
            <Label
                text={label}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                size={labelSize}
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
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={autoFocus}
                        onFocus={handleInputFocus}
                        onBlur={onBlurHandler}
                        onChange={handleChange}
                        value={currentStringValue}
                        id={generatedId}
                    />
                </div>
                <div className="numberField__actions">
                    <button
                        type="button"
                        className={classNames(actionButtonClasses, "numberField__action_up", {
                            numberField__action_disabled: buttonsDisabled.increment
                        })}
                        onClick={(event) => handleButtonClick(event, true)}
                        disabled={buttonsDisabled.increment}
                    >
                        <ChevronUp size={iconSizes[size]} />
                    </button>
                    <button
                        type="button"
                        className={classNames(actionButtonClasses, "numberField__action_down", {
                            numberField__action_disabled: buttonsDisabled.decrement
                        })}
                        onClick={(event) => handleButtonClick(event, false)}
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
                    size={helperTextSize}
                    className="numberField__helperText"
                />
            )}
        </div>
    );
};

export { INumberFieldProps, NumberField as default };
