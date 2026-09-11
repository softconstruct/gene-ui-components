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
    MASK_REPLACEMENT_12H,
    MASK_REPLACEMENT_24H,
    MASK_SLOT_RULES_12H,
    MASK_SLOT_RULES_24H,
    textSizeMap,
    TIME_PICKER_INPUT_MASK,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM
} from "./constants";
// Helpers
import { createMaskTrack, resolveLocalization } from "./helpers";
// Hooks
import { useRangeTimePicker, useSingleTimePicker } from "./hooks/useTimePicker";
// Types
import {
    TimePickerChangeContext,
    TimePickerFormat,
    TimePickerLocalization,
    TimePickerRangeChangeContext,
    TimePickerRangeFields,
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
     * Validation state of the component: `rest` (no highlight), `warning` or `error`.
     * Colors the border and the `helperText`.
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
     * Clock format of both the input and the popover: `24h` reads and writes `HH:mm:ss`
     * (`18:45:00`), `12h` reads and writes `hh:mm:ss AM|PM` (`06:45:00 PM`) and adds the AM/PM column.
     * An existing value is converted when the format changes.
     * @default "24h"
     */
    format?: TimePickerFormat;
    /**
     * Callback function that is triggered when the popover is toggled.
     * @param open
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Custom texts of the component. Every key is optional and falls back to the English default:<br>
     * `hours`, `minutes`, `seconds` — headers of the popover columns;<br>
     * `am`, `pm` — texts of the AM/PM buttons (12-hour format);<br>
     * `clear` — accessible label of the clear button;<br>
     * `selectHours`, `selectMinutes`, `selectSeconds`, `selectMeridiem` — accessible labels of the columns;<br>
     * `startTime`, `endTime` — accessible labels of the two range inputs.
     */
    localization?: TimePickerLocalization;
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
     * The value of the input field as a time string (`HH:mm:ss`, or `hh:mm:ss AM|PM` in the 12-hour
     * format; a 24-hour string is accepted in either format). Providing it makes the component
     * controlled, so it has to be updated from `onChange`. `null` or an empty string clears the field.
     */
    value?: string | null;
    /**
     * Initial value of an uncontrolled component, in the same time string format as `value`.
     * Read once, when the component mounts.
     */
    defaultValue?: string | null;
    /**
     * Callback function that is triggered when the time picker value changes.
     * @param time the composed time, an empty string when the value was cleared
     * @param context what triggered the change and the parsed parts (`null` while incomplete)
     */
    onChange?: (time: string, context: TimePickerChangeContext) => void;
}

interface IRangeTimePickerProps extends Omit<ITimePickerBaseProps, "onFocus" | "onBlur" | "onKeyDown"> {
    /**
     * Placeholder texts of the two inputs, as `{ start, end }`.
     */
    placeholder?: {
        start: string;
        end: string;
    };
    /**
     * Values of the two inputs, as `{ start, end }` time strings (`HH:mm:ss`, or `hh:mm:ss AM|PM` in
     * the 12-hour format). Providing it makes the component controlled, so it has to be updated from
     * `onChange`, which reports the changed field in its context. `null` clears a field.
     */
    value?: {
        start: string | null;
        end: string | null;
    };
    /**
     * Initial values of an uncontrolled component, as `{ start, end }` time strings.
     * Read once, when the component mounts.
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
    /**
     * Callback function which triggers when one of the inputs is getting focused.
     * @param event
     * @param field the input the event came from
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers when one of the inputs loses focus.
     * Partially typed values are restored to the last complete one at this point.
     * @param event
     * @param field the input the event came from
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    /**
     * Callback function which triggers on `keydown` of one of the inputs.
     * @param event
     * @param field the input the event came from
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
}

type PickerSetupOptions = Pick<ITimePickerBaseProps, "id" | "format" | "localization" | "disabled" | "readOnly">;

/**
 * Derived values shared by both pickers: ids, texts, the mask of the active format, and the
 * read-only state, which `disabled` takes precedence over.
 */
const usePickerSetup = ({ id, format = "24h", localization, disabled, readOnly }: PickerSetupOptions) => {
    const is12Hour = format === "12h";
    const generatedId = useMemo(() => id || `${DEFAULT_ID_PREFIX}${nanoid()}`, [id]);
    const texts = useMemo(() => resolveLocalization(localization), [localization]);
    const mask = is12Hour ? TIME_PICKER_INPUT_MASK_WITH_MERIDIEM : TIME_PICKER_INPUT_MASK;
    const maskTrack = useMemo(
        () => createMaskTrack(mask, is12Hour ? MASK_SLOT_RULES_12H : MASK_SLOT_RULES_24H),
        [mask, is12Hour]
    );

    return {
        is12Hour,
        isReadOnly: !!readOnly && !disabled,
        generatedId,
        popoverId: `${generatedId}-popover`,
        texts,
        mask,
        maskReplacement: is12Hour ? MASK_REPLACEMENT_12H : MASK_REPLACEMENT_24H,
        maskTrack
    };
};

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
            clearable,
            status,
            helperText,
            format,
            localization,
            ...pickerOptions
        },
        ref
    ) => {
        const setup = usePickerSetup({ id, format, localization, disabled, readOnly });
        const { inputProps, popoverProps } = useSingleTimePicker({
            ...pickerOptions,
            clearable,
            disabled,
            readOnly: setup.isReadOnly,
            is12Hour: setup.is12Hour
        });

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                <Label
                    labelFor={setup.generatedId}
                    size={textSizeMap[size]}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    className="pickerInput__label"
                    required={required}
                    infoText={infoText}
                    text={label}
                />
                <PickerInput
                    {...inputProps}
                    id={setup.generatedId}
                    name={name}
                    size={size}
                    placeholder={placeholder}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    required={required}
                    clearable={clearable}
                    clearLabel={setup.texts.clear}
                    status={status}
                    helperText={helperText}
                    popoverId={setup.popoverId}
                    mask={setup.mask}
                    maskReplacement={setup.maskReplacement}
                    maskTrack={setup.maskTrack}
                />
                <PickerPopover
                    {...popoverProps}
                    id={setup.popoverId}
                    size={size}
                    mobileHeightMode="fit"
                    is12Hour={setup.is12Hour}
                    localization={localization}
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
            clearable,
            status,
            helperText,
            format,
            localization,
            ...pickerOptions
        },
        ref
    ) => {
        const setup = usePickerSetup({ id, format, localization, disabled, readOnly });
        const { inputProps, popoverProps } = useRangeTimePicker({
            ...pickerOptions,
            clearable,
            disabled,
            readOnly: setup.isReadOnly,
            is12Hour: setup.is12Hour
        });

        const ids = { start: `${setup.generatedId}-start`, end: `${setup.generatedId}-end` };

        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                <Label
                    labelFor={ids.start}
                    size={textSizeMap[size]}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    className="pickerInput__label"
                    required={required}
                    infoText={infoText}
                    text={label}
                />
                <PickerInput.Range
                    {...inputProps}
                    ids={ids}
                    labels={{ start: setup.texts.startTime, end: setup.texts.endTime }}
                    name={name}
                    size={size}
                    placeholder={placeholder}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    required={required}
                    clearable={clearable}
                    clearLabel={setup.texts.clear}
                    status={status}
                    helperText={helperText}
                    popoverId={setup.popoverId}
                    mask={setup.mask}
                    maskReplacement={setup.maskReplacement}
                    maskTrack={setup.maskTrack}
                />
                <PickerPopover
                    {...popoverProps}
                    id={setup.popoverId}
                    size={size}
                    mobileHeightMode="fit"
                    is12Hour={setup.is12Hour}
                    localization={localization}
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
