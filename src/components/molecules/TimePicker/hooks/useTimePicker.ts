import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { IPopoverProps, IPopoverRef } from "@components/atoms/Popover";

// Constants
import {
    EMPTY_TIME_PARTS,
    KEYS,
    MERIDIEMS,
    PICKER_RANGE_FIELDS,
    TIME_PART_DEFAULT_12H_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE
} from "../constants";
// Helpers
import { composeTime, getNearestAvailableTime, parseTime, withTimePart } from "../helpers";
// Types
import {
    ShouldDisableTime,
    TimeParts,
    TimePickerChangeContext,
    TimePickerRangeChangeContext,
    TimePickerRangeFields
} from "../types";

type PopoverCloseHandler = NonNullable<IPopoverProps["onClose"]>;

const ESCAPE_CLOSE_REASON = "escape-key";

/**
 * Keys that open the popover from the input, mirroring the `Dropdown` trigger behaviour.
 */
const OPEN_KEYS: string[] = [KEYS.ARROW_DOWN, KEYS.ENTER, KEYS.SPACE];

// ---------------------------------------------------------
// Shared action helpers
// ---------------------------------------------------------

/**
 * @description
 * Applies a single column selection on top of the current parts and validates the result.
 *
 * Returns `null` when no allowed time exists, so the caller can reject the interaction instead of
 * committing (and emitting) a value that is actually disabled.
 */
const processTimeSelection = (
    prev: TimeParts,
    column: keyof TimeParts,
    value: string,
    is12Hour: boolean,
    shouldDisableTime?: ShouldDisableTime,
    minParts: TimeParts | null = null,
    maxParts: TimeParts | null = null
): { nextParts: TimeParts; composedTime: string } | null => {
    const base: TimeParts = {
        hours: prev.hours ?? (is12Hour ? TIME_PART_DEFAULT_12H_HOUR : TIME_PART_DEFAULT_TEXT_VALUE),
        minutes: prev.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE,
        seconds: prev.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE,
        meridiem: prev.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined)
    };

    const nearest = getNearestAvailableTime(
        withTimePart(base, column, value),
        is12Hour,
        shouldDisableTime,
        minParts,
        maxParts
    );

    if (!nearest) return null;

    return { nextParts: nearest, composedTime: composeTime(nearest, is12Hour) };
};

/**
 * @description
 * Works out what a field should hold once it loses focus.
 *
 * Typed text is committed verbatim while the field has focus, so normalization (padding, 24 to
 * 12-hour conversion) and clamping against `shouldDisableTime` / the range bounds happen here.
 * Returns `null` when there is nothing to change.
 */
const resolveBlurValue = (
    rawValue: string | null,
    lastValidValue: string | null,
    is12Hour: boolean,
    shouldDisableTime?: ShouldDisableTime,
    minParts: TimeParts | null = null,
    maxParts: TimeParts | null = null
): { value: string | null; parts: TimeParts | null } | null => {
    const parsed = parseTime(rawValue, is12Hour, { allow24HourInput: true });
    const nearest = parsed && getNearestAvailableTime(parsed, is12Hour, shouldDisableTime, minParts, maxParts);

    // Incomplete, or nothing allowed: fall back to the last complete value, or empty the field.
    if (!nearest) {
        if (!rawValue) return null;

        return {
            value: lastValidValue,
            parts: parseTime(lastValidValue, is12Hour, { allow24HourInput: true })
        };
    }

    const composedTime = composeTime(nearest, is12Hour);

    if (composedTime === rawValue) return null;

    return { value: composedTime, parts: nearest };
};

// ---------------------------------------------------------
// Field state
// ---------------------------------------------------------

/**
 * @description
 * Owns the value of a single time input (the single picker has one, the range picker two).
 *
 * `parts` are **derived** from the value rather than mirrored into a second state: composing and
 * parsing round trip exactly, so a separate `parts` state could only ever drift out of sync (for
 * example a controlled `value` reset to `null` used to leave the popover highlighting the old
 * time).
 *
 * Whether the field is being edited decides how the value is read:
 * - while it has focus the typed text is authoritative and is rendered verbatim, so the mask is
 *   never fought and every character (including the meridiem) can be deleted or replaced;
 * - once it is left — and for values that arrive from the `value`/`defaultValue` props or from a
 *   `format` switch — the value is normalized, which keeps the input text and the popover
 *   selection in agreement.
 */
const useTimeField = (value: string | null | undefined, defaultValue: string | null | undefined, is12Hour: boolean) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
    const [isEditing, setIsEditing] = useState(false);

    const rawValue = isControlled ? (value ?? null) : internalValue;

    const parsedValue = useMemo(
        () => parseTime(rawValue, is12Hour, { allow24HourInput: !isEditing }),
        [rawValue, is12Hour, isEditing]
    );

    const displayValue = !isEditing && parsedValue ? composeTime(parsedValue, is12Hour) : rawValue;
    const parts = parsedValue ?? EMPTY_TIME_PARTS;

    /**
     * Last complete value, used to restore the field when the user leaves partially typed input.
     */
    const lastValidValueRef = useRef<string | null>(null);

    useEffect(() => {
        if (parsedValue) {
            lastValidValueRef.current = composeTime(parsedValue, is12Hour);
            return;
        }

        if (!rawValue) {
            lastValidValueRef.current = null;
        }
    }, [parsedValue, rawValue, is12Hour]);

    const setValue = (nextValue: string | null) => {
        if (isControlled) return;
        setInternalValue(nextValue);
    };

    return {
        isControlled,
        rawValue,
        displayValue,
        parsedValue,
        parts,
        setValue,
        setIsEditing,
        lastValidValueRef
    };
};

// ---------------------------------------------------------
// Base picker
// ---------------------------------------------------------

interface IBasePickerOptions {
    disabled?: boolean;
    readOnly?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * @description
 * Shared popover plumbing for the single and the range picker.
 *
 * No outside click listener is registered here on purpose: `atoms/Popover` already closes itself
 * on outside press and on `Escape` (`useClickOutside` / `useDismiss` inside `Popover`) and reports
 * it through `onClose`. Listening a second time made every outside click emit `onOpenChange`
 * twice and re-registered a `mousedown` listener on every render.
 */
const useBasePicker = ({ disabled, readOnly, onOpenChange }: IBasePickerOptions) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [shouldFocusPopover, setShouldFocusPopover] = useState(false);
    const [anchorProps, setAnchorProps] = useState({});

    const popoverOpenRef = useRef(false);

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const isInteractive = !disabled && !readOnly;

    /**
     * @param nextOpen target state
     * @param focusOnOpen move focus into the popover, used when it was opened from the keyboard
     */
    const togglePopover = (nextOpen: boolean, focusOnOpen = false) => {
        if (nextOpen && !isInteractive) return;
        // Guard against duplicated events: clicking an already open input used to emit
        // `onOpenChange(true)` again on every click.
        if (popoverOpenRef.current === nextOpen) return;

        popoverOpenRef.current = nextOpen;
        setPopoverOpen(nextOpen);
        setShouldFocusPopover(nextOpen && focusOnOpen);
        onOpenChange?.(nextOpen);
    };

    return {
        popoverOpen,
        shouldFocusPopover,
        togglePopover,
        anchorProps,
        setAnchorProps,
        popoverRef,
        isInteractive
    };
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
    shouldDisableTime?: ShouldDisableTime;
    onChange?: (time: string, context: TimePickerChangeContext) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * @description
 * State and interaction handling of the single time picker.
 */
export const useSingleTimePicker = ({
    value,
    defaultValue,
    clearable,
    disabled,
    readOnly,
    is12Hour = false,
    shouldDisableTime,
    onChange,
    onClear,
    onOpenChange,
    onFocus,
    onBlur,
    onKeyDown
}: IUseSingleTimePickerOptions) => {
    const base = useBasePicker({ disabled, readOnly, onOpenChange });
    const field = useTimeField(value, defaultValue, is12Hour);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        field.setIsEditing(true);
        onFocus?.(event);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!base.isInteractive) return;

        const nextValue = event.target.value;

        field.setIsEditing(true);
        field.setValue(nextValue);
        onChange?.(nextValue, { source: "input", parts: parseTime(nextValue, is12Hour) });
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        field.setIsEditing(false);
        onBlur?.(event);

        if (!base.isInteractive) return;

        const resolved = resolveBlurValue(field.rawValue, field.lastValidValueRef.current, is12Hour, shouldDisableTime);

        if (!resolved) return;

        field.setValue(resolved.value);
        onChange?.(resolved.value ?? "", { source: "input", parts: resolved.parts });
    };

    const handleSelect = (column: keyof TimeParts, val: string) => {
        if (!base.isInteractive) return;

        const result = processTimeSelection(field.parts, column, val, is12Hour, shouldDisableTime);
        if (!result) return;

        field.setValue(result.composedTime);
        onChange?.(result.composedTime, { source: "select", parts: result.nextParts });
    };

    const handleClear = () => {
        onClear?.();

        if (!clearable) return;

        field.setValue(null);
        base.togglePopover(false);
        onChange?.("", { source: "clear", parts: null });
        inputRef.current?.focus();
    };

    const handleInputClick = () => base.togglePopover(true);

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        if (!base.isInteractive) return;

        if (OPEN_KEYS.includes(event.key)) {
            event.preventDefault();
            base.togglePopover(true, true);
        }
    };

    const handlePopoverClose: PopoverCloseHandler = (_event, reason) => {
        base.togglePopover(false);

        if (reason === ESCAPE_CLOSE_REASON) {
            inputRef.current?.focus();
        }
    };

    return {
        ...base,
        inputRef,
        value: field.displayValue,
        parts: field.parts,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        handleInputClick,
        handleInputKeyDown,
        handleSelect,
        handleClear,
        handlePopoverClose
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
    shouldDisableTime?: ShouldDisableTime;
    onChange?: (time: string, context: TimePickerRangeChangeContext) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
}

/**
 * @description
 * State and interaction handling of the range time picker.
 */
export const useRangeTimePicker = ({
    value,
    defaultValue,
    clearable,
    disabled,
    readOnly,
    is12Hour = false,
    shouldDisableTime,
    onChange,
    onClear,
    onOpenChange,
    onFocus,
    onBlur,
    onKeyDown
}: IUseRangeTimePickerOptions) => {
    const base = useBasePicker({ disabled, readOnly, onOpenChange });

    const startField = useTimeField(value ? value.start : undefined, defaultValue?.start, is12Hour);
    const endField = useTimeField(value ? value.end : undefined, defaultValue?.end, is12Hour);

    const [activeField, setActiveField] = useState<TimePickerRangeFields>(PICKER_RANGE_FIELDS.START);

    const startInputRef = useRef<HTMLInputElement | null>(null);
    const endInputRef = useRef<HTMLInputElement | null>(null);

    const getFieldRefs = (field: TimePickerRangeFields) =>
        field === PICKER_RANGE_FIELDS.START
            ? { current: startField, inputRef: startInputRef }
            : { current: endField, inputRef: endInputRef };

    /**
     * The start field can never go past the end one and vice versa, which is expressed as a
     * min/max bound around the value of the opposite field.
     */
    const getBounds = (field: TimePickerRangeFields) => {
        const isStart = field === PICKER_RANGE_FIELDS.START;

        return {
            minParts: !isStart && startField.parts.hours ? startField.parts : null,
            maxParts: isStart && endField.parts.hours ? endField.parts : null
        };
    };

    const handleInputClick = (field: TimePickerRangeFields) => {
        setActiveField(field);
        base.togglePopover(true);
    };

    const handleInputFocus = (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => {
        setActiveField(field);
        getFieldRefs(field).current.setIsEditing(true);
        onFocus?.(event, field);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, field: TimePickerRangeFields) => {
        if (!base.isInteractive) return;

        const { current } = getFieldRefs(field);
        const nextValue = event.target.value;

        current.setIsEditing(true);
        current.setValue(nextValue);
        onChange?.(nextValue, { field, source: "input", parts: parseTime(nextValue, is12Hour) });
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => {
        const { current } = getFieldRefs(field);
        const { minParts, maxParts } = getBounds(field);

        current.setIsEditing(false);
        onBlur?.(event, field);

        if (!base.isInteractive) return;

        const resolved = resolveBlurValue(
            current.rawValue,
            current.lastValidValueRef.current,
            is12Hour,
            shouldDisableTime,
            minParts,
            maxParts
        );

        if (!resolved) return;

        current.setValue(resolved.value);
        onChange?.(resolved.value ?? "", { field, source: "input", parts: resolved.parts });
    };

    const handleSelect = (column: keyof TimeParts, val: string) => {
        if (!base.isInteractive) return;

        const { current } = getFieldRefs(activeField);
        const { minParts, maxParts } = getBounds(activeField);

        const result = processTimeSelection(
            current.parts,
            column,
            val,
            is12Hour,
            shouldDisableTime,
            minParts,
            maxParts
        );

        if (!result) return;

        current.setValue(result.composedTime);
        onChange?.(result.composedTime, { field: activeField, source: "select", parts: result.nextParts });
    };

    const handleClear = () => {
        onClear?.();

        if (!clearable) return;

        startField.setValue(null);
        endField.setValue(null);
        setActiveField(PICKER_RANGE_FIELDS.START);
        base.togglePopover(false);

        onChange?.("", { field: PICKER_RANGE_FIELDS.START, source: "clear", parts: null });
        startInputRef.current?.focus();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => {
        onKeyDown?.(event, field);

        if (!base.isInteractive) return;

        if (OPEN_KEYS.includes(event.key)) {
            event.preventDefault();
            setActiveField(field);
            base.togglePopover(true, true);
        }
    };

    const handlePopoverClose: PopoverCloseHandler = (_event, reason) => {
        base.togglePopover(false);

        if (reason === ESCAPE_CLOSE_REASON) {
            getFieldRefs(activeField).inputRef.current?.focus();
        }
    };

    return {
        ...base,
        activeField,
        startInputRef,
        endInputRef,
        value: { start: startField.displayValue, end: endField.displayValue },
        partsStart: startField.parts,
        partsEnd: endField.parts,
        handleInputClick,
        handleInputFocus,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        handleSelect,
        handleClear,
        handlePopoverClose
    };
};
