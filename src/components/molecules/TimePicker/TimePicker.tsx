import React, { FocusEvent, forwardRef, KeyboardEvent, useMemo } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { Clock } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";

// Styles
import "./TimePicker.scss";

import PickerInput from "./components/PickerInput/PickerInput";
import PickerPopover from "./components/PickerPopover/PickerPopover";
// Constants
import {
    DEFAULT_ID_PREFIX,
    labelSizeMap,
    MASK_REPLACEMENT_12H,
    MASK_REPLACEMENT_24H,
    TIME_PICKER_INPUT_MASK,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM
} from "./constants";
// Helpers
import { resolveLocalization } from "./helpers";
// Hooks
import { useRangeTimePicker, useSingleTimePicker } from "./hooks/useTimePicker";
// Types
import {
    ShouldDisableTime,
    TimePickerChangeContext,
    TimePickerFormat,
    TimePickerLocalization,
    TimePickerRangeChangeContext,
    TimePickerSizes,
    TimePickerStatus
} from "./types";

interface ITimePickerBaseProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The size of the component.<br>
     * @default "medium"
     */
    size?: TimePickerSizes;
    /**
     * The label text displayed next to the input field.
     */
    label?: string;
    /**
     * Additional informational text displayed next to the label inside a tooltip.
     */
    infoText?: string;
    /**
     * `HTML` `id` attribute for the `input` element. Generated when omitted.
     */
    id?: string;
    /**
     * `HTML` `name` attribute for the `input` element.
     */
    name?: string;
    /**
     * Disables the input field, making it uneditable and non-interactive.
     */
    disabled?: boolean;
    /**
     * Specifies whether the input field is mandatory for form submission.
     */
    required?: boolean;
    /**
     * Specifies whether the input field is read-only, making it non-editable but still interactive.
     */
    readOnly?: boolean;
    /**
     * Validation state of the component.<br>
     * @default "rest"
     */
    status?: TimePickerStatus;
    /**
     * Text displayed below the input field, styled according to the `status` prop.
     */
    helperText?: string;
    /**
     * Callback function that is triggered when the input field value was cleared with a clear button.
     */
    onClear?: () => void;
    /**
     * Specifies whether the input field should display a clear button to clear the input value.
     */
    clearable?: boolean;
    /**
     * Specifies whether the time picker should use 12 or 24-hour format.
     * @default "24h"
     */
    format?: TimePickerFormat;
    /**
     * Callback function that is triggered when the popover is toggled.
     * @param open
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Custom localization for the component, including the accessible labels.
     */
    localization?: TimePickerLocalization;
    /**
     * Disabled specific time programmatically.
     * @param type
     * @param value
     */
    shouldDisableTime?: ShouldDisableTime;
    /**
     * Callback function which triggers when an input of the component is getting focused.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when an input of the component loses focus.
     * Partially typed values are restored to the last complete one at this point.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers on `keydown` of an input of the component.
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface ISingleTimePickerProps extends ITimePickerBaseProps {
    /**
     * The placeholder text displayed when the input field is empty.
     */
    placeholder?: string;
    /**
     * The value of the input field. Providing it makes the component controlled.
     */
    value?: string | null;
    /**
     * Initial value of an uncontrolled component.
     */
    defaultValue?: string | null;
    /**
     * Callback function that is triggered when the time picker value changes.
     * @param time the composed time, an empty string when the value was cleared
     * @param context what triggered the change and the parsed parts (`null` while incomplete)
     */
    onChange?: (time: string, context: TimePickerChangeContext) => void;
}

interface IRangeTimePickerProps extends ITimePickerBaseProps {
    /**
     * The placeholder text displayed when the input fields are empty.
     */
    placeholder?: {
        start: string;
        end: string;
    };
    /**
     * The value of the input fields. Providing it makes the component controlled.
     */
    value?: {
        start: string | null;
        end: string | null;
    };
    /**
     * Initial value of an uncontrolled component.
     */
    defaultValue?: {
        start: string | null;
        end: string | null;
    };
    /**
     * Callback function that is triggered when one of the range values changes.
     * @param time the composed time, an empty string when the value was cleared
     * @param context which field changed, what triggered it and the parsed parts
     */
    onChange?: (time: string, context: TimePickerRangeChangeContext) => void;
}

/**
 * Component for selecting a single time value.
 *
 * This component provides a user interface for choosing a specific time. It includes an input field
 * and a popover for selecting time, with support for customization through props.
 */
const SingleTimePicker = forwardRef<HTMLDivElement, ISingleTimePickerProps>(
    (
        {
            className,
            size = "medium",
            label,
            infoText,
            id,
            name,
            disabled,
            required,
            readOnly,
            placeholder,
            value,
            defaultValue,
            clearable,
            onClear,
            onChange,
            onOpenChange,
            status,
            helperText,
            format = "24h",
            localization,
            shouldDisableTime,
            onFocus,
            onBlur,
            onKeyDown
        },
        ref
    ) => {
        const is12Hour = format === "12h";

        const {
            popoverOpen,
            shouldFocusPopover,
            anchorProps,
            setAnchorProps,
            popoverRef,
            inputRef,
            value: valueToUse,
            parts,
            handleInputChange,
            handleInputClick,
            handleInputFocus,
            handleInputBlur,
            handleInputKeyDown,
            handleSelect,
            handleClear,
            handlePopoverClose
        } = useSingleTimePicker({
            value,
            defaultValue,
            clearable,
            disabled,
            readOnly,
            is12Hour,
            shouldDisableTime,
            onChange,
            onClear,
            onOpenChange,
            onFocus,
            onBlur,
            onKeyDown
        });

        const generatedId = useMemo(() => id || `${DEFAULT_ID_PREFIX}${nanoid()}`, [id]);
        const popoverId = `${generatedId}-popover`;

        const texts = useMemo(() => resolveLocalization(localization), [localization]);

        const maskToUse = is12Hour ? TIME_PICKER_INPUT_MASK_WITH_MERIDIEM : TIME_PICKER_INPUT_MASK;
        const maskReplacement = is12Hour ? MASK_REPLACEMENT_12H : MASK_REPLACEMENT_24H;

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                <Label
                    labelFor={generatedId}
                    size={labelSizeMap[size]}
                    disabled={disabled}
                    readOnly={readOnly}
                    className="pickerInput__label"
                    required={required}
                    infoText={infoText}
                    text={label}
                />
                <PickerInput
                    id={generatedId}
                    name={name}
                    inputRef={inputRef}
                    size={size}
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    popoverRefData={anchorProps}
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    onClear={handleClear}
                    clearable={clearable}
                    clearLabel={texts.clear}
                    status={status}
                    helperText={helperText}
                    isExpanded={popoverOpen}
                    popoverId={popoverId}
                    mask={maskToUse}
                    maskReplacement={maskReplacement}
                />
                <PickerPopover
                    id={popoverId}
                    open={popoverOpen}
                    focusOnOpen={shouldFocusPopover}
                    setProps={setAnchorProps}
                    popoverRef={popoverRef}
                    onClose={handlePopoverClose}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    onSelect={handleSelect}
                    parts={parts}
                    is12Hour={is12Hour}
                    localization={localization}
                    shouldDisableTime={shouldDisableTime}
                />
            </div>
        );
    }
);

/**
 * Component that renders a range time picker with support for custom labels,
 * placeholders, and interaction states such as disabled or read-only. It allows users
 * to select a start and end time within the defined range.
 */
const RangeTimePicker = forwardRef<HTMLDivElement, IRangeTimePickerProps>(
    (
        {
            className,
            size = "medium",
            label,
            infoText,
            id,
            name,
            disabled,
            required,
            readOnly,
            placeholder,
            value,
            defaultValue,
            clearable,
            onClear,
            onChange,
            onOpenChange,
            status,
            helperText,
            format = "24h",
            localization,
            shouldDisableTime,
            onFocus,
            onBlur,
            onKeyDown
        },
        ref
    ) => {
        const is12Hour = format === "12h";

        const {
            popoverRef,
            popoverOpen,
            shouldFocusPopover,
            anchorProps,
            setAnchorProps,
            activeField,
            startInputRef,
            endInputRef,
            value: valueToUse,
            partsStart,
            partsEnd,
            handleInputClick,
            handleInputFocus,
            handleInputChange,
            handleInputBlur,
            handleInputKeyDown,
            handleSelect,
            handleClear,
            handlePopoverClose
        } = useRangeTimePicker({
            value,
            defaultValue,
            clearable,
            disabled,
            readOnly,
            is12Hour,
            shouldDisableTime,
            onChange,
            onClear,
            onOpenChange,
            onFocus,
            onBlur,
            onKeyDown
        });

        const generatedId = useMemo(() => id || `${DEFAULT_ID_PREFIX}${nanoid()}`, [id]);
        const fieldIds = useMemo(() => ({ start: `${generatedId}-start`, end: `${generatedId}-end` }), [generatedId]);
        const popoverId = `${generatedId}-popover`;

        const texts = useMemo(() => resolveLocalization(localization), [localization]);

        const maskToUse = is12Hour ? TIME_PICKER_INPUT_MASK_WITH_MERIDIEM : TIME_PICKER_INPUT_MASK;
        const maskReplacement = is12Hour ? MASK_REPLACEMENT_12H : MASK_REPLACEMENT_24H;

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                <Label
                    labelFor={fieldIds.start}
                    size={labelSizeMap[size]}
                    disabled={disabled}
                    readOnly={readOnly}
                    className="pickerInput__label"
                    required={required}
                    infoText={infoText}
                    text={label}
                />
                <PickerInput.Range
                    ids={fieldIds}
                    labels={{ start: texts.startTime, end: texts.endTime }}
                    inputRefs={{ start: startInputRef, end: endInputRef }}
                    name={name}
                    size={size}
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    popoverRefData={anchorProps}
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    onClear={handleClear}
                    clearable={clearable}
                    clearLabel={texts.clear}
                    status={status}
                    helperText={helperText}
                    isExpanded={popoverOpen}
                    popoverId={popoverId}
                    mask={maskToUse}
                    maskReplacement={maskReplacement}
                />
                <PickerPopover
                    id={popoverId}
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    focusOnOpen={shouldFocusPopover}
                    setProps={setAnchorProps}
                    onClose={handlePopoverClose}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    parts={activeField === "start" ? partsStart : partsEnd}
                    activeField={activeField}
                    partsStart={partsStart}
                    partsEnd={partsEnd}
                    onSelect={handleSelect}
                    is12Hour={is12Hour}
                    localization={localization}
                    shouldDisableTime={shouldDisableTime}
                />
            </div>
        );
    }
);

/**
 * Time Picker component allows users to easily select a specific time,
 * typically using an intuitive visual interface like a clock or list of time values.
 */
const TimePicker = Object.assign(SingleTimePicker, {
    Range: RangeTimePicker
});

export { ISingleTimePickerProps, IRangeTimePickerProps, RangeTimePicker, TimePicker as default };
