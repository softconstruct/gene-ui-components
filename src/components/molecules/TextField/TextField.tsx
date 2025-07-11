import React, {
    ChangeEvent,
    FC,
    FocusEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import classNames from "classnames";

import { Eye, EyeOff, IconProps, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

// Styles
import "./TextField.scss";

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
     * - `password`: Password `input` with visibility toggle.
     * - default `value` is `text`
     */
    type?: "text" | "password";
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
    value?: string;
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
     * `validationStatus` object for validation feedback.
     * - `type`: Visual state ("warning" | "error")
     * - `text`: Message to display
     */
    validationStatus?: {
        type: "warning" | "error";
        text: string;
    }; // todo: need investigation
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
     * Configuration for maximum character limit:
     * - `length`: Maximum allowed characters
     * - `text`: Custom error message when limit is exceeded
     *            (default: "Exceeds max length {length}")
     * - The max length validation message takes priority over the standard status error message when both are present.
     */
    characterLimit?: {
        length: number;
        text?: string;
    };
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
            validationStatus,
            clearable,
            characterLimit,
            className,
            autoComplete = "on",
            autoFocus = false
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [inputValue, setInputValue] = useState("");
        const [limitErrorMessage, setLimitErrorMessage] = useState<string | undefined>();
        const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const { value: currentValue } = event.target;
            setInputValue(currentValue);
            onChange?.(event);
        };

        const handleClear = () => {
            if (!inputRef?.current) {
                return;
            }

            setInputValue("");
            inputRef.current?.focus();
        };

        const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
            onBlur?.(event);
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

        useEffect(() => {
            setInputValue(value || "");
        }, [value]);

        useEffect(() => {
            if (!inputValue.length) {
                if (limitErrorMessage) setLimitErrorMessage(undefined);
                return;
            }

            if (characterLimit && inputValue.length > characterLimit?.length) {
                setLimitErrorMessage(characterLimit?.text || `Exceeds max length ${characterLimit?.length}`);
                return;
            }

            if (limitErrorMessage) setLimitErrorMessage(undefined);
        }, [inputValue, characterLimit]);

        const showPasswordToggle = () => setIsPasswordVisible((prev) => !prev);

        return (
            <div className={classNames("textField", className)}>
                <Label
                    text={label}
                    required={required}
                    className="textField__label"
                    disabled={disabled}
                    infoText={infoText}
                >
                    <div
                        className={classNames(
                            `textField__wrapper textField__wrapper_size_${size} textField__wrapper_withIcons`,
                            {
                                textField__wrapper_readOnly: readOnly,
                                textField__wrapper_disabled: disabled,
                                textField__wrapper_error: validationStatus?.type === "error" || limitErrorMessage
                            }
                        )}
                    >
                        {IconBefore && (
                            <span className="textField__icon">
                                <IconBefore size={size === "small" ? 20 : 24} />
                            </span>
                        )}
                        <input
                            {...(id && { id })}
                            {...(placeholder && { placeholder })}
                            {...(autoFocus && { autoFocus })}
                            {...(autoComplete !== "off" && { autoComplete })}
                            name={name || type}
                            ref={inputRef}
                            className="textField__input"
                            type={isPasswordVisible ? "text" : type}
                            required={required}
                            disabled={disabled}
                            readOnly={readOnly}
                            value={inputValue}
                            onChange={handleChange}
                            onBlur={onInputBlur}
                            onFocus={onInputFocus}
                        />
                        <span className="textField__actions">
                            {clearable && inputValue.length > 0 && !disabled && !readOnly && (
                                <Button
                                    Icon={X}
                                    appearance="secondary"
                                    size={size === "small" ? "smallNudge" : "small"}
                                    layout="text"
                                    disabled={disabled}
                                    onClick={handleClear}
                                />
                            )}
                            {type === "password" && inputValue.length > 0 && (
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
                    </div>
                </Label>
                {(validationStatus || limitErrorMessage || characterLimit) && (
                    <div className="textField__info">
                        {(validationStatus || limitErrorMessage) && (
                            <HelperText
                                text={limitErrorMessage || validationStatus?.text || ""}
                                type={limitErrorMessage ? "error" : validationStatus?.type}
                                disabled={disabled}
                            />
                        )}
                        {characterLimit?.length && (
                            <Text
                                as="span"
                                className={classNames(`textField__info_text`, {
                                    textField__info_text_disabled: disabled
                                })}
                            >{`${inputValue.length} / ${characterLimit.length}`}</Text>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export { ITextFieldProps, TextField as default };
