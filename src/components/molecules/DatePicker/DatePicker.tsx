import React, { ChangeEvent, FocusEvent, forwardRef, KeyboardEvent, useMemo } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { Calendar as CalendarIcon } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";

import { DEFAULT_ID_PREFIX, PickerInput, PickerPopover, textSizeMap } from "@internal/components/Picker";

import Calendar from "./components/Calendar/Calendar";
import DatePickerSkeleton from "./components/DatePickerSkeleton/DatePickerSkeleton";
// Constants
import { DATE_MASK_REPLACEMENT, DEFAULT_LOCALE } from "./constants";
// Helpers
import { createDateMaskTrack, getDateMask, resolveDateFormat, resolveLocalization } from "./helpers";
// Hooks
import { useRangeDatePicker, useSingleDatePicker } from "./hooks/useDatePicker";
// Types
import {
    DatePickerFormat,
    DatePickerPreset,
    DatePickerRangeFields,
    DatePickerRangePreset,
    DatePickerRangeValue,
    DatePickerSizes,
    DatePickerStatus,
    IDatePickerLocalization
} from "./types";

// Styles
import "./DatePicker.scss";

interface IDatePickerBaseProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The size of the component.<br>
     * Possible values: `small | medium | large`
     * @default "medium"
     */
    size?: DatePickerSizes;
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
     * The value stays visible but cannot be selected or copied.
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
     * Shows the skeleton of the component while its data is loading: bars in place of the label, the
     * input field and the helper text, each one only where its content is set.
     */
    loading?: boolean;
    /**
     * Validation state of the component: `rest` (no highlight), `warning` or `error`.
     * Colors the border and the `helperText`.<br>
     * Possible values: `rest | warning | error`
     * @default "rest"
     */
    status?: DatePickerStatus;
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
     * How the input shows and reads the date: `DD` (day), `MM` (month) and `YYYY` (year), each once,
     * in any order and with any text around them, like `DD/MM/YYYY`, `MM-DD-YYYY`, `YYYY.MM.DD` or
     * `YYYY年MM月DD日`. Only these capitals stand for the date; a format without one of them, with
     * another run of `D`, `M` or `Y` (`D`, `YY`, `MMM`) or with `_` falls back to `DD/MM/YYYY`. The
     * value is an ISO date (`YYYY-MM-DD`) in every format, so changing the format never changes the value.
     * @default "DD/MM/YYYY"
     */
    format?: DatePickerFormat;
    /**
     * Language of the month and weekday names and of the accessible day labels, as a BCP 47 language
     * tag (`en-US`, `hy-AM`, `ru-RU`, ...).
     * @default "en-US"
     */
    locale?: string;
    /**
     * The earliest selectable date, as an ISO date (`YYYY-MM-DD`). Earlier days are disabled in the
     * calendar, and an earlier typed date is moved up to it when the field is left.
     */
    min?: string;
    /**
     * The latest selectable date, as an ISO date (`YYYY-MM-DD`). Later days are disabled in the
     * calendar, and a later typed date is moved back to it when the field is left.
     */
    max?: string;
    /**
     * Callback function that is triggered when the popover is toggled.
     * @param open
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Custom texts of the component. Every key is optional and falls back to the English default:<br>
     * `clear` — accessible label of the clear button;<br>
     * `previousMonth`, `nextMonth`, `previousYear`, `nextYear`, `previousDecade`, `nextDecade` —
     * accessible labels of the calendar header arrows;<br>
     * `chooseMonth`, `chooseYear` — added to the accessible labels of the header month and year, which
     * switch to the month and the year view;<br>
     * `startDate`, `endDate` — accessible labels of the two range inputs;<br>
     * `presets` — accessible label of the preset list.<br>
     * Month and weekday names come from `locale`, the texts of the presets from `presets`.
     */
    localization?: IDatePickerLocalization;
    /**
     * Callback function which triggers when an input of the component is getting focused.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Callback function which triggers when the focus leaves the component — the input, its clear
     * button or the popover; moving the focus between them does not trigger it. Typed text is settled
     * first: a date that needs correcting (`31/04` → `30/04`, outside `min`/`max`) is corrected and
     * reported through `onChange`, incomplete text is replaced by the last date the field held.
     * @param date the final value as an ISO date, an empty string when the field is empty
     * @param event `event.target` is the element the focus left
     */
    onBlur?: (date: string, event: FocusEvent<HTMLElement>) => void;
    /**
     * Callback function which triggers on `keydown` of an input of the component.
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface ISingleDatePickerProps extends IDatePickerBaseProps {
    /**
     * The placeholder text displayed when the input field is empty.
     */
    placeholder?: string;
    /**
     * The value as an ISO date (`YYYY-MM-DD`). Providing it makes the component controlled, so it has
     * to be updated from `onChange`. `null` or an empty string clears the field. A date with out of
     * range parts (`2026-02-30`) is displayed corrected but reported back only once the user edits it.
     */
    value?: string | null;
    /**
     * Initial value of an uncontrolled component, as an ISO date. Read once, when the component mounts.
     */
    defaultValue?: string | null;
    /**
     * Presets shown beside the calendar (under it on phones), each one a `label` and the day its
     * click sets as the value. The `value` of a preset is an ISO date (`YYYY-MM-DD`), a whole number
     * of days from today (`0` today, `-1` yesterday, `-7` a week ago), or a function that gets today's
     * ISO date and returns one of them, for days like the first of the month. A preset outside
     * `min`/`max`, or whose value is not a date, is disabled; the one matching the value is shown selected.
     */
    presets?: DatePickerPreset[];
    /**
     * Callback function that is triggered when the date changes: once typed text is a complete date
     * that exists and is allowed (after a pause in typing), on a pick from the calendar, on clear,
     * when the text is emptied, and when the field is left with a typed date that had to be corrected.
     * `onBlur` reports the final value once the user is done.
     * @param event `event.target.value` is the ISO date (an empty string when the value was cleared)
     * and `event.target.name` the `name` of the input. The reported event is a copy of the event that
     * caused the change (the typing, the click, the key or the blur), with the input as its `target`.
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface IRangeDatePickerProps extends Omit<IDatePickerBaseProps, "onFocus" | "onBlur" | "onKeyDown"> {
    /**
     * Placeholder texts of the two inputs, as `{ start, end }`.
     */
    placeholder?: {
        start: string;
        end: string;
    };
    /**
     * Values of the two inputs, as `{ start, end }` ISO dates. Providing it makes the component
     * controlled, so it has to be updated from `onChange`, which reports both values. `null` clears a field.
     */
    value?: {
        start: string | null;
        end: string | null;
    };
    /**
     * Initial values of an uncontrolled component, as `{ start, end }` ISO dates.
     * Read once, when the component mounts.
     */
    defaultValue?: {
        start: string | null;
        end: string | null;
    };
    /**
     * Presets shown beside the calendar (under it on phones), each one a `label` and the range its
     * click sets, as `{ start, end }`. Each day is an ISO date (`YYYY-MM-DD`) or a whole number of days
     * from today, like `{ start: -10, end: 0 }` for the last 11 days; the `value` can also be a function
     * that gets today's ISO date and returns the range, for ranges like this month. A preset reaching
     * past `min`/`max`, or with a day that is not a date, is disabled; the one matching both values is
     * shown selected. A pick is reported once, through `onChange` for the start.
     */
    presets?: DatePickerRangePreset[];
    /**
     * Callback function that is triggered when one of the range values changes, under the same
     * conditions as the single picker's `onChange`. A day picked for the start moves the editing on to
     * the end; each field is limited by the other, so the start never passes the end.
     * @param event `event.target.value` is the ISO date of the changed field and `event.target.name`
     * the `name` of its input (`<name>-start` / `<name>-end`)
     * @param value both values as `{ start, end }` ISO dates, an empty string for an empty field
     * @param field the field that changed; `start` when both fields were cleared
     */
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        value: DatePickerRangeValue,
        field: DatePickerRangeFields
    ) => void;
    /**
     * Callback function which triggers when one of the inputs is getting focused.
     * @param event
     * @param field the input the event came from
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: DatePickerRangeFields) => void;
    /**
     * Callback function which triggers when one of the fields is left: the focus moves to the other
     * field, or leaves the component (the inputs, the clear button and the popover). Typed text is
     * settled first, as in the single picker.
     * @param value the final values as `{ start, end }` ISO dates, an empty string for an empty field
     * @param event `event.target` is the element the focus left
     * @param field the field that was left
     */
    onBlur?: (value: DatePickerRangeValue, event: FocusEvent<HTMLElement>, field: DatePickerRangeFields) => void;
    /**
     * Callback function which triggers on `keydown` of one of the inputs.
     * @param event
     * @param field the input the event came from
     */
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: DatePickerRangeFields) => void;
}

type PickerSetupOptions = Pick<IDatePickerBaseProps, "id" | "format" | "localization" | "disabled" | "readOnly">;

/**
 * Derived values shared by both pickers: ids, texts, the mask of the format, and the read-only
 * state, which `disabled` takes precedence over.
 */
const usePickerSetup = ({ id, format: formatProp, localization, disabled, readOnly }: PickerSetupOptions) => {
    const generatedId = useMemo(() => id || `${DEFAULT_ID_PREFIX}${nanoid()}`, [id]);
    const texts = useMemo(() => resolveLocalization(localization), [localization]);
    const format = resolveDateFormat(formatProp);
    const mask = getDateMask(format);
    const maskTrack = useMemo(() => createDateMaskTrack(format), [format]);

    return {
        format,
        isReadOnly: !!readOnly && !disabled,
        generatedId,
        popoverId: `${generatedId}-popover`,
        texts,
        mask,
        maskTrack,
        inputSize: mask.length + 1
    };
};

/**
 * Component for selecting a single date, by typing it or by picking it in a calendar.
 */
const SingleDatePicker = forwardRef<HTMLDivElement, ISingleDatePickerProps>(
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
            loading,
            placeholder,
            clearable,
            status,
            helperText,
            format,
            locale = DEFAULT_LOCALE,
            localization,
            ...pickerOptions
        },
        ref
    ) => {
        const setup = usePickerSetup({ id, format, localization, disabled, readOnly });
        const { inputProps, popoverProps, calendarProps } = useSingleDatePicker({
            ...pickerOptions,
            format: setup.format,
            clearable,
            disabled,
            readOnly: setup.isReadOnly
        });

        if (loading) {
            return (
                <DatePickerSkeleton
                    ref={ref}
                    className={className}
                    size={size}
                    withLabel={!!label}
                    withHelperText={!!helperText}
                />
            );
        }

        return (
            <div className={classNames("datePicker", className)} ref={ref}>
                <Label
                    labelFor={setup.generatedId}
                    size={textSizeMap[size]}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    className="datePicker__label"
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
                    Icon={CalendarIcon}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    required={required}
                    clearable={clearable}
                    clearLabel={setup.texts.clear}
                    status={status}
                    helperText={helperText}
                    popoverId={setup.popoverId}
                    mask={setup.mask}
                    maskReplacement={DATE_MASK_REPLACEMENT}
                    maskTrack={setup.maskTrack}
                    inputMode="numeric"
                    inputSize={setup.inputSize}
                />
                <PickerPopover {...popoverProps} id={setup.popoverId} mobileHeightMode="fit">
                    <Calendar {...calendarProps} size={size} locale={locale} texts={setup.texts} />
                </PickerPopover>
            </div>
        );
    }
);

/**
 * Component for selecting a range of dates: a start and an end, typed or picked in a calendar of two
 * months side by side (one on phones).
 */
const RangeDatePicker = forwardRef<HTMLDivElement, IRangeDatePickerProps>(
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
            loading,
            placeholder,
            clearable,
            status,
            helperText,
            format,
            locale = DEFAULT_LOCALE,
            localization,
            ...pickerOptions
        },
        ref
    ) => {
        const setup = usePickerSetup({ id, format, localization, disabled, readOnly });
        const { inputProps, popoverProps, calendarProps } = useRangeDatePicker({
            ...pickerOptions,
            format: setup.format,
            clearable,
            disabled,
            readOnly: setup.isReadOnly
        });

        const ids = { start: `${setup.generatedId}-start`, end: `${setup.generatedId}-end` };

        if (loading) {
            return (
                <DatePickerSkeleton
                    ref={ref}
                    className={className}
                    size={size}
                    withLabel={!!label}
                    withHelperText={!!helperText}
                />
            );
        }

        return (
            <div className={classNames("datePicker", className)} ref={ref}>
                <Label
                    labelFor={ids.start}
                    size={textSizeMap[size]}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    className="datePicker__label"
                    required={required}
                    infoText={infoText}
                    text={label}
                />
                <PickerInput.Range
                    {...inputProps}
                    ids={ids}
                    labels={{ start: setup.texts.startDate, end: setup.texts.endDate }}
                    name={name}
                    size={size}
                    placeholder={placeholder}
                    Icon={CalendarIcon}
                    disabled={disabled}
                    readOnly={setup.isReadOnly}
                    required={required}
                    clearable={clearable}
                    clearLabel={setup.texts.clear}
                    status={status}
                    helperText={helperText}
                    popoverId={setup.popoverId}
                    mask={setup.mask}
                    maskReplacement={DATE_MASK_REPLACEMENT}
                    maskTrack={setup.maskTrack}
                    inputMode="numeric"
                    inputSize={setup.inputSize}
                />
                <PickerPopover {...popoverProps} id={setup.popoverId} mobileHeightMode="fit">
                    <Calendar {...calendarProps} size={size} locale={locale} texts={setup.texts} />
                </PickerPopover>
            </div>
        );
    }
);

/**
 * Date picker allows users to input dates by either selecting from a visual calendar or typing directly into a form field.
 */
const DatePicker = Object.assign(SingleDatePicker, {
    Range: RangeDatePicker
});

export { ISingleDatePickerProps, IRangeDatePickerProps, RangeDatePicker, DatePicker as default };
