import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
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

// Helpers
import { clampValue } from "../../../helpers";

interface ICounterFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The value of the counter (controlled).
     * This is what will be returned in onChange and stored as the selected value.<br>
     * Possible values: `number | string`
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
    /**
     * `HTML` `id` attribute for the `input` element
     */
    id?: string;
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
    id,
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

    const [internalStringValue, setInternalStringValue] = useState<string>("");
    const firstRender = useRef(true);

    useEffect(() => {
        if (!isControlled) {
            setInternalStringValue(clampValue(defaultValue, min, max));
        }
        firstRender.current = false;
    }, []);

    const getCurrentStringValue = (): string => {
        if (isControlled) {
            return firstRender.current ? clampValue(value, min, max) : String(value ?? "");
        }
        return internalStringValue;
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
            setInternalStringValue(nextValueString);
        }
        onChange?.(nextValueString, event);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        if (!isControlled) {
            setInternalStringValue(inputValue);
        }

        onChange?.(inputValue, event);
    };

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>, isIncrement: boolean) =>
        handleValueChange(isIncrement ? step : -step, event);

    const inputId = useMemo(() => id || `default-id-${nanoid()}`, [id]);

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onInputFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const clampedValueString = clampValue(inputValue, min, max);
        if (clampedValueString !== inputValue) {
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
        onInputBlur?.(e);
    };
    const buttonsDisabled = useMemo(() => {
        const baseDisabled = disabled || readOnly;
        return {
            increment: baseDisabled || (max !== undefined && validNumericValue >= max),
            decrement: baseDisabled || (min !== undefined && validNumericValue <= min)
        };
    }, [disabled, readOnly, max, min, validNumericValue]);

    return (
        <div
            className={classNames("counterField", `counterField_status_${status}`, className)}
            aria-required={required}
            aria-invalid={status === "error"}
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
            <div className={classNames("counterField__inputContainer", `counterField__inputContainer_size_${size}`)}>
                <Button
                    appearance="secondary"
                    className="counterField__button"
                    layout="fill"
                    size={size}
                    Icon={Minus}
                    disabled={buttonsDisabled.decrement}
                    aria-label={ariaLabelDecrement}
                    onClick={(event) => handleButtonClick(event, false)}
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
                    className="counterField__button"
                    layout="fill"
                    size={size}
                    Icon={Plus}
                    disabled={buttonsDisabled.increment}
                    aria-label={ariaLabelIncrement}
                    onClick={(event) => handleButtonClick(event, true)}
                />
            </div>
            {helperText && (
                <HelperText
                    text={helperText}
                    disabled={disabled}
                    status={status}
                    className="counterField__helperText"
                />
            )}
        </div>
    );
};

export { ICounterFieldProps, CounterField as default };
