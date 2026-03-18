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
import OTPFieldInput, { IOTPFieldInputProps } from "@components/molecules/OTPField/OTPFieldInput/OTPFieldInput";

// Styles
import "./OTPField.scss";

const DIGIT_PATTERN = /^\d$/;

const helperTextSizeMap = {
    large: "medium",
    medium: "medium"
} as const;

const createEmptyDigits = (length: number): string[] => {
    return Array.from({ length }, () => "");
};

const normalizeDigitsLength = (digits: string[], length: number): string[] => {
    if (digits.length === length) return digits;

    if (digits.length > length) {
        return digits.slice(0, length);
    }

    return [...digits, ...createEmptyDigits(length - digits.length)];
};

const stringToDigits = (value: string | undefined, length: number): string[] => {
    const digits = createEmptyDigits(length);
    if (!value) return digits;

    const onlyDigits = value.replace(/\D/g, "");

    for (let i = 0; i < length && i < onlyDigits.length; i += 1) {
        digits[i] = onlyDigits[i];
    }

    return digits;
};

const digitsToString = (digits: string[]): string => {
    return digits.join("");
};

interface IOTPFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Number of OTP digit inputs.<br>
     * Default is `6`.
     */
    length?: number;
    /**
     * Size of the OTP input boxes.<br>
     * Possible values: `large | medium`.
     */
    size?: IOTPFieldInputProps["size"];
    /**
     * Controlled value. Each character maps to one digit input.
     */
    value?: string;
    /**
     * Default value for uncontrolled usage.
     */
    defaultValue?: string;
    /**
     * Disables the OTP field, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Determines the input appearance based on its status.<br>
     * Possible values: `rest | error`.
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
}

/**
 * The OTP Field component is an input field designed for entering a one-time password, often used for multi-factor authentication. The OTP Field component ensures that applications can securely verify user actions and identities, thereby protecting against unauthorized access and enhancing overall security.
 */
const OTPField: FC<IOTPFieldProps> = ({
    className,
    length = 6,
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
    onBlur
}) => {
    const isControlled = controlledValue !== undefined;

    const [internalDigits, setInternalDigits] = useState<string[]>(() =>
        stringToDigits(isControlled ? controlledValue : defaultValue, length)
    );

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const lastEmittedValue = useRef<string>(isControlled ? (controlledValue ?? "") : "");

    useEffect(() => {
        if (isControlled && controlledValue !== lastEmittedValue.current) {
            setInternalDigits(stringToDigits(controlledValue, length));
        }
    }, [controlledValue, isControlled, length]);

    const digits = useMemo(() => normalizeDigitsLength(internalDigits, length), [internalDigits, length]);

    const htSize = helperTextSizeMap[size];

    const { formatted: timerFormatted } = useCountdown({
        duration: timerDuration ?? 0,
        onExpire: onTimerExpire
    });

    const showTimer = timerDuration !== undefined && timerDuration > 0;

    const emitValueChange = useCallback(
        (nextDigits: string[]) => {
            const normalized = normalizeDigitsLength(nextDigits, length);
            const nextValue = digitsToString(normalized);

            lastEmittedValue.current = nextValue;
            setInternalDigits(normalized);

            onChange?.(nextValue);

            if (nextValue.length === length) {
                onComplete?.(nextValue);
            }
        },
        [length, onChange, onComplete]
    );

    const focusInput = useCallback(
        (index: number) => {
            const clamped = Math.max(0, Math.min(index, length - 1));
            inputRefs.current[clamped]?.focus();
        },
        [length]
    );

    const handleChange = useCallback(
        (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;

            const inputValue = event.target.value;
            const nextDigits = [...digits];

            if (inputValue === "") {
                nextDigits[index] = "";
                emitValueChange(nextDigits);
                return;
            }

            const digit = inputValue.slice(-1);
            if (!DIGIT_PATTERN.test(digit)) return;

            nextDigits[index] = digit;
            emitValueChange(nextDigits);

            if (index < length - 1) {
                focusInput(index + 1);
            }
        },
        [digits, disabled, emitValueChange, focusInput, length]
    );

    const handleKeyDown = useCallback(
        (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
            if (disabled) return;

            if (event.key === "Backspace") {
                event.preventDefault();

                const nextDigits = [...digits];

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
        [digits, disabled, emitValueChange, focusInput]
    );

    const handlePaste = useCallback(
        (event: ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (disabled) return;

            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            const nextDigits = [...digits];

            for (let i = 0; i < length && i < pasted.length; i += 1) {
                nextDigits[i] = pasted[i];
            }

            emitValueChange(nextDigits);
            const lastIndex = Math.min(pasted.length - 1, length - 1);

            if (lastIndex >= 0) {
                focusInput(lastIndex);
            }
        },
        [disabled, digits, emitValueChange, focusInput, length]
    );

    const indices = useMemo(() => Array.from({ length }, (_, i) => i), [length]);

    const showNotification = status === "error" && !!notification;

    return (
        <div className={classNames("otpField", `otpField_size_${size}`, className)}>
            <div className="otpField__wrapper">
                <div
                    className="otpField__textFieldWrapper"
                    role="group"
                    aria-label="One-time password"
                    onPaste={handlePaste}
                >
                    {indices.map((index) => (
                        <OTPFieldInput
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            className="otpField__textField"
                            size={size}
                            value={digits[index] ?? ""}
                            disabled={disabled}
                            status={status}
                            autoComplete={index === 0 ? "one-time-code" : "off"}
                            onChange={handleChange(index)}
                            onKeyDown={handleKeyDown(index)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            aria-label={`Digit ${index + 1} of ${length}`}
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
