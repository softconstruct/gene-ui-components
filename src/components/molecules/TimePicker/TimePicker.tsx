import React, { forwardRef } from "react";
import classNames from "classnames";

import { Clock } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import PickerInput from "@components/molecules/TimePicker/components/PickerInput/PickerInput";
import PickerPopover from "@components/molecules/TimePicker/components/PickerPopover/PickerPopover";
import { TimeParts, TimePickerSizes } from "@components/molecules/TimePicker/types";

// Styles
import "./TimePicker.scss";

// Hooks
import { useRangeTimePicker, useSingleTimePicker } from "./hooks/useTimePicker";

interface ITimePickerBaseProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The size of the component.
     */
    size?: TimePickerSizes;
    /**
     * The label text displayed next to the input field.
     */
    label?: string;
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
     * Callback function that is triggered when the input field value was cleared with clear button.
     */
    onClear?: () => void;
    /**
     * Specifies whether the input field should display a clear button to clear the input value.
     */
    clearable?: boolean;
    /**
     * Specifies whether the input field is in an error state.
     */
    error?: boolean;
    /**
     * Error message to display when the input field is in an error state.
     */
    errorMessage?: string;
    /**
     * Specifies whether the time picker should use 12 or 24-hour format.
     * @default "24h"
     */
    timeFormat?: "12h" | "24h";
    /**
     * Callback function that is triggered when a time is selected.
     * @param {string} time - The selected time in the format passed as prop or "HH:mm:ss" as default.
     */
    onTimeSelect?: (time: string, parts: TimeParts, field?: "start" | "end") => void;
    /**
     * Callback function that is triggered when the input field value changes.
     * @param {string} time - The new value of the input field.
     */
    onTimeInputChange?: (time: string, parts: TimeParts | null, field?: "start" | "end") => void;
    /**
     * Callback function that is triggered when the popover is toggled.
     * @param open
     */
    onPopoverToggle?: (open: boolean) => void;
    /**
     * Custom texts for the component.
     * @param {string} texts.amText - The text to display for AM (AM/A).
     * @param {string} texts.pmText - The text to display for PM (P/P).
     */
    texts?: {
        amText?: string;
        pmText?: string;
        hours?: string;
        minutes?: string;
        seconds?: string;
    };
    /**
     * Disabled specific time programmatically.
     * @param type
     * @param value
     */
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", value: string) => boolean;
}

interface ISingleTimePickerProps extends ITimePickerBaseProps {
    /**
     * The placeholder text displayed when the input field is empty.
     */
    placeholder?: string;
    /**
     * The value of the input field.
     */
    value?: string | null;
}

interface IRangeTimePickerProps extends ITimePickerBaseProps {
    /**
     * The placeholder text displayed when the input field is empty.
     */
    placeholder?: {
        start: string;
        end: string;
    };
    /**
     * The value of the input field.
     */
    value?: {
        start: string | null;
        end: string | null;
    };
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
            disabled,
            required,
            readOnly,
            placeholder,
            value,
            clearable,
            onClear,
            onTimeSelect,
            onTimeInputChange,
            onPopoverToggle,
            error,
            errorMessage,
            timeFormat = "24h",
            texts,
            shouldDisableTime
        },
        ref
    ) => {
        const is12Hour = timeFormat === "12h";
        const {
            popoverOpen,
            setPopoverOpen,
            anchorProps,
            setAnchorProps,
            internalValue,
            parts,
            popoverRef,
            handleInputChange,
            handleSelect,
            handleClear
        } = useSingleTimePicker(
            value,
            clearable,
            onClear,
            onTimeSelect,
            onTimeInputChange,
            onPopoverToggle,
            shouldDisableTime,
            is12Hour
        );

        const valueToUse = value !== undefined ? value : internalValue;

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                {label && <Label disabled={disabled} className="pickerInput__label" required={required} text={label} />}
                <PickerInput
                    size={size}
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    popoverRefData={anchorProps}
                    onClick={() => setPopoverOpen(true)}
                    onChange={handleInputChange}
                    onClear={handleClear}
                    clearable={clearable}
                    error={error}
                    errorMessage={errorMessage}
                />
                <PickerPopover
                    open={popoverOpen}
                    setProps={setAnchorProps}
                    popoverRef={popoverRef}
                    onClose={() => setPopoverOpen(false)}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    onSelect={handleSelect}
                    parts={parts}
                    is12Hour={is12Hour}
                    texts={texts}
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
            disabled,
            required,
            readOnly,
            placeholder,
            value,
            clearable,
            onClear,
            onTimeSelect,
            onTimeInputChange,
            onPopoverToggle,
            error,
            timeFormat = "24h",
            errorMessage,
            texts,
            shouldDisableTime
        },
        ref
    ) => {
        const is12Hour = timeFormat === "12h";
        const {
            popoverRef,
            popoverOpen,
            setPopoverOpen,
            anchorProps,
            setAnchorProps,
            activeField,
            internalStart,
            internalEnd,
            partsStart,
            partsEnd,
            handleInputClick,
            handleInputChange,
            handleSelect,
            handleClear
        } = useRangeTimePicker(
            value,
            clearable,
            onClear,
            onTimeSelect,
            onTimeInputChange,
            onPopoverToggle,
            shouldDisableTime,
            is12Hour
        );

        const valueToUse = {
            start: value?.start !== undefined ? value.start : internalStart,
            end: value?.end !== undefined ? value.end : internalEnd
        };

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                {label && <Label disabled={disabled} className="pickerInput__label" required={required} text={label} />}
                <PickerInput.Range
                    size={size}
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    popoverRefData={anchorProps}
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onClear={handleClear}
                    clearable={clearable}
                    error={error}
                    errorMessage={errorMessage}
                />
                <PickerPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    setProps={setAnchorProps}
                    onClose={() => setPopoverOpen(false)}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    parts={activeField === "start" ? partsStart : partsEnd}
                    activeField={activeField}
                    partsStart={partsStart}
                    partsEnd={partsEnd}
                    onSelect={handleSelect}
                    is12Hour={is12Hour}
                    texts={texts}
                    shouldDisableTime={shouldDisableTime}
                />
            </div>
        );
    }
);

/**
 * Time Picker component allows users to easily select a specific time, typically using an intuitive visual interface like a clock or list of time values.
 */
const TimePicker = Object.assign(SingleTimePicker, {
    Range: RangeTimePicker
});

export { ISingleTimePickerProps, IRangeTimePickerProps, RangeTimePicker, TimePicker as default };
