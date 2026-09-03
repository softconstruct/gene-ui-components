import React, { ChangeEvent, FC, FocusEvent, HTMLAttributes, KeyboardEvent, ReactNode, Ref } from "react";
import { InputMask } from "@react-input/mask";
import classNames from "classnames";

// Icons
import { IconProps, Minus, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";

// Styles
import "./PickerInput.scss";

// Constants
import { helperTextSizeMap, pickerShellIconSizeMap } from "../../constants";
// Types
import { TimePickerRangeFields, TimePickerSizes, TimePickerStatus } from "../../types";

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
     * Validation state of the field.
     * @default "rest"
     */
    status?: TimePickerStatus;
    /**
     * Helper text rendered below the field, styled according to `status`.
     */
    helperText?: string;
    /**
     * `id` of the helper text, referenced by the inputs through `aria-describedby`.
     */
    helperTextId: string;
    /**
     * Whether the field should be displayed as disabled.
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
     * Accessible label of the clear button.
     */
    clearLabel: string;
    /**
     * Reference data of popover, used for positioning the popover accordingly to the input field.
     */
    popoverRefData?: HTMLAttributes<HTMLDivElement>;
}

interface IPickerMaskedInputProps {
    /**
     * ID used to tie the input field to a label.
     */
    id: string;
    /**
     * `HTML` `name` attribute for the `input` element.
     */
    name?: string;
    /**
     * The value of the input field.
     */
    value?: string | null;
    /**
     * The placeholder text displayed when the input field is empty.
     */
    placeholder?: string;
    /**
     * Accessible label, used when there is no visible label tied to this input
     * (the range picker shares a single label between two inputs).
     */
    ariaLabel?: string;
    /**
     * `id` of the helper text describing the field.
     */
    describedBy?: string;
    /**
     * `id` of the popover controlled by this input.
     */
    controls: string;
    /**
     * Whether the popover is currently expanded.
     */
    isExpanded: boolean;
    /**
     * The size of the input field.
     * @default "medium"
     */
    size?: TimePickerSizes;
    /**
     * Validation state of the field.
     * @default "rest"
     */
    status?: TimePickerStatus;
    /**
     * Whether the field is mandatory.
     */
    required?: boolean;
    /**
     * Whether the field should be displayed as disabled.
     */
    disabled?: boolean;
    /**
     * Whether the field should be read-only.
     */
    readOnly?: boolean;
    /**
     * The mask of the input field.
     */
    mask: string;
    /**
     * Per slot regular expressions the mask placeholders are validated against.
     */
    maskReplacement: Record<string, RegExp>;
    /**
     * Reference to the input element.
     */
    inputRef?: Ref<HTMLInputElement>;
    /**
     * Callback function which triggers when the field is getting clicked.
     */
    onClick?: () => void;
    /**
     * Callback function which triggers when the field value is getting changed.
     * @param event
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when the field is getting focused.
     * @param event
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when the field is getting blurred.
     * @param event
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when a key is getting pressed.
     * @param event
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
     * Validation state of the field.
     * @default "rest"
     */
    status?: TimePickerStatus;
    /**
     * Helper text rendered below the field.
     */
    helperText?: string;
    /**
     * Whether the field should be displayed as disabled.
     */
    disabled?: boolean;
    /**
     * Whether the field should be read-only.
     */
    readOnly?: boolean;
    /**
     * Whether the field is mandatory.
     */
    required?: boolean;
    /**
     * Icon to display at the end of the input field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * The mask of the input field.
     */
    mask: string;
    /**
     * Per slot regular expressions the mask placeholders are validated against.
     */
    maskReplacement: Record<string, RegExp>;
    /**
     * Callback function which triggers when the field value is getting cleared with the clear button.
     */
    onClear?: () => void;
    /**
     * Accessible label of the clear button.
     */
    clearLabel: string;
    /**
     * Reference data of popover, used for positioning the popover accordingly to the input field.
     */
    popoverRefData?: HTMLAttributes<HTMLDivElement>;
    /**
     * Whether the field should display a clear button to clear the input value.
     */
    clearable?: boolean;
    /**
     * Used for accessibility, determines whether the picker popover is open/expanded.
     */
    isExpanded: boolean;
    /**
     * `id` of the popover controlled by the input(s).
     */
    popoverId: string;
    /**
     * `HTML` `name` attribute for the `input` element.
     */
    name?: string;
    /**
     * Callback function which triggers when a key is getting pressed.
     * @param event
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
    /**
     * ID used to tie the input field to a label.
     */
    id: string;
    /**
     * Reference to the input element.
     */
    inputRef?: Ref<HTMLInputElement>;
    /**
     * Callback function which triggers when the field is getting clicked.
     */
    onClick?: () => void;
    /**
     * Callback function which triggers when the field value is getting changed.
     * @param event
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when the field is getting focused.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when the field is getting blurred.
     * @param event
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

interface IRangePickerInputProps extends Omit<IPickerInputBaseProps, "onKeyDown"> {
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
    /**
     * IDs used to tie the input fields to the label.
     */
    ids: {
        start: string;
        end: string;
    };
    /**
     * Accessible labels of the two inputs, since a single visible label is shared between them.
     */
    labels: {
        start: string;
        end: string;
    };
    /**
     * References to the input elements.
     */
    inputRefs: {
        start: Ref<HTMLInputElement>;
        end: Ref<HTMLInputElement>;
    };
    /**
     * Callback function which triggers when one of the fields is getting clicked.
     * @param field - The field that was clicked.
     */
    onClick: (field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers when one of the fields value is getting changed.
     * @param event
     * @param field
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers when one of the fields is getting focused.
     * @param event
     * @param field
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers when one of the fields is getting blurred.
     * @param event
     * @param field
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers when a key is getting pressed.
     * @param event
     * @param field
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
}

const PickerMaskedInput: FC<IPickerMaskedInputProps> = ({
    id,
    name,
    value,
    placeholder,
    ariaLabel,
    describedBy,
    controls,
    isExpanded,
    size = "medium",
    status,
    required,
    disabled,
    readOnly,
    mask,
    maskReplacement,
    inputRef,
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyDown
}) => (
    <InputMask
        id={id}
        name={name}
        ref={inputRef}
        mask={mask}
        replacement={maskReplacement}
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
        role="combobox"
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        aria-controls={controls}
        aria-invalid={status === "error" || undefined}
        aria-required={required || undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        onClick={onClick}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
    />
);

const PickerShell: FC<IPickerShellProps> = ({
    className,
    mode = "single",
    size = "medium",
    children,
    status = "rest",
    helperText,
    helperTextId,
    disabled,
    readOnly,
    EndIcon,
    handleClear,
    shouldShowClearableIcon,
    clearLabel,
    popoverRefData
}) => {
    const shouldShowIconAppends = shouldShowClearableIcon || EndIcon;

    return (
        <>
            <div
                className={classNames("pickerInput", className, `pickerInput_mode_${mode}`, {
                    pickerInput_state_error: status === "error",
                    pickerInput_state_warning: status === "warning",
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
                                aria-label={clearLabel}
                                size={pickerShellIconSizeMap[size]}
                                layout="text"
                            />
                        )}
                        {EndIcon && <EndIcon size={20} className="pickerInput__icon" aria-hidden="true" />}
                    </div>
                )}
            </div>
            {helperText && (
                <div id={helperTextId}>
                    <HelperText
                        size={helperTextSizeMap[size]}
                        text={helperText}
                        status={status}
                        disabled={disabled}
                        className="pickerInput__errorMessage"
                    />
                </div>
            )}
        </>
    );
};

const SinglePickerInput: FC<ISinglePickerInputProps> = ({
    className,
    size = "medium",
    status = "rest",
    helperText,
    disabled,
    readOnly,
    required,
    EndIcon,
    onClear,
    clearable,
    clearLabel,
    value,
    placeholder,
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    mask,
    maskReplacement,
    popoverRefData,
    id,
    name,
    inputRef,
    isExpanded,
    popoverId
}) => {
    const shouldShowClearableIcon = !!(clearable && value && !disabled && !readOnly);
    const helperTextId = `${id}-helper-text`;

    return (
        <PickerShell
            status={status}
            helperText={helperText}
            helperTextId={helperTextId}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
            mode="single"
            size={size}
            EndIcon={EndIcon}
            handleClear={onClear}
            shouldShowClearableIcon={shouldShowClearableIcon}
            clearLabel={clearLabel}
            popoverRefData={popoverRefData}
        >
            <PickerMaskedInput
                id={id}
                name={name}
                inputRef={inputRef}
                value={value}
                placeholder={placeholder}
                describedBy={helperText ? helperTextId : undefined}
                controls={popoverId}
                isExpanded={isExpanded}
                size={size}
                status={status}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                mask={mask}
                maskReplacement={maskReplacement}
                onClick={onClick}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
        </PickerShell>
    );
};

const RangePickerInput: FC<IRangePickerInputProps> = ({
    className,
    size = "medium",
    status = "rest",
    helperText,
    disabled,
    readOnly,
    required,
    EndIcon,
    onClear,
    clearable,
    clearLabel,
    value,
    placeholder,
    mask,
    maskReplacement,
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    popoverRefData,
    ids,
    labels,
    inputRefs,
    name,
    isExpanded,
    popoverId
}) => {
    const shouldShowClearableIcon = !!(clearable && (value?.start || value?.end) && !disabled && !readOnly);
    const helperTextId = `${ids.start}-helper-text`;
    const describedBy = helperText ? helperTextId : undefined;

    return (
        <PickerShell
            status={status}
            helperText={helperText}
            helperTextId={helperTextId}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
            mode="range"
            size={size}
            EndIcon={EndIcon}
            handleClear={onClear}
            shouldShowClearableIcon={shouldShowClearableIcon}
            clearLabel={clearLabel}
            popoverRefData={popoverRefData}
        >
            <PickerMaskedInput
                id={ids.start}
                name={name && `${name}-start`}
                inputRef={inputRefs.start}
                value={value?.start}
                placeholder={placeholder?.start}
                ariaLabel={labels.start}
                describedBy={describedBy}
                controls={popoverId}
                isExpanded={isExpanded}
                size={size}
                status={status}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                mask={mask}
                maskReplacement={maskReplacement}
                onClick={() => onClick("start")}
                onChange={(event) => onChange?.(event, "start")}
                onFocus={(event) => onFocus?.(event, "start")}
                onBlur={(event) => onBlur?.(event, "start")}
                onKeyDown={(event) => onKeyDown?.(event, "start")}
            />
            <Minus className="pickerInput__icon" size={16} aria-hidden="true" />
            <PickerMaskedInput
                id={ids.end}
                name={name && `${name}-end`}
                inputRef={inputRefs.end}
                value={value?.end}
                placeholder={placeholder?.end}
                ariaLabel={labels.end}
                describedBy={describedBy}
                controls={popoverId}
                isExpanded={isExpanded}
                size={size}
                status={status}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                mask={mask}
                maskReplacement={maskReplacement}
                onClick={() => onClick("end")}
                onChange={(event) => onChange?.(event, "end")}
                onFocus={(event) => onFocus?.(event, "end")}
                onBlur={(event) => onBlur?.(event, "end")}
                onKeyDown={(event) => onKeyDown?.(event, "end")}
            />
        </PickerShell>
    );
};

const PickerInput = Object.assign(SinglePickerInput, {
    Range: RangePickerInput
});

export default PickerInput;
