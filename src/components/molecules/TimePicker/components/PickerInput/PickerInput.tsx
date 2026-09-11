import React, {
    ChangeEvent,
    FC,
    FocusEvent,
    Fragment,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    MutableRefObject,
    ReactNode,
    Ref,
    useCallback
} from "react";
import { InputMask, Track } from "@react-input/mask";
import classNames from "classnames";

// Icons
import { IconProps, Minus, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";

// Styles
import "./PickerInput.scss";

// Constants
import {
    PICKER_RANGE_FIELDS,
    pickerShellIconSizeMap,
    textSizeMap,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM
} from "../../constants";
// Types
import { TimePickerRangeFields, TimePickerSizes, TimePickerStatus } from "../../types";

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
     * Helper text rendered below the field, styled according to `status`.
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
     * The characters the mask placeholder accepts.
     */
    maskReplacement: Record<string, RegExp>;
    /**
     * Validates every typed character against the rule of the slot it lands in.
     */
    maskTrack: Track;
    /**
     * Callback function which triggers when the field value is getting cleared with the clear button.
     */
    onClear?: () => void;
    /**
     * Accessible label of the clear button.
     */
    clearLabel: string;
    /**
     * Props `Popover` assigns to its reference element (ARIA attributes and handlers), without the
     * `ref`, which is passed separately as `anchorRef`.
     */
    anchorProps?: HTMLAttributes<HTMLDivElement>;
    /**
     * `Popover` positioning ref, merged into the field element together with `shellRef`.
     */
    anchorRef?: (node: HTMLElement | null) => void;
    /**
     * Reference to the field element, used to tell presses inside the field apart from outside ones.
     */
    shellRef?: Ref<HTMLDivElement>;
    /**
     * Callback for clicks on the field around the inputs (icons, padding), which behave like a click
     * on the input.
     */
    onAreaClick?: () => void;
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

type PickerShellProps = Pick<
    IPickerInputBaseProps,
    | "className"
    | "size"
    | "status"
    | "helperText"
    | "disabled"
    | "readOnly"
    | "EndIcon"
    | "onClear"
    | "clearLabel"
    | "anchorProps"
    | "anchorRef"
    | "shellRef"
    | "onAreaClick"
> & {
    mode: "single" | "range";
    children: ReactNode;
    helperTextId: string;
    showClearButton: boolean;
};

type PickerMaskedInputProps = Pick<
    ISinglePickerInputProps,
    | "id"
    | "name"
    | "value"
    | "placeholder"
    | "size"
    | "status"
    | "required"
    | "disabled"
    | "readOnly"
    | "mask"
    | "maskReplacement"
    | "maskTrack"
    | "inputRef"
    | "onClick"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
> & {
    ariaLabel?: string;
    describedBy?: string;
    controls: string;
    isExpanded: boolean;
};

const RANGE_FIELDS = [PICKER_RANGE_FIELDS.START, PICKER_RANGE_FIELDS.END] as const;

/**
 * Every input is sized for the longest value it can hold, so the field keeps the same width in both
 * formats and never clips the AM/PM suffix.
 */
const INPUT_SIZE = TIME_PICKER_INPUT_MASK_WITH_MERIDIEM.length + 1;

const isControlTarget = (target: EventTarget): boolean =>
    target instanceof Element && !!target.closest("input, button");

/**
 * Splits the props both pickers receive into what the shell renders and what every masked input gets.
 */
const getSharedProps = (
    {
        className,
        size = "medium",
        status = "rest",
        helperText,
        disabled,
        readOnly,
        required,
        EndIcon,
        mask,
        maskReplacement,
        maskTrack,
        onClear,
        clearLabel,
        anchorProps,
        anchorRef,
        shellRef,
        onAreaClick,
        isExpanded,
        popoverId
    }: Omit<IPickerInputBaseProps, "onKeyDown">,
    helperTextId: string
) => ({
    shell: {
        className,
        size,
        status,
        helperText,
        helperTextId,
        disabled,
        readOnly,
        EndIcon,
        onClear,
        clearLabel,
        anchorProps,
        anchorRef,
        shellRef,
        onAreaClick
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
        isExpanded,
        controls: popoverId,
        describedBy: helperText ? helperTextId : undefined
    }
});

const PickerMaskedInput: FC<PickerMaskedInputProps> = ({
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

const PickerShell: FC<PickerShellProps> = ({
    className,
    mode,
    size = "medium",
    children,
    status = "rest",
    helperText,
    helperTextId,
    disabled,
    readOnly,
    EndIcon,
    onClear,
    showClearButton,
    clearLabel,
    anchorProps,
    anchorRef,
    shellRef,
    onAreaClick
}) => {
    const setShellRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (typeof shellRef === "function") {
                shellRef(node);
            } else if (shellRef) {
                // eslint-disable-next-line no-param-reassign
                (shellRef as MutableRefObject<HTMLDivElement | null>).current = node;
            }

            anchorRef?.(node);
        },
        [shellRef, anchorRef]
    );

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (!isControlTarget(event.target)) event.preventDefault();
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!isControlTarget(event.target)) onAreaClick?.();
    };

    return (
        <>
            <div
                {...anchorProps}
                ref={setShellRef}
                role="presentation"
                className={classNames(
                    "pickerInput",
                    className,
                    `pickerInput_mode_${mode}`,
                    `pickerInput_size_${size}`,
                    {
                        pickerInput_state_error: status === "error",
                        pickerInput_state_warning: status === "warning",
                        pickerInput_state_disabled: disabled,
                        pickerInput_state_readOnly: readOnly
                    }
                )}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                {children}
                {(showClearButton || EndIcon) && (
                    <div className="pickerInput__append">
                        {showClearButton && (
                            <Button
                                onClick={onClear}
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
                        size={textSizeMap[size]}
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

const SinglePickerInput: FC<ISinglePickerInputProps> = (props) => {
    const { id, name, value, placeholder, inputRef, onClick, onChange, onFocus, onBlur, onKeyDown } = props;
    const { clearable, disabled, readOnly } = props;
    const { shell, input } = getSharedProps(props, `${id}-helper-text`);

    return (
        <PickerShell {...shell} mode="single" showClearButton={!!(clearable && value && !disabled && !readOnly)}>
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
    const { clearable, disabled, readOnly } = props;
    const { shell, input } = getSharedProps(props, `${ids.start}-helper-text`);
    const hasValue = !!(value?.start || value?.end);

    return (
        <PickerShell {...shell} mode="range" showClearButton={!!(clearable && hasValue && !disabled && !readOnly)}>
            {RANGE_FIELDS.map((field, index) => (
                <Fragment key={field}>
                    {index > 0 && <Minus className="pickerInput__icon" size={16} aria-hidden="true" />}
                    <PickerMaskedInput
                        {...input}
                        id={ids[field]}
                        name={name && `${name}-${field}`}
                        value={value?.[field]}
                        placeholder={placeholder?.[field]}
                        ariaLabel={labels[field]}
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
