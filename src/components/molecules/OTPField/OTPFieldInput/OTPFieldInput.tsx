import React, { ChangeEvent, FC, FocusEvent, ForwardedRef, forwardRef, KeyboardEvent } from "react";
import classNames from "classnames";

// Styles
import "./OTPFieldInput.scss";

interface IOTPFieldInputProps {
    /**
     * Additional class for the input element. Use for placement using BEM conventions.
     */
    className?: string;
    /**
     * Size of the OTP input box.<br>
     * Possible values: `large | medium`.
     */
    size: "large" | "medium";
    /**
     * Visual state of the input.<br>
     * Possible values: `rest | error`.
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
     * Accessible label for screen readers.
     */
    "aria-label": string;
}

const OTPFieldInput: FC<IOTPFieldInputProps & { forwardedRef?: ForwardedRef<HTMLInputElement> }> = ({
    className,
    size,
    status = "rest",
    disabled,
    autoComplete,
    value,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    "aria-label": ariaLabel,
    forwardedRef
}) => {
    const sizeClass = `otpFieldInput_size_${size}`;

    const stateClasses = {
        [`otpFieldInput_status_${status}`]: !disabled,
        otpFieldInput_disabled: disabled
    };

    return (
        <input
            ref={forwardedRef}
            type="text"
            inputMode="numeric"
            autoComplete={autoComplete}
            className={classNames("otpFieldInput", sizeClass, stateClasses, className)}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-label={ariaLabel}
        />
    );
};

const ForwardedOTPFieldInput = forwardRef<HTMLInputElement, IOTPFieldInputProps>((props, ref) => {
    return <OTPFieldInput {...props} forwardedRef={ref} />;
});

export { IOTPFieldInputProps, ForwardedOTPFieldInput as default };
