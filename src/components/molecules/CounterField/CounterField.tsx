import React, { ChangeEvent, FC, FocusEvent } from "react";
import classNames from "classnames";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Button from "@components/atoms/Button";
import TextField from "@components/molecules/TextField";
import { Plus, Minus } from "@geneui/icons";

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
    size?: 'small' | 'medium' | 'large';
    /**
     * The status/validation state of the component. Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     * Text alignment of the value in the input field. Possible values: `left | center | right`
     */
    alignment?: 'left' | 'right';
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
    onChange?: (value: number, event: ChangeEvent<HTMLInputElement>) => void;
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
 * CounterField
 */
const CounterField: FC<ICounterFieldProps> = ({ label,
    infoText,
    required,
    disabled,
    readOnly,
    helperText,
    status = "rest",
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    min,
    step,
    size,
    alignment,
    className }) => {
    return <div className={classNames(
        "counterField",
        {
            counterField_disabled: disabled,
            counterField_readOnly: readOnly
        },
        className
    )}
        aria-required={required}
        aria-invalid={status === "error"}>{label && (
            <Label text={label} required={required} disabled={disabled} readOnly={readOnly} infoText={infoText} />

        )}
        <div className="counterField__inputContainer">
            <Button
                appearance="secondary"
                className="counterField__button"
                layout="fill"
                Icon={Minus}
            />
            <TextField
                numericOnly
                autoComplete="off"
                className="pagination__input"
                value={value !== undefined ? String(value) : undefined}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const next = Number(event.target.value);
                    onChange?.(isNaN(next) ? 0 : next, event);
                }}
                onBlur={onBlur}
                onFocus={onFocus}
                size={size}
            />
            <Button
                appearance="secondary"
                className="counterField__button"
                layout="fill"
                Icon={Plus}
            />
        </div>

        {helperText && (
            <div className="counterField__infoContainer">
                <HelperText text={helperText} disabled={disabled} status={status} />
            </div>
        )}


    </div>;
};

export { ICounterFieldProps, CounterField as default };
