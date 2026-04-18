import React, { ComponentProps, FC, HTMLAttributes, ReactNode } from "react";
import { InputMask } from "@react-input/mask";
import classNames from "classnames";

// Icons
import { IconProps, Minus, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
import { TimePickerSizes } from "@components/molecules/TimePicker/types";

// Styles
import "./PickerInput.scss";

type InputMaskProps = ComponentProps<typeof InputMask>;
type PickerInputOnClick = NonNullable<InputMaskProps["onClick"]>;
type PickerInputOnChange = NonNullable<InputMaskProps["onChange"]>;

interface IPickerShellProps {
    /**
     * ClassName for picker input wrapper.
     */
    className?: string;
    /**
     * The mode of the input field.
     * @default "single"
     */
    mode?: "single" | "range";
    /**
     * The size of the input field.
     * @default "medium"
     */
    size?: TimePickerSizes;
    /**
     * The input component.
     */
    children: ReactNode;
    /**
     * Whether the field should be displayed in an errored state.
     */
    error?: boolean;
    /**
     * Error message used to display when the component is in the errored state.
     */
    errorMessage?: string;
    /**
     * Whether the field should be displayed.
     */
    disabled?: boolean;
    /**
     * Whether the field should be read-only.
     */
    readOnly?: boolean;
    /**
     * Icon to display at the end of the input field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * Callback function which triggers when the user clicks on a clear button.
     */
    handleClear?: () => void;
    /**
     * Condition when the clear button should be visible.
     */
    shouldShowClearableIcon?: boolean;
    /**
     * Reference data of popover, used for positioning the popover accordingly to input field.
     */
    popoverRefData?: HTMLAttributes<HTMLDivElement>;
}

interface IPickerInputBaseProps {
    /**
     * ClassName for picker input wrapper.
     */
    className?: string;
    /**
     * The size of the input field.
     * @default "medium"
     */
    size?: TimePickerSizes;
    /**
     * Whether the field should be displayed in an errored state.
     */
    error?: boolean;
    /**
     * Error message used to display when the component is in the errored state.
     */
    errorMessage?: string;
    /**
     * Whether the field should be displayed.
     */
    disabled?: boolean;
    /**
     * Whether the field should be read-only.
     */
    readOnly?: boolean;
    /**
     * Icon to display at the end of the input field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * The mask of the input field.
     */
    mask?: string;
    /**
     * Callback function which triggers when field is getting focused.
     */
    onFocus?: () => void;
    /**
     * Callback function which triggers when the user changes the value of the input.
     */
    onChange?: PickerInputOnChange;
    /**
     * Callback function which triggers when the field value is getting cleared with the clear button.
     */
    onClear?: () => void;
    /**
     * Callback function which triggers when the field is getting clicked.
     */
    onClick?: PickerInputOnClick;
    /**
     * Reference data of popover, used for positioning the popover accordingly to the input field.
     */
    popoverRefData?: HTMLAttributes<HTMLDivElement>;
    /**
     * Whether the field should display a clear button to clear the input value.
     */
    clearable?: boolean;
}

interface ISinglePickerInputProps extends IPickerInputBaseProps {
    /**
     * Placeholder value of single input picker.
     */
    placeholder?: string;
    /**
     * The value of a single input picker.
     */
    value?: string | null;
}

interface IRangePickerInputProps extends IPickerInputBaseProps {
    /**
     * Placeholder values of range input picker.
     */
    placeholder?: {
        start?: string;
        end?: string;
    };
    /**
     * The values of the range input picker.
     */
    value?: {
        start?: string | null;
        end?: string | null;
    };
}

const PickerShell: FC<IPickerShellProps> = ({
    className,
    mode,
    size = "medium",
    children,
    error,
    errorMessage,
    disabled,
    readOnly,
    EndIcon,
    handleClear,
    shouldShowClearableIcon,
    popoverRefData
}) => {
    const shouldShowIconAppends = shouldShowClearableIcon || EndIcon;
    return (
        <>
            <div
                className={classNames("pickerInput", className, `pickerInput_mode_${mode}`, {
                    pickerInput_state_error: error,
                    pickerInput_state_disabled: disabled,
                    pickerInput_state_readOnly: readOnly,
                    [`pickerInput_size_${size}`]: size
                })}
                {...popoverRefData}
            >
                {children}
                {shouldShowIconAppends && (
                    <div className="pickerInput__append">
                        {shouldShowClearableIcon && (
                            <Button
                                onClick={handleClear}
                                Icon={X}
                                appearance="secondary"
                                aria-label="Clear time selection"
                                size={size}
                                layout="text"
                            />
                        )}
                        {EndIcon && <EndIcon size={20} className="pickerInput__icon" aria-hidden="true" />}
                    </div>
                )}
            </div>
            {errorMessage && (
                <HelperText size="medium" text={errorMessage} status="error" className="pickerInput__errorMessage" />
            )}
        </>
    );
};

const SinglePickerInput: FC<ISinglePickerInputProps> = ({
    className,
    size = "medium",
    error,
    disabled,
    readOnly,
    EndIcon,
    errorMessage,
    onClear,
    clearable,
    value,
    placeholder,
    onClick,
    onChange,
    onFocus,
    mask = "__:__:__",
    popoverRefData
}) => {
    const shouldShowClearableIcon = clearable && value && !disabled && !readOnly;
    return (
        <PickerShell
            error={error}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
            mode="single"
            size={size}
            EndIcon={EndIcon}
            errorMessage={errorMessage}
            handleClear={onClear}
            shouldShowClearableIcon={!!shouldShowClearableIcon}
            popoverRefData={popoverRefData}
        >
            <InputMask
                mask={mask}
                replacement={{ _: /[0-9]/ }}
                className={classNames("pickerInput__input", {
                    [`pickerInput__input_size_${size}`]: size
                })}
                showMask={false}
                placeholder={placeholder}
                autoComplete="off"
                value={value ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                separate
                onClick={onClick}
                onChange={onChange}
                onFocus={onFocus}
            />
        </PickerShell>
    );
};

const RangePickerInput: FC<IRangePickerInputProps> = ({
    className,
    size = "medium",
    error,
    disabled,
    readOnly,
    EndIcon,
    errorMessage,
    onClear,
    clearable,
    value,
    placeholder,
    mask = "__:__:__",
    onClick,
    onFocus,
    onChange,
    popoverRefData
}) => {
    const shouldShowClearableIcon = clearable && (value?.start || value?.end) && !disabled && !readOnly;
    return (
        <PickerShell
            error={error}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
            mode="range"
            size={size}
            EndIcon={EndIcon}
            errorMessage={errorMessage}
            handleClear={onClear}
            shouldShowClearableIcon={!!shouldShowClearableIcon}
            popoverRefData={popoverRefData}
        >
            <InputMask
                mask={mask}
                replacement={{ _: /[0-9]/ }}
                className={classNames("pickerInput__input", {
                    [`pickerInput__input_size_${size}`]: size
                })}
                showMask={false}
                placeholder={placeholder?.start}
                autoComplete="off"
                value={value?.start ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                separate
                onClick={() => onClick("start")}
                onChange={(e) => onChange(e, "start")}
                onFocus={onFocus}
            />
            <Minus className="pickerInput__icon" size={16} aria-hidden="true" />
            <InputMask
                mask={mask}
                replacement={{ _: /[0-9]/ }}
                className={classNames("pickerInput__input", {
                    [`pickerInput__input_size_${size}`]: size
                })}
                showMask={false}
                placeholder={placeholder?.end}
                autoComplete="off"
                value={value?.end ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                separate
                onClick={() => onClick("end")}
                onChange={(e) => onChange(e, "end")}
                onFocus={onFocus}
            />
        </PickerShell>
    );
};

const PickerInput = Object.assign(SinglePickerInput, {
    Range: RangePickerInput
});

export default PickerInput;
