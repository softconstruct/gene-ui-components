import { ChangeEvent, FocusEvent, KeyboardEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

import { IPopoverProps, IPopoverRef } from "@components/atoms/Popover";

// Hooks
import useDebouncedCallback from "@hooks/useDebounceCallback";

// Constants
import {
    EMPTY_TIME_PARTS,
    INPUT_CHANGE_DEBOUNCE_MS,
    KEYS,
    MERIDIEMS,
    PICKER_RANGE_FIELDS,
    TIME_PART_DEFAULT_12H_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE
} from "../constants";
// Helpers
import { composeTime, getNearestAvailableTime, parseTime, withTimePart } from "../helpers";
// Types
import { TimeParts, TimePickerChangeContext, TimePickerRangeChangeContext, TimePickerRangeFields } from "../types";

type PopoverCloseHandler = NonNullable<IPopoverProps["onClose"]>;
type PopoverPosition = "bottom-left" | "bottom-right";
type Bounds = { minParts?: TimeParts | null; maxParts?: TimeParts | null };
type InputRef = MutableRefObject<HTMLInputElement | null>;

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
 * Applies a single column selection on top of the current parts, filling the columns that have no
 * value yet, and keeps the result inside the range bounds.
 */
const processTimeSelection = (
    prev: TimeParts,
    column: keyof TimeParts,
    value: string,
    is12Hour: boolean,
    { minParts, maxParts }: Bounds
): { nextParts: TimeParts; composedTime: string } => {
    const base: TimeParts = {
        hours: prev.hours ?? (is12Hour ? TIME_PART_DEFAULT_12H_HOUR : TIME_PART_DEFAULT_TEXT_VALUE),
        minutes: prev.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE,
        seconds: prev.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE,
        meridiem: prev.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined)
    };

    const nearest = getNearestAvailableTime(withTimePart(base, column, value), is12Hour, minParts, maxParts);

    return { nextParts: nearest, composedTime: composeTime(nearest, is12Hour) };
};

/**
 * @description
 * Works out what a field should hold once it loses focus.
 *
 * Typed text is committed verbatim while the field has focus, so normalization (padding, 24 to
 * 12-hour conversion) and clamping against the range bounds happen here.
 * Returns `null` when there is nothing to change.
 */
const resolveBlurValue = (
    rawValue: string | null,
    lastValidValue: string | null,
    is12Hour: boolean,
    { minParts, maxParts }: Bounds
): { value: string | null; parts: TimeParts | null } | null => {
    const parsed = parseTime(rawValue, is12Hour, { allow24HourInput: true });
    const nearest = parsed && getNearestAvailableTime(parsed, is12Hour, minParts, maxParts);

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
// Typed changes
// ---------------------------------------------------------

/**
 * Reports typed text through `onChange` after a pause, or at once when the field is left.
 */
const useTypedChange = <TArgs extends unknown[]>(onChange?: (...args: TArgs) => void) => {
    const pendingRef = useRef<TArgs | null>(null);

    const emitPending = () => {
        const pending = pendingRef.current;
        pendingRef.current = null;

        if (pending) {
            onChange?.(...pending);
        }
    };

    const { debouncedCallback: emitLater, clearDebounce } = useDebouncedCallback(emitPending, INPUT_CHANGE_DEBOUNCE_MS);

    useEffect(() => clearDebounce, [clearDebounce]);

    return {
        report: (...args: TArgs) => {
            pendingRef.current = args;
            emitLater();
        },
        flush: () => {
            clearDebounce();
            emitPending();
        }
    };
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
 * - from the first keystroke until the field is left, the typed text is authoritative and is
 *   rendered verbatim, so the mask is never fought and every character (including the meridiem)
 *   can be deleted or replaced;
 * - otherwise — including a plain focus or click, and for values that arrive from the
 *   `value`/`defaultValue` props — the value is normalized, which keeps the input text and the
 *   popover selection in agreement.
 */
const useTimeField = (value: string | null | undefined, defaultValue: string | null | undefined, is12Hour: boolean) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
    const [draftValue, setDraftValue] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const committedValue = isControlled ? (value ?? null) : internalValue;
    const rawValue = isEditing && draftValue !== null ? draftValue : committedValue;

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

    /**
     * Last complete value, used to restore the field when the user leaves partially typed input.
     */
    const lastValidValueRef = useRef<string | null>(null);

    useEffect(() => {
        if (parsedValue) {
            lastValidValueRef.current = composeTime(parsedValue, is12Hour);
        } else if (!rawValue) {
            lastValidValueRef.current = null;
        }
    }, [parsedValue, rawValue, is12Hour]);

    const setValue = (nextValue: string | null) => {
        if (!isControlled) setInternalValue(nextValue);
    };

    return {
        rawValue,
        displayValue: !isEditing && parsedValue ? composeTime(parsedValue, is12Hour) : rawValue,
        parts: parsedValue ?? EMPTY_TIME_PARTS,
        lastValidValueRef,
        setValue,
        setTypedValue: (nextValue: string) => {
            setDraftValue(nextValue);
            setValue(nextValue);
        },
        setIsEditing: (editing: boolean) => {
            setIsEditing(editing);
            if (!editing) setDraftValue(null);
        }
    };
};

type TimeField = ReturnType<typeof useTimeField>;

// ---------------------------------------------------------
// Core
// ---------------------------------------------------------

interface ITimePickerCoreOptions<F extends string> {
    fields: Record<F, TimeField>;
    inputRefs: Record<F, InputRef>;
    initialField: F;
    is12Hour: boolean;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    getBounds?: (field: F) => Bounds;
    onChange?: (field: F, time: string, context: TimePickerChangeContext) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: F) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>, field: F) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: F) => void;
}

/**
 * @description
 * Popover and field interaction shared by the single and the range picker. The popover follows the
 * focus: it opens on focus-in and closes once the focus leaves both the field and the popover.
 *
 * No outside click listener is registered here on purpose: `atoms/Popover` already closes itself
 * on outside press and on `Escape` and reports it through `onClose`.
 */
const useTimePickerCore = <F extends string>({
    fields,
    inputRefs,
    initialField,
    is12Hour,
    clearable,
    disabled,
    readOnly,
    getBounds = () => ({}),
    onChange,
    onClear,
    onOpenChange,
    onFocus,
    onBlur,
    onKeyDown
}: ITimePickerCoreOptions<F>) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [shouldFocusPopover, setShouldFocusPopover] = useState(false);
    const [anchorProps, setAnchorProps] = useState<Record<string, unknown>>({});
    const [activeField, setActiveField] = useState<F>(initialField);

    const popoverOpenRef = useRef(false);
    const skipOpenOnFocusRef = useRef(false);
    const shellRef = useRef<HTMLDivElement | null>(null);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const typedChange = useTypedChange(onChange);
    const isInteractive = !disabled && !readOnly;

    /**
     * `Popover`'s reference props go to the shell without their ARIA attributes; the `ref` is merged
     * with the shell's own ref.
     */
    const { ref: anchorRef, ...anchorRest } = Object.fromEntries(
        Object.entries(anchorProps).filter(([key]) => !key.startsWith("aria-"))
    ) as { ref?: (node: HTMLElement | null) => void } & Record<string, unknown>;

    /**
     * `atoms/Popover` ignores RTL, so the side follows the edited field here.
     */
    const getPopoverPosition = (alignment: "start" | "end"): PopoverPosition => {
        const isRTL = typeof document !== "undefined" && document.dir === "rtl";

        return (alignment === "start") !== isRTL ? "bottom-left" : "bottom-right";
    };

    const isWithinPicker = (target: EventTarget | null): boolean => {
        if (!(target instanceof Node)) return false;

        const floating = popoverRef.current.floatingElement.current;

        return !!shellRef.current?.contains(target) || (floating instanceof Node && floating.contains(target));
    };

    /**
     * @param nextOpen target state
     * @param focusOnOpen move focus into the popover, used when it was opened from the keyboard
     */
    const togglePopover = (nextOpen: boolean, focusOnOpen = false) => {
        if (nextOpen && !isInteractive) return;

        if (popoverOpenRef.current === nextOpen) {
            if (nextOpen && focusOnOpen) setShouldFocusPopover(true);

            return;
        }

        popoverOpenRef.current = nextOpen;
        setPopoverOpen(nextOpen);
        setShouldFocusPopover(nextOpen && focusOnOpen);
        onOpenChange?.(nextOpen);
    };

    const handleFocusOut = (event: FocusEvent<Element>) => {
        if (!isWithinPicker(event.relatedTarget)) togglePopover(false);
    };

    const focusInputSilently = (input: HTMLInputElement | null) => {
        if (!input || document.activeElement === input) return;

        skipOpenOnFocusRef.current = true;
        input.focus();
        skipOpenOnFocusRef.current = false;
    };

    const getFieldHandlers = (field: F) => {
        const current = fields[field];

        return {
            onClick: () => {
                setActiveField(field);
                togglePopover(true);
            },
            onFocus: (event: FocusEvent<HTMLInputElement>) => {
                setActiveField(field);
                onFocus?.(event, field);
                setShouldFocusPopover(false);

                if (!skipOpenOnFocusRef.current) togglePopover(true);
            },
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                if (!isInteractive) return;

                const nextValue = event.target.value;

                current.setIsEditing(true);

                if (nextValue === current.rawValue) return;

                current.setTypedValue(nextValue);
                typedChange.report(field, nextValue, { source: "input", parts: parseTime(nextValue, is12Hour) });
            },
            onBlur: (event: FocusEvent<HTMLInputElement>) => {
                current.setIsEditing(false);
                onBlur?.(event, field);
                handleFocusOut(event);

                if (!isInteractive) return;

                typedChange.flush();

                const resolved = resolveBlurValue(
                    current.rawValue,
                    current.lastValidValueRef.current,
                    is12Hour,
                    getBounds(field)
                );

                if (!resolved) return;

                current.setValue(resolved.value);
                onChange?.(field, resolved.value ?? "", { source: "input", parts: resolved.parts });
            },
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
                onKeyDown?.(event, field);

                if (!isInteractive || !OPEN_KEYS.includes(event.key)) return;

                event.preventDefault();
                setActiveField(field);
                togglePopover(true, true);
            }
        };
    };

    const handleSelect = (column: keyof TimeParts, value: string) => {
        if (!isInteractive) return;

        const current = fields[activeField];
        const result = processTimeSelection(current.parts, column, value, is12Hour, getBounds(activeField));

        if (result.composedTime === current.rawValue) return;

        current.setValue(result.composedTime);
        onChange?.(activeField, result.composedTime, { source: "select", parts: result.nextParts });
    };

    const handleClear = () => {
        onClear?.();

        if (!clearable) return;

        const allFields = Object.values<TimeField>(fields);
        const hadValue = allFields.some((field) => !!field.rawValue);

        allFields.forEach((field) => field.setValue(null));
        setActiveField(initialField);
        togglePopover(false);

        if (hadValue) {
            onChange?.(initialField, "", { source: "clear", parts: null });
        }

        focusInputSilently(inputRefs[initialField].current);
    };

    const handlePopoverClose: PopoverCloseHandler = (_event, reason) => {
        togglePopover(false);

        if (reason === ESCAPE_CLOSE_REASON) {
            focusInputSilently(inputRefs[activeField].current);
        }
    };

    const handleShellClick = () => {
        inputRefs[activeField].current?.focus();
        togglePopover(true);
    };

    return {
        activeField,
        getFieldHandlers,
        getPopoverPosition,
        inputProps: {
            isExpanded: popoverOpen,
            anchorProps: anchorRest,
            anchorRef,
            shellRef,
            onAreaClick: handleShellClick,
            onClear: handleClear
        },
        popoverProps: {
            open: popoverOpen,
            focusOnOpen: shouldFocusPopover,
            setProps: setAnchorProps,
            popoverRef,
            onClose: handlePopoverClose,
            onFocusOut: handleFocusOut,
            onSelect: handleSelect
        }
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
    onChange?: (time: string, context: TimePickerChangeContext) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * @description
 * State and interaction handling of the single time picker, returned as the props of its input and
 * of its popover.
 */
export const useSingleTimePicker = ({
    value,
    defaultValue,
    is12Hour = false,
    onChange,
    ...options
}: IUseSingleTimePickerOptions) => {
    const field = useTimeField(value, defaultValue, is12Hour);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const core = useTimePickerCore({
        ...options,
        is12Hour,
        fields: { single: field },
        inputRefs: { single: inputRef },
        initialField: "single",
        onChange: (_field, time, context) => onChange?.(time, context)
    });

    const handlers = core.getFieldHandlers("single");

    return {
        inputProps: { ...core.inputProps, ...handlers, inputRef, value: field.displayValue },
        popoverProps: { ...core.popoverProps, position: core.getPopoverPosition("start"), parts: field.parts }
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
    onChange?: (time: string, context: TimePickerRangeChangeContext) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: TimePickerRangeFields) => void;
}

/**
 * @description
 * State and interaction handling of the range time picker, returned as the props of its inputs and
 * of its popover. The start field can never go past the end one and vice versa, which is expressed
 * as a min/max bound around the value of the opposite field.
 */
export const useRangeTimePicker = ({
    value,
    defaultValue,
    is12Hour = false,
    onChange,
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

    const core = useTimePickerCore<TimePickerRangeFields>({
        ...options,
        is12Hour,
        fields,
        inputRefs,
        initialField: PICKER_RANGE_FIELDS.START,
        getBounds: (field) => ({
            minParts: field === PICKER_RANGE_FIELDS.END && fields.start.parts.hours ? fields.start.parts : null,
            maxParts: field === PICKER_RANGE_FIELDS.START && fields.end.parts.hours ? fields.end.parts : null
        }),
        onChange: (field, time, context) => onChange?.(time, { ...context, field })
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
            partsEnd: fields.end.parts
        }
    };
};
