import { ChangeEvent, FocusEvent, KeyboardEvent, SyntheticEvent, useEffect, useMemo, useRef } from "react";

import {
    PICKER_RANGE_FIELDS,
    PickerLeaveResult,
    usePickerCore,
    usePickerFieldState
} from "@internal/components/Picker";

// Helpers
import {
    createBounds,
    formatDate,
    fromISO,
    getNearestAvailableDate,
    getToday,
    isDateOutOfBounds,
    isFormattedDate,
    parseDate,
    resolveRangePreset,
    resolveSinglePreset,
    toISO
} from "../helpers";
// Types
import {
    CalendarDate,
    CalendarPresetState,
    DateBounds,
    DatePickerFormat,
    DatePickerPreset,
    DatePickerRangeFields,
    DatePickerRangePreset,
    DatePickerRangeValue
} from "../types";

/**
 * The value typed text stands for: an ISO date once the text is a complete, existing and allowed
 * date, `null` for an emptied field, and `undefined` for anything else, which is left to the blur.
 */
const getTypedDateValue = (text: string, format: DatePickerFormat, bounds: DateBounds): string | null | undefined => {
    if (!text) return null;

    const date = parseDate(text, format);

    if (!date || !isFormattedDate(text, date, format) || isDateOutOfBounds(date, bounds)) return undefined;

    return toISO(date);
};

/**
 * Owns the value of one date input. The value is an ISO date; the input shows it in `format`, or
 * the typed text verbatim while the field is being typed into. The selected day is derived from
 * the text, never stored, so the calendar cannot drift from the input.
 */
const useDateField = (
    value: string | null | undefined,
    defaultValue: string | null | undefined,
    format: DatePickerFormat
) => {
    const { committedValue, draftValue, isEditing, setValue, setDraftValue, setIsEditing } = usePickerFieldState(
        value,
        defaultValue
    );

    const committedDate = useMemo(() => fromISO(committedValue), [committedValue]);
    const draftDate = useMemo(() => parseDate(draftValue, format), [draftValue, format]);

    const lastValidValueRef = useRef<string | null>(committedDate ? committedValue : null);

    useEffect(() => {
        lastValidValueRef.current = committedDate ? committedValue : null;
    }, [committedDate]);

    const getDraftValue = (draft: string): string | null => {
        if (!draft) return null;

        return draftDate && isFormattedDate(draft, draftDate, format) ? toISO(draftDate) : lastValidValueRef.current;
    };

    return {
        text: draftValue ?? (committedDate ? formatDate(committedDate, format) : ""),
        value: draftValue !== null ? getDraftValue(draftValue) : committedValue,
        committedValue,
        isEditing,
        date: draftValue !== null ? draftDate : committedDate,
        lastValidValueRef,
        setValue: (nextValue: string | null) => {
            lastValidValueRef.current = nextValue;
            setValue(nextValue);
        },
        setTypedText: setDraftValue,
        setIsEditing
    };
};

type DateField = ReturnType<typeof useDateField>;

/**
 * Whether the field already holds `value`, so that reporting it would not be a change.
 */
const isHeldValue = (field: DateField, value: string | null): boolean =>
    value === field.committedValue && value === field.lastValidValueRef.current;

/**
 * The value typed text changes the field to: `undefined` while the text is not a value, and when it
 * is the value the field already holds.
 */
const getTypedChange = (
    field: DateField,
    text: string,
    format: DatePickerFormat,
    bounds: DateBounds
): string | null | undefined => {
    const value = getTypedDateValue(text, format, bounds);

    return value !== undefined && isHeldValue(field, value) ? undefined : value;
};

/**
 * The value a field settles on when it is left. A typed date that was already reported stays as it
 * is; a complete date that needed clamping is committed clamped, unless the field already holds it;
 * incomplete text falls back to the last value the field held.
 */
const resolveDateLeave = (
    field: DateField,
    isEditing: boolean,
    format: DatePickerFormat,
    bounds: DateBounds
): PickerLeaveResult => {
    if (!isEditing) return { value: field.committedValue, commit: false };

    const typedValue = getTypedDateValue(field.text, format, bounds);

    if (typedValue !== undefined) return { value: typedValue, commit: false };

    const date = parseDate(field.text, format);

    if (!date) return { value: field.lastValidValueRef.current, commit: false };

    const value = toISO(getNearestAvailableDate(date, bounds));

    return { value, commit: !isHeldValue(field, value) };
};

const useLimits = (min?: string | null, max?: string | null) =>
    useMemo(() => ({ min: fromISO(min), max: fromISO(max) }), [min, max]);

interface IDatePickerHookOptions {
    format: DatePickerFormat;
    min?: string | null;
    max?: string | null;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
}

interface IUseSingleDatePickerOptions extends IDatePickerHookOptions {
    value?: string | null;
    defaultValue?: string | null;
    presets?: DatePickerPreset[];
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (date: string, event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/** State and interaction of the single picker, as the props of its input, popover and calendar. */
export const useSingleDatePicker = ({
    value,
    defaultValue,
    format,
    min,
    max,
    presets,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    ...options
}: IUseSingleDatePickerOptions) => {
    const field = useDateField(value, defaultValue, format);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const limits = useLimits(min, max);
    const bounds = useMemo(() => createBounds([limits.min], [limits.max]), [limits]);

    const core = usePickerCore({
        ...options,
        fields: { single: field },
        inputRefs: { single: inputRef },
        initialField: "single",
        getTypedValue: (_name, text) => getTypedChange(field, text, format, bounds),
        resolveLeave: (_name, isEditing) => resolveDateLeave(field, isEditing, format, bounds),
        onChange: (event) => onChange?.(event),
        onBlur: (values, event) => onBlur?.(values.single, event),
        onFocus: (event) => onFocus?.(event),
        onKeyDown: (event) => onKeyDown?.(event)
    });

    const { focusOnOpen, onTabOut, ...popoverProps } = core.popoverProps;

    const getPresets = (): CalendarPresetState[] | undefined => {
        if (!presets?.length) return undefined;

        const today = getToday();

        return presets.map((preset, index) => {
            const day = resolveSinglePreset(preset, today);

            return {
                key: String(index),
                label: preset.label,
                selected: !!day && field.value === toISO(day),
                disabled: !day || isDateOutOfBounds(day, bounds)
            };
        });
    };

    const handlePresetSelect = (key: string, event: SyntheticEvent) => {
        const preset = presets?.[Number(key)];
        const day = preset && resolveSinglePreset(preset, getToday());

        if (day) core.commit("single", toISO(day), event);
    };

    return {
        inputProps: { ...core.inputProps, ...core.getFieldHandlers("single"), inputRef, value: field.text },
        popoverProps: { ...popoverProps, position: core.getPopoverPosition("start") },
        calendarProps: {
            selection: { start: field.date, end: null },
            bounds,
            presets: popoverProps.open ? getPresets() : undefined,
            focusOnOpen,
            onTabOut,
            onSelect: (date: CalendarDate, event: SyntheticEvent) => core.commit("single", toISO(date), event),
            onPresetSelect: handlePresetSelect
        }
    };
};

interface IUseRangeDatePickerOptions extends IDatePickerHookOptions {
    value?: { start: string | null; end: string | null };
    defaultValue?: { start: string | null; end: string | null };
    presets?: DatePickerRangePreset[];
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        value: DatePickerRangeValue,
        field: DatePickerRangeFields
    ) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: DatePickerRangeFields) => void;
    onBlur?: (value: DatePickerRangeValue, event: FocusEvent<HTMLElement>, field: DatePickerRangeFields) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: DatePickerRangeFields) => void;
}

/**
 * State and interaction of the range picker, as the props of its inputs, popover and calendar. Each
 * field is bounded by the other's value, so the start never passes the end. A day picked for the
 * start moves the editing on to the end.
 */
export const useRangeDatePicker = ({
    value,
    defaultValue,
    format,
    min,
    max,
    presets,
    ...options
}: IUseRangeDatePickerOptions) => {
    const fields = {
        start: useDateField(value ? value.start : undefined, defaultValue?.start, format),
        end: useDateField(value ? value.end : undefined, defaultValue?.end, format)
    };
    const inputRefs = {
        start: useRef<HTMLInputElement | null>(null),
        end: useRef<HTMLInputElement | null>(null)
    };
    const limits = useLimits(min, max);
    const limitBounds = useMemo(() => createBounds([limits.min], [limits.max]), [limits]);

    const getBounds = (field: DatePickerRangeFields): DateBounds =>
        field === PICKER_RANGE_FIELDS.END
            ? createBounds([limits.min, fields.start.date], [limits.max])
            : createBounds([limits.min], [limits.max, fields.end.date]);

    const core = usePickerCore<DatePickerRangeFields>({
        ...options,
        fields,
        inputRefs,
        initialField: PICKER_RANGE_FIELDS.START,
        getTypedValue: (field, text) => getTypedChange(fields[field], text, format, getBounds(field)),
        resolveLeave: (field, isEditing) => resolveDateLeave(fields[field], isEditing, format, getBounds(field))
    });

    const { activeField, getFieldHandlers } = core;
    const { focusOnOpen, onTabOut, ...popoverProps } = core.popoverProps;

    const handleSelect = (date: CalendarDate, event: SyntheticEvent) => {
        core.commit(activeField, toISO(date), event);

        if (activeField !== PICKER_RANGE_FIELDS.START) return;

        core.setActiveField(PICKER_RANGE_FIELDS.END);

        // A pick with the mouse leaves the focus in the start input; from the keyboard it stays in the calendar.
        if (!core.isFocusInPopover()) core.moveFocusTo(PICKER_RANGE_FIELDS.END);
    };

    const getPresets = (): CalendarPresetState[] | undefined => {
        if (!presets?.length) return undefined;

        const today = getToday();

        return presets.map((preset, index) => {
            const range = resolveRangePreset(preset, today);

            return {
                key: String(index),
                label: preset.label,
                selected: !!range && fields.start.value === toISO(range.start) && fields.end.value === toISO(range.end),
                disabled:
                    !range || isDateOutOfBounds(range.start, limitBounds) || isDateOutOfBounds(range.end, limitBounds)
            };
        });
    };

    const handlePresetSelect = (key: string, event: SyntheticEvent) => {
        const preset = presets?.[Number(key)];
        const range = preset && resolveRangePreset(preset, getToday());

        if (range) {
            core.commitValues({ start: toISO(range.start), end: toISO(range.end) }, PICKER_RANGE_FIELDS.START, event);
        }
    };

    return {
        inputProps: {
            ...core.inputProps,
            inputRefs,
            value: { start: fields.start.text, end: fields.end.text },
            onClick: (field: DatePickerRangeFields) => getFieldHandlers(field).onClick(),
            onFocus: (event: FocusEvent<HTMLInputElement>, field: DatePickerRangeFields) =>
                getFieldHandlers(field).onFocus(event),
            onChange: (event: ChangeEvent<HTMLInputElement>, field: DatePickerRangeFields) =>
                getFieldHandlers(field).onChange(event),
            onBlur: (event: FocusEvent<HTMLInputElement>, field: DatePickerRangeFields) =>
                getFieldHandlers(field).onBlur(event),
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>, field: DatePickerRangeFields) =>
                getFieldHandlers(field).onKeyDown(event)
        },
        popoverProps: {
            ...popoverProps,
            position: core.getPopoverPosition(activeField === PICKER_RANGE_FIELDS.END ? "end" : "start")
        },
        calendarProps: {
            selection: { start: fields.start.date, end: fields.end.date },
            activeField,
            bounds: getBounds(activeField),
            presets: popoverProps.open ? getPresets() : undefined,
            focusOnOpen,
            onTabOut,
            onSelect: handleSelect,
            onPresetSelect: handlePresetSelect
        }
    };
};
