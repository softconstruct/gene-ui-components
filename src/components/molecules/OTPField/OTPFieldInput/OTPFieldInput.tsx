import React, { ChangeEvent, FocusEvent, forwardRef, KeyboardEvent, memo, MouseEvent } from "react";
import classNames from "classnames";

// Styles
import "./OTPFieldInput.scss";

interface IOTPFieldInputProps {
    /**
     * Additional class for the input element. Use for placement using BEM conventions.
     */
    className?: string;
    /**
     * Position index within the OTP group. Rendered as `data-index` for event delegation.
     */
    index: number;
    /**
     * Size of the OTP input box.<br>
     */
    size: "large" | "medium";
    /**
     * Visual state of the input.<br>
     */
    status?: "rest" | "error";
    /**
     * Whether the input is disabled.
     */
    disabled?: boolean;
    /**
     * HTML autocomplete attribute.
     */
    autoComplete?: string;
    /**
     * Current value of the input.
     */
    value: string;
    /**
     * Change handler for the input.
     */
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Key down handler for the input.
     */
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    /**
     * Focus handler for the input.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Blur handler for the input.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Click handler for the input.
     */
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    /**
     * Accessible label for screen readers.
     */
    "aria-label": string;
}

const OTPFieldInputBase = forwardRef<HTMLInputElement, IOTPFieldInputProps>(
    (
        {
            className,
            index,
            size,
            status = "rest",
            disabled,
            autoComplete,
            value,
            onChange,
            onKeyDown,
            onFocus,
            onBlur,
            onClick,
            "aria-label": ariaLabel
        },
        ref
    ) => {
        const inputClassName = classNames(
            "otpFieldInput",
            `otpFieldInput_size_${size}`,
            {
                [`otpFieldInput_status_${status}`]: !disabled,
                otpFieldInput_disabled: disabled
            },
            className
        );

        return (
            <input
                ref={ref}
                data-index={index}
                type="text"
                inputMode="numeric"
                autoComplete={autoComplete}
                className={inputClassName}
                disabled={disabled}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                aria-label={ariaLabel}
            />
        );
    }
);

OTPFieldInputBase.displayName = "OTPFieldInputBase";

const OTPFieldInput = memo(OTPFieldInputBase);

OTPFieldInput.displayName = "OTPFieldInput";

export { IOTPFieldInputProps, OTPFieldInput as default };
