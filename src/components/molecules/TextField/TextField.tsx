import React, {
    ChangeEvent,
    FC,
    FocusEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { Eye, EyeOff, IconProps, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

// Styles
import "./TextField.scss";

// Helpers
import { NUMERIC_STRING_PATTERN } from "../../../constants";

// Size mapping objects for Label and HelperText components
const labelSizeMap = {
    large: "medium" as const,
    medium: "medium" as const,
    small: "small" as const
};

const helperTextSizeMap = {
    large: "medium" as const,
    medium: "medium" as const,
    small: "small" as const
};

interface ITextFieldProps {
    /**
     * Additional class for the parent element.
     * This `prop` should be used to set placement properties for the element relative to its parent using `BEM` conventions.
     */
    className?: string;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     *  Displays the `TextField` as `read-only`, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     *  Disables the `TextField`, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     * Marks the `TextField` as a required field. This will apply the `required` attribute
     * to the underlying `<input>` element and can be used for native form validation.
     */
    required?: boolean;
    /**
     * The type of `TextField`.
     * - `text`: Standard text `input`
     * - `number`: Number `input` with text-based validation (allows digits, one '-' at start, one '.' for decimals, no '+' symbol)
     * - `password`: Password `input` with visibility toggle.
     * - default `value` is `text`
     */
    type?: "text" | "number" | "password";
    /**
     * `Label` text displayed above the `input` field.
     */
    label?: string;
    /**
     *  Extra information displayed with the tooltip next to the label for clarity or guidance.
     */
    infoText?: string;
    /**
     * Controlled `input` value
     */
    value?: string | number;
    /**
     * Default value of the `TextField`. Only provide this if the text field is an `uncontrolled` component; otherwise, use the `value` property.
     */
    defaultValue?: string | number;
    /**
     * `Placeholder` text when `input` is empty
     */
    placeholder?: string;
    /**
     * `HTML` `id` attribute for the `input` element
     */
    id?: string;
    /**
     * `HTML` `name` attribute for the `input` element
     */
    name?: string;
    /**
     * `Controls the HTML autocomplete attribute for the input field. This helps browsers offer autofill suggestions based on user data and context.
     *  Use HTML default values like "on" or "off", "email", "username", etc.
     *  Default value is "on".
     *  Always match name and autoComplete attributes for best browser support.
     *  Possible values: "on" | "off" | string
     */
    autoComplete?: "on" | "off" | string;
    /**
     * If true, the input element will automatically receive focus when the component mounts.
     *  Default value is `false`.
     */
    autoFocus?: boolean;
    /**
     * Helper text to provide context or explain any errors, warnings related to the input.
     */
    helperText?: string;
    /**
     * Callback triggered when `input` value changes.
     * event - React change event with input details
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Callback triggered when input receives focus.
     * event - React focus event
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback triggered when input loses focus.
     * event - React blur event
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * The `IconBefore` prop accepts a React Functional Component that will be displayed alongside the `TextField`.
     */
    IconBefore?: FC<IconProps>; // startIcon
    /**
     * When `true`, shows a `clear button` to reset the `input` value.
     * default value is `false`
     */
    clearable?: boolean;
    /**
     * - Maximum allowed characters counter.
     */
    characterLimit?: number;
    /**
     *  Determines the input appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     *  Callback fired after the Clear (“×”) button is pressed.
     *  Use it when the parent component needs to react to a manual reset.
     *
     */
    onClear?: () => void;
    /**
     * Hints the browser which type of virtual keyboard to display on mobile devices.
     * For example, `numeric` shows a number pad, `email` shows the `@` symbol, etc.
     *
     * Default is `"text"`, but overridden to `"numeric"` when `numericOnly` is true.
     *
     * Possible values:
     * `"numeric" | "decimal" | "tel" | "text" | "search" | "email" | "url"`
     */
    inputMode?: "numeric" | "decimal" | "tel" | "text" | "search" | "email" | "url";
}

export interface ITextFieldRef {
    focus: () => void;
    getInputRef: () => HTMLInputElement | null;
}

/**
 * Text field is an input element in a user interface where users can enter and edit text. Text fields are commonly used in forms for collecting user data such as names, email addresses, and messages.
 */
const TextField = forwardRef<ITextFieldRef, ITextFieldProps>(
    (
        {
            id,
            name,
            type = "text",
            size = "large",
            defaultValue,
            value,
            placeholder,
            IconBefore,
            onChange,
            onFocus,
            onBlur,
            readOnly,
            disabled,
            required,
            label,
            infoText,
            clearable,
            characterLimit,
            className,
            autoComplete = "on",
            autoFocus,
            helperText,
            status = "rest",
            onClear,
            inputMode = "text"
        },
        ref
    ) => {
        const isControlled = value !== undefined;
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [internalValue, setInternalValue] = useState("");
        const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
        const [paddingClassesForIcon, setPaddingClassesForIcon] = useState<string>("");
        const inputValue = isControlled ? value.toString() : internalValue;
        const generatedId = useMemo(() => id || `default-id-${nanoid()}`, [id]);

        const labelSize = labelSizeMap[size] || "medium";
        const helperTextSize = helperTextSizeMap[size] || "medium";

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const { value: currentValue } = event.target;

            if (type === "number" && currentValue !== "" && !NUMERIC_STRING_PATTERN.test(currentValue)) {
                return;
            }

            onChange?.({
                ...event,
                target: {
                    ...event.target,
                    value: currentValue
                }
            });

            if (!isControlled) {
                setInternalValue(currentValue);
            }
        };

        const handleClear = () => {
            const refSnapshot = inputRef.current;
            if (!refSnapshot) return;

            if (!isControlled) setInternalValue("");

            refSnapshot.focus();
            onClear?.();
        };

        const onInputFocus = (event: FocusEvent<HTMLInputElement>) => {
            onFocus?.(event);
        };

        useImperativeHandle(ref, () => ({
            focus: () => {
                inputRef.current?.focus();
            },
            getInputRef: () => inputRef.current
        }));

        const showPasswordToggle = () => setIsPasswordVisible((prev) => !prev);

        useEffect(() => {
            if (defaultValue === undefined) return;
            setInternalValue(defaultValue.toString());
        }, []);

        useEffect(() => {
            const iconAfter = type === "password" || (clearable && inputValue.length > 0 && !disabled && !readOnly);
            if (IconBefore && iconAfter) {
                setPaddingClassesForIcon("textField__wrapper_withIcons");
            } else if (IconBefore) {
                setPaddingClassesForIcon("textField__wrapper_iconBefore");
            } else if (iconAfter) {
                setPaddingClassesForIcon("textField__wrapper_iconAfter");
            }
        }, [IconBefore, type, clearable, inputValue, disabled, readOnly]);

        const isClearable = clearable && inputValue.length > 0 && !disabled && !readOnly;
        const isPassword = type === "password" && inputValue.length > 0 && !readOnly && !disabled;

        const inputConditionalProps = {
            placeholder,
            autoFocus,
            inputMode: type === "number" ? "numeric" : inputMode,
            type: isPasswordVisible || type === "number" ? "text" : type
        };

        return (
            <div className={classNames("textField", className)}>
                <Label
                    text={label}
                    required={required}
                    className="textField__label"
                    disabled={disabled}
                    infoText={infoText}
                    readOnly={readOnly}
                    labelFor={generatedId}
                    size={labelSize}
                />
                <div
                    className={classNames(`textField__wrapper textField__wrapper_size_${size}`, paddingClassesForIcon, {
                        textField__wrapper_readOnly: readOnly && !disabled,
                        textField__wrapper_disabled: disabled,
                        textField__wrapper_error: status === "error"
                    })}
                >
                    {IconBefore && (
                        <span className="textField__icon">
                            <IconBefore size={size === "small" ? 20 : 24} />
                        </span>
                    )}
                    <input
                        id={generatedId}
                        autoComplete={autoComplete}
                        name={name || type}
                        ref={inputRef}
                        className="textField__input"
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={onBlur}
                        onFocus={onInputFocus}
                        aria-invalid={status === "error"}
                        aria-required={required}
                        {...inputConditionalProps}
                    />
                    {(isClearable || isPassword) && (
                        <span className="textField__actions">
                            {isClearable && (
                                <Button
                                    Icon={X}
                                    appearance="secondary"
                                    size={size === "small" ? "smallNudge" : "small"}
                                    layout="text"
                                    disabled={disabled}
                                    onClick={handleClear}
                                />
                            )}
                            {isPassword && (
                                <Button
                                    Icon={isPasswordVisible ? Eye : EyeOff}
                                    appearance="secondary"
                                    size={size === "small" ? "smallNudge" : "small"}
                                    layout="text"
                                    disabled={disabled}
                                    onClick={showPasswordToggle}
                                />
                            )}
                        </span>
                    )}
                </div>
                {(helperText || characterLimit) && (
                    <div className="textField__info">
                        {helperText && (
                            <HelperText text={helperText} disabled={disabled} status={status} size={helperTextSize} />
                        )}
                        {characterLimit && (
                            <Text
                                as="span"
                                className={classNames(
                                    `textField__characterLimit textField__characterLimit_size_${helperTextSize}`,
                                    {
                                        textField__characterLimit_disabled: disabled
                                    }
                                )}
                            >{`${inputValue.length} / ${characterLimit}`}</Text>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export { ITextFieldProps, TextField as default };
