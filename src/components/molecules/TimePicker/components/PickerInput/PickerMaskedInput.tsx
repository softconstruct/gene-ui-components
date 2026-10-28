import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, Ref } from "react";
import { InputMask } from "@react-input/mask";
import classNames from "classnames";

// Constants
import { TIME_PICKER_INPUT_MASK_WITH_MERIDIEM } from "../../constants";
// Types
import { TimePickerSizes, TimePickerStatus } from "../../types";
import { IPickerInputBaseProps } from "./types";

interface IPickerMaskedInputProps
    extends Pick<
        IPickerInputBaseProps,
        "name" | "required" | "disabled" | "readOnly" | "mask" | "maskReplacement" | "maskTrack"
    > {
    /**
     * Placeholder value of the input.
     */
    placeholder?: string;
    /**
     * The value of the input.
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
    /**
     * Callback function which triggers when a key is getting pressed.
     * @param event
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    size: TimePickerSizes;
    status: TimePickerStatus;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-controls": string;
    isExpanded: boolean;
}

/**
 * Every input is sized for the longest value it can hold, so the field keeps the same width in both
 * formats and never clips the AM/PM suffix.
 */
const INPUT_SIZE = TIME_PICKER_INPUT_MASK_WITH_MERIDIEM.length + 1;

const PickerMaskedInput: FC<IPickerMaskedInputProps> = ({
    id,
    name,
    value,
    placeholder,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-controls": ariaControls,
    isExpanded,
    size,
    status,
    required,
    disabled,
    readOnly,
    mask,
    maskReplacement,
    maskTrack,
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
        track={maskTrack}
        size={INPUT_SIZE}
        className={classNames("pickerInput__input", `pickerInput__input_size_${size}`)}
        showMask={false}
        placeholder={(disabled && value) || placeholder}
        autoComplete="off"
        value={disabled ? "" : (value ?? "")}
        disabled={disabled}
        readOnly={readOnly}
        separate
        role="combobox"
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        aria-controls={ariaControls}
        aria-invalid={status === "error" || undefined}
        aria-required={required || undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onClick={onClick}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
    />
);

export { IPickerMaskedInputProps, PickerMaskedInput as default };
