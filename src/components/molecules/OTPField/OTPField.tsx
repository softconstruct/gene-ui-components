import React, {
    ChangeEvent,
    ClipboardEvent,
    FC,
    FocusEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";
import Text from "@components/atoms/Text";
import Notification from "@components/molecules/Notification";
// Hooks
import useCountdown from "@components/molecules/OTPField/hooks/useCountdown";
import {
    DIGIT_PATTERN,
    digitsToString,
    helperTextSizeMap,
    normalizeDigitsLength,
    OTP_INDICES,
    OTP_LENGTH,
    stringToDigits
} from "@components/molecules/OTPField/otpField.helpers";
import OTPFieldInput, { IOTPFieldInputProps } from "@components/molecules/OTPField/OTPFieldInput/OTPFieldInput";

// Styles
import "./OTPField.scss";

interface IOTPFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Size of the OTP input boxes.<br>
     */
    size?: IOTPFieldInputProps["size"];
    /**
     * Controlled value. Each character maps to one digit input.
     * Accepts a string (`"1234"`) or a non-negative integer (`1234`).
     */
    value?: string | number;
    /**
     * Default value for uncontrolled usage.
     * Accepts a string (`"1234"`) or a non-negative integer (`1234`).
     */
    defaultValue?: string | number;
    /**
     * Disables the OTP field, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Determines the input appearance based on its status.<br>
     */
    status?: "rest" | "error";
    /**
     * Helper text displayed below the inputs (e.g. "Code is valid for").
     */
    helperText?: string;
    /**
     * Countdown duration in seconds (e.g. `180` for 3 minutes).
     * When provided, the component starts an internal countdown timer displayed as `MM:SS` next to the helper text.
     */
    timerDuration?: number;
    /**
     * Callback fired when the countdown timer reaches zero.
     */
    onTimerExpire?: () => void;
    /**
     * Error notification description. Displayed as an inline `sectionMessage` when `status` is `error`.
     */
    notification?: string;
    /**
     * Callback when the value changes.
     * @param value - The current OTP string
     */
    onChange?: (value: string) => void;
    /**
     * Callback when all digits have been entered.
     * @param value - The complete OTP string
     */
    onComplete?: (value: string) => void;
    /**
     * Callback when an input receives focus.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback when an input loses focus.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * When `true`, focuses the first OTP input on mount (if not disabled).<br>
     * Default is `false`.
     */
    autoFocus?: boolean;
}

/**
 * The OTP Field component is an input field designed for entering a one-time password, often used for multi-factor authentication. The OTP Field component ensures that applications can securely verify user actions and identities, thereby protecting against unauthorized access and enhancing overall security.
 */
const OTPField: FC<IOTPFieldProps> = ({
    className,
    size = "large",
    value: controlledValue,
    defaultValue = "",
    disabled = false,
    status = "rest",
    helperText,
    timerDuration,
    onTimerExpire,
    notification,
    onChange,
    onComplete,
    onFocus,
    onBlur,
    autoFocus = false
}) => {
    const isControlled = controlledValue !== undefined;

    const [internalDigits, setInternalDigits] = useState<string[]>(() =>
        stringToDigits(isControlled ? controlledValue : defaultValue)
    );

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const lastEmittedValue = useRef<string>(isControlled ? String(controlledValue ?? "") : "");

    // Refs for handler stability — handlers read the latest values without re-creating.
    const digitsRef = useRef<string[]>([]);
    const onChangeRef = useRef(onChange);
    const onCompleteRef = useRef(onComplete);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);

    onChangeRef.current = onChange;
    onCompleteRef.current = onComplete;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;

    useEffect(() => {
        if (isControlled && String(controlledValue) !== lastEmittedValue.current) {
            setInternalDigits(stringToDigits(controlledValue));
        }
    }, [controlledValue, isControlled]);

    const digits = useMemo(() => normalizeDigitsLength(internalDigits), [internalDigits]);
    digitsRef.current = digits;

    const htSize = helperTextSizeMap[size];

    const { formatted: timerFormatted } = useCountdown({
        duration: timerDuration ?? 0,
        onExpire: onTimerExpire
    });

    const showTimer = timerDuration !== undefined && timerDuration > 0;

    const emitValueChange = useCallback((nextDigits: string[]) => {
        const normalized = normalizeDigitsLength(nextDigits);
        const nextValue = digitsToString(normalized);

        lastEmittedValue.current = nextValue;
        setInternalDigits(normalized);

        onChangeRef.current?.(nextValue);

        if (nextValue.length === OTP_LENGTH) {
            onCompleteRef.current?.(nextValue);
        }
    }, []);

    const focusInput = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(index, OTP_LENGTH - 1));
        inputRefs.current[clamped]?.focus();
    }, []);

    useEffect(() => {
        if (autoFocus && !disabled) {
            focusInput(0);
        }
    }, [autoFocus, disabled, focusInput]);

    const handleInputFocus = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            if (!disabled) {
                event.currentTarget.select();
            }

            onFocusRef.current?.(event);
        },
        [disabled]
    );

    const handleInputClick = useCallback(
        (event: React.MouseEvent<HTMLInputElement>) => {
            if (!disabled) {
                event.currentTarget.select();
            }
        },
        [disabled]
    );

    const handleInputBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
        onBlurRef.current?.(event);
    }, []);

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;

            const index = Number(event.currentTarget.dataset.index);
            const inputValue = event.target.value;
            const nextDigits = [...digitsRef.current];

            if (inputValue === "") {
                nextDigits[index] = "";
                emitValueChange(nextDigits);
                return;
            }

            const digit = inputValue.slice(-1);
            if (!DIGIT_PATTERN.test(digit)) return;

            nextDigits[index] = digit;
            emitValueChange(nextDigits);

            if (index < OTP_LENGTH - 1) {
                focusInput(index + 1);
            }
        },
        [disabled, emitValueChange, focusInput]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (disabled) return;

            const index = Number(event.currentTarget.dataset.index);

            if (event.key === "Backspace") {
                event.preventDefault();

                const nextDigits = [...digitsRef.current];

                if (nextDigits[index]) {
                    nextDigits[index] = "";
                    emitValueChange(nextDigits);
                } else if (index > 0) {
                    nextDigits[index - 1] = "";
                    emitValueChange(nextDigits);
                    focusInput(index - 1);
                }
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusInput(index - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                focusInput(index + 1);
            }
        },
        [disabled, emitValueChange, focusInput]
    );

    const handlePaste = useCallback(
        (event: ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (disabled) return;

            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
            const nextDigits = [...digitsRef.current];

            for (let i = 0; i < OTP_LENGTH && i < pasted.length; i += 1) {
                nextDigits[i] = pasted[i];
            }

            emitValueChange(nextDigits);
            const lastIndex = Math.min(pasted.length - 1, OTP_LENGTH - 1);

            if (lastIndex >= 0) {
                focusInput(lastIndex);
            }
        },
        [disabled, emitValueChange, focusInput]
    );

    const refCallbacks = useMemo(
        () =>
            Array.from({ length: OTP_LENGTH }, (_, i) => (el: HTMLInputElement | null) => {
                inputRefs.current[i] = el;
            }),
        []
    );

    const showNotification = status === "error" && !!notification;

    return (
        <div className={classNames("otpField", `otpField_size_${size}`, className)}>
            <div className="otpField__wrapper">
                <div
                    className="otpField__textFieldWrapper"
                    role="group"
                    aria-label="One-time password"
                    aria-invalid={status === "error" || undefined}
                    onPaste={handlePaste}
                >
                    {OTP_INDICES.map((index) => (
                        <OTPFieldInput
                            key={index}
                            ref={refCallbacks[index]}
                            index={index}
                            className="otpField__textField"
                            size={size}
                            value={digits[index] ?? ""}
                            disabled={disabled}
                            status={status}
                            autoComplete={index === 0 ? "one-time-code" : "off"}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onClick={handleInputClick}
                            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                        />
                    ))}
                </div>
                {(helperText || showTimer) && (
                    <div className="otpField__content">
                        {helperText && (
                            <HelperText
                                className="otpField__helperText"
                                text={helperText}
                                disabled={disabled}
                                size={htSize}
                            />
                        )}
                        {showTimer && (
                            <Text
                                className={classNames("otpField__timer", {
                                    otpField__timer_disabled: disabled
                                })}
                                as="span"
                                variant="bodyMediumMedium"
                            >
                                {timerFormatted}
                            </Text>
                        )}
                    </div>
                )}
            </div>
            {showNotification && (
                <Notification variant="sectionMessage" open status="error" description={notification} />
            )}
        </div>
    );
};

export { IOTPFieldProps, OTPField as default };
