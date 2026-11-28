import { ChangeEvent, FocusEvent, KeyboardEvent, SyntheticEvent, useEffect, useMemo, useRef } from "react";

import {
    PICKER_RANGE_FIELDS,
    PickerLeaveResult,
    usePickerCore,
    usePickerFieldState
} from "@internal/components/Picker";

// Constants
import { MERIDIEMS, TIME_PART_DEFAULT_12H_HOUR, TIME_PART_DEFAULT_TEXT_VALUE } from "../constants";
// Helpers
import { composeTime, getNearestAvailableTime, parseTime, parseTypedTimeParts, withTimePart } from "../helpers";
// Types
import { TimeParts, TimePickerRangeFields, TimePickerRangeValue } from "../types";

type Bounds = { minParts?: TimeParts | null; maxParts?: TimeParts | null };

// ---------------------------------------------------------
// Shared action helpers
// ---------------------------------------------------------

/**
 * Applies one column pick on top of the current parts (empty columns get defaults) and keeps the
 * result inside the range bounds. Returns the composed time.
 */
const processTimeSelection = (
    prev: TimeParts,
    column: keyof TimeParts,
    value: string,
    is12Hour: boolean,
    { minParts, maxParts }: Bounds
): string => {
    const base: TimeParts = {
        hours: prev.hours ?? (is12Hour ? TIME_PART_DEFAULT_12H_HOUR : TIME_PART_DEFAULT_TEXT_VALUE),
        minutes: prev.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE,
        seconds: prev.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE,
        meridiem: prev.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined)
    };

    const nearest = getNearestAvailableTime(withTimePart(base, column, value), is12Hour, minParts, maxParts);

    return composeTime(nearest, is12Hour);
};

/**
 * The value a field should hold once it loses focus: normalized and clamped to the bounds.
 * `null` when nothing changes; `{ value: null }` when incomplete text is dropped with nothing to
 * restore.
 */
const resolveBlurValue = (
    rawValue: string | null,
    lastValidValue: string | null,
    is12Hour: boolean,
    { minParts, maxParts }: Bounds
): { value: string | null } | null => {
    const parsed = parseTime(rawValue, is12Hour, { allow24HourInput: true });
    const nearest = parsed && getNearestAvailableTime(parsed, is12Hour, minParts, maxParts);

    if (!nearest) {
        return rawValue ? { value: lastValidValue } : null;
    }

    const composedTime = composeTime(nearest, is12Hour);

    return composedTime === rawValue ? null : { value: composedTime };
};

// ---------------------------------------------------------
// Field
// ---------------------------------------------------------

/**
 * Owns the value of one time input. While the field is being typed into, the typed text is shown
 * verbatim; otherwise the value is shown normalized. `parts` are derived from the value, never
 * stored, so the popover selection cannot drift from the text.
 */
const useTimeField = (value: string | null | undefined, defaultValue: string | null | undefined, is12Hour: boolean) => {
    const {
        isControlled,
        committedValue,
        draftValue,
        isEditing,
        setInternalValue,
        setValue,
        setDraftValue,
        setIsEditing
    } = usePickerFieldState(value, defaultValue);

    const rawValue = draftValue ?? committedValue;

    useEffect(() => {
        if (isControlled) return;

        setInternalValue((current) => {
            const parsed = parseTime(current, is12Hour, { allow24HourInput: true });

            return parsed ? composeTime(parsed, is12Hour) : current;
        });
    }, [is12Hour, isControlled]);

    const parsedValue = useMemo(
        () => parseTime(rawValue, is12Hour, { allow24HourInput: !isEditing }),
        [rawValue, is12Hour, isEditing]
    );

    // What the popover highlights: the complete value, or the columns typed so far.
    const parts = useMemo(
        () => parsedValue ?? parseTypedTimeParts(rawValue, is12Hour),
        [parsedValue, rawValue, is12Hour]
    );

    // Last complete value, restored when the field is left with incomplete text.
    const lastValidValueRef = useRef<string | null>(null);

    useEffect(() => {
        if (parsedValue) {
            lastValidValueRef.current = composeTime(parsedValue, is12Hour);
        } else if (!rawValue) {
            lastValidValueRef.current = null;
        }
    }, [parsedValue, rawValue, is12Hour]);

    return {
        text: rawValue,
        value: rawValue,
        rawValue,
        committedValue,
        isEditing,
        displayValue: !isEditing && parsedValue ? composeTime(parsedValue, is12Hour) : rawValue,
        parts,
        lastValidValueRef,
        setValue,
        setTypedText: setDraftValue,
        setIsEditing
    };
};

type TimeField = ReturnType<typeof useTimeField>;

/**
 * Only typed text is committed when a field is left: a value from the props is displayed
 * normalized but never reported back.
 */
const resolveTimeLeave = (
    field: TimeField,
    isEditing: boolean,
    is12Hour: boolean,
    bounds: Bounds
): PickerLeaveResult => {
    const resolved = isEditing
        ? resolveBlurValue(field.rawValue, field.lastValidValueRef.current, is12Hour, bounds)
        : null;

    return resolved ? { value: resolved.value, commit: true } : { value: field.rawValue, commit: false };
};

// ---------------------------------------------------------
// Single picker
// ---------------------------------------------------------

export interface IUseSingleTimePickerOptions {
    value?: string | null;
    defaultValue?: string | null;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    is12Hour?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (time: string, event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/** State and interaction of the single picker, as the props of its input and popover. */
export const useSingleTimePicker = ({
    value,
    defaultValue,
    is12Hour = false,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    ...options
}: IUseSingleTimePickerOptions) => {
    const field = useTimeField(value, defaultValue, is12Hour);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const core = usePickerCore({
        ...options,
        fields: { single: field },
        inputRefs: { single: inputRef },
        initialField: "single",
        resolveLeave: (_name, isEditing) => resolveTimeLeave(field, isEditing, is12Hour, {}),
        onChange: (event) => onChange?.(event),
        onBlur: (values, event) => onBlur?.(values.single, event),
        onFocus: (event) => onFocus?.(event),
        onKeyDown: (event) => onKeyDown?.(event)
    });

    const handlers = core.getFieldHandlers("single");

    return {
        inputProps: { ...core.inputProps, ...handlers, inputRef, value: field.displayValue },
        popoverProps: {
            ...core.popoverProps,
            position: core.getPopoverPosition("start"),
            parts: field.parts,
            onSelect: (column: keyof TimeParts, columnValue: string, event: SyntheticEvent) =>
                core.commit("single", processTimeSelection(field.parts, column, columnValue, is12Hour, {}), event)
        }
    };
};

// ---------------------------------------------------------
// Range picker
// ---------------------------------------------------------

export interface IUseRangeTimePickerOptions {
    value?: { start: string | null; end: string | null };
    defaultValue?: { start: string | null; end: string | null };
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    is12Hour?: boolean;
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        value: TimePickerRangeValue,
        field: TimePickerRangeFields
    ) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    onBlur?: (value: TimePickerRangeValue, event: FocusEvent<HTMLElement>, field: TimePickerRangeFields) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
}

/**
 * State and interaction of the range picker, as the props of its inputs and popover. Each field is
 * bounded by the other's value, so the start never passes the end.
 */
export const useRangeTimePicker = ({
    value,
    defaultValue,
    is12Hour = false,
    onChange,
    onBlur,
    ...options
}: IUseRangeTimePickerOptions) => {
    const fields = {
        start: useTimeField(value ? value.start : undefined, defaultValue?.start, is12Hour),
        end: useTimeField(value ? value.end : undefined, defaultValue?.end, is12Hour)
    };
    const inputRefs = {
        start: useRef<HTMLInputElement | null>(null),
        end: useRef<HTMLInputElement | null>(null)
    };

    const getBounds = (field: TimePickerRangeFields): Bounds => ({
        minParts: field === PICKER_RANGE_FIELDS.END && fields.start.parts.hours ? fields.start.parts : null,
        maxParts: field === PICKER_RANGE_FIELDS.START && fields.end.parts.hours ? fields.end.parts : null
    });

    const core = usePickerCore<TimePickerRangeFields>({
        ...options,
        fields,
        inputRefs,
        initialField: PICKER_RANGE_FIELDS.START,
        resolveLeave: (field, isEditing) => resolveTimeLeave(fields[field], isEditing, is12Hour, getBounds(field)),
        onChange,
        onBlur
    });

    const { activeField, getFieldHandlers } = core;

    return {
        inputProps: {
            ...core.inputProps,
            inputRefs,
            value: { start: fields.start.displayValue, end: fields.end.displayValue },
            onClick: (field: TimePickerRangeFields) => getFieldHandlers(field).onClick(),
            onFocus: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) =>
                getFieldHandlers(field).onFocus(event),
            onChange: (event: ChangeEvent<HTMLInputElement>, field: TimePickerRangeFields) =>
                getFieldHandlers(field).onChange(event),
            onBlur: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) =>
                getFieldHandlers(field).onBlur(event),
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) =>
                getFieldHandlers(field).onKeyDown(event)
        },
        popoverProps: {
            ...core.popoverProps,
            position: core.getPopoverPosition(activeField === PICKER_RANGE_FIELDS.END ? "end" : "start"),
            parts: fields[activeField].parts,
            activeField,
            partsStart: fields.start.parts,
            partsEnd: fields.end.parts,
            onSelect: (column: keyof TimeParts, columnValue: string, event: SyntheticEvent) =>
                core.commit(
                    activeField,
                    processTimeSelection(
                        fields[activeField].parts,
                        column,
                        columnValue,
                        is12Hour,
                        getBounds(activeField)
                    ),
                    event
                )
        }
    };
};
