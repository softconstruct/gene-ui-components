import React, { ChangeEvent, FC, FocusEvent, Fragment, KeyboardEvent, MouseEvent, Ref } from "react";
import classNames from "classnames";

// Icons
import { Minus } from "@geneui/icons";

// Constants
import { PICKER_RANGE_FIELDS } from "../../constants";
// Types
import { TimePickerRangeFields, TimePickerSizes, TimePickerStatus } from "../../types";
// Components
import PickerMaskedInput, { IPickerMaskedInputProps } from "../PickerMaskedInput/PickerMaskedInput";
import PickerShell, { IPickerShellProps } from "../PickerShell/PickerShell";

// Styles
import "./PickerInput.scss";

interface IPickerInputBaseProps
    extends Pick<
            IPickerShellProps,
            | "helperText"
            | "disabled"
            | "readOnly"
            | "Icon"
            | "onClear"
            | "clearLabel"
            | "anchorProps"
            | "anchorRef"
            | "onAreaClick"
            | "onIconClick"
            | "onFocusOut"
        >,
        Pick<
            IPickerMaskedInputProps,
            "name" | "required" | "mask" | "maskReplacement" | "maskTrack" | "inputMode" | "isExpanded"
        > {
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
     * Whether the field should display a clear button to clear the input value.
     */
    clearable?: boolean;
    /**
     * `id` of the popover controlled by the input(s).
     */
    popoverId: string;
}

interface ISinglePickerInputProps
    extends IPickerInputBaseProps,
        Pick<
            IPickerMaskedInputProps,
            "placeholder" | "value" | "id" | "inputRef" | "onClick" | "onChange" | "onFocus" | "onBlur" | "onKeyDown"
        > {}

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

const RANGE_FIELDS = [PICKER_RANGE_FIELDS.START, PICKER_RANGE_FIELDS.END] as const;

/**
 * The separator between the two range inputs is part of the field around them: a press keeps the
 * focus where it is.
 */
const keepFocus = (event: MouseEvent<SVGElement>) => {
    event.preventDefault();
};

/**
 * Splits the props both pickers receive into what the shell renders and what every masked input gets.
 */
const getSharedProps = (
    {
        size = "medium",
        status = "rest",
        helperText,
        disabled,
        readOnly,
        required,
        Icon,
        mask,
        maskReplacement,
        maskTrack,
        inputMode,
        onClear,
        clearLabel,
        anchorProps,
        anchorRef,
        onAreaClick,
        onIconClick,
        onFocusOut,
        isExpanded,
        popoverId
    }: IPickerInputBaseProps,
    helperTextId: string
) => ({
    shell: {
        size,
        status,
        helperText,
        helperTextId,
        disabled,
        readOnly,
        Icon,
        onClear,
        clearLabel,
        anchorProps,
        anchorRef,
        onAreaClick,
        onIconClick,
        onFocusOut
    },
    input: {
        size,
        status,
        required,
        disabled,
        readOnly,
        mask,
        maskReplacement,
        maskTrack,
        inputMode,
        isExpanded,
        "aria-controls": popoverId,
        "aria-describedby": helperText ? helperTextId : undefined
    }
});

const SinglePickerInput: FC<ISinglePickerInputProps> = (props) => {
    const { id, name, value, placeholder, inputRef, onClick, onChange, onFocus, onBlur, onKeyDown } = props;
    const { clearable, disabled, readOnly } = props;
    const { shell, input } = getSharedProps(props, `${id}-helper-text`);

    return (
        <PickerShell {...shell} showClearButton={!!(clearable && value && !disabled && !readOnly)}>
            <PickerMaskedInput
                {...input}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                inputRef={inputRef}
                onClick={onClick}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
        </PickerShell>
    );
};

const RangePickerInput: FC<IRangePickerInputProps> = (props) => {
    const { ids, labels, inputRefs, name, value, placeholder, onClick, onChange, onFocus, onBlur, onKeyDown } = props;
    const { clearable, disabled, readOnly, onAreaClick } = props;
    const { shell, input } = getSharedProps(props, `${ids.start}-helper-text`);
    const hasValue = !!(value?.start || value?.end);

    return (
        <PickerShell {...shell} showClearButton={!!(clearable && hasValue && !disabled && !readOnly)}>
            {RANGE_FIELDS.map((field, index) => (
                <Fragment key={field}>
                    {index > 0 && (
                        <Minus
                            className={classNames("pickerInput__separator", {
                                pickerInput__separator_disabled: disabled
                            })}
                            size={16}
                            aria-hidden="true"
                            onMouseDown={keepFocus}
                            onClick={onAreaClick}
                        />
                    )}
                    <PickerMaskedInput
                        {...input}
                        id={ids[field]}
                        name={name && `${name}-${field}`}
                        value={value?.[field]}
                        placeholder={placeholder?.[field]}
                        aria-label={labels[field]}
                        inputRef={inputRefs[field]}
                        onClick={() => onClick(field)}
                        onChange={(event) => onChange?.(event, field)}
                        onFocus={(event) => onFocus?.(event, field)}
                        onBlur={(event) => onBlur?.(event, field)}
                        onKeyDown={(event) => onKeyDown?.(event, field)}
                    />
                </Fragment>
            ))}
        </PickerShell>
    );
};

const PickerInput = Object.assign(SinglePickerInput, {
    Range: RangePickerInput
});

export default PickerInput;
