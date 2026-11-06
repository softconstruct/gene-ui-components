import {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    MutableRefObject,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import { IPopoverProps, IPopoverRef } from "@components/atoms/Popover";

// Hooks
import useDebouncedCallback from "@hooks/useDebounceCallback";

// Constants
import {
    INPUT_CHANGE_DEBOUNCE_MS,
    KEYS,
    MERIDIEMS,
    PICKER_RANGE_FIELDS,
    TIME_PART_DEFAULT_12H_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE
} from "../constants";
// Helpers
import { composeTime, getNearestAvailableTime, parseTime, parseTypedTimeParts, withTimePart } from "../helpers";
// Types
import { TimeParts, TimePickerRangeFields, TimePickerRangeValue } from "../types";

type PopoverCloseHandler = NonNullable<IPopoverProps["onClose"]>;
type PopoverPosition = "bottom-left" | "bottom-right";
type Bounds = { minParts?: TimeParts | null; maxParts?: TimeParts | null };
type InputRef = MutableRefObject<HTMLInputElement | null>;

const ESCAPE_CLOSE_REASON = "escape-key";

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

/**
 * The event reported for a change without an input event of its own (pick, clear, blur commit):
 * a copy of the triggering event with the input as `target` and the time as `target.value`.
 */
const toChangeEvent = (
    event: SyntheticEvent,
    input: HTMLInputElement | null,
    value: string
): ChangeEvent<HTMLInputElement> => {
    const target = { name: input?.name ?? "", id: input?.id ?? "", value };

    return Object.assign(Object.create(Object.getPrototypeOf(event)), event, {
        target,
        currentTarget: target
    }) as ChangeEvent<HTMLInputElement>;
};

// ---------------------------------------------------------
// Typed changes
// ---------------------------------------------------------

/**
 * Reports typed text through `onChange` after a pause, or at once when the field is left.
 */
const useTypedChange = <TPayload>(emit: (payload: TPayload) => void) => {
    const pendingRef = useRef<TPayload | null>(null);

    const emitPending = () => {
        const pending = pendingRef.current;
        pendingRef.current = null;

        if (pending) {
            emit(pending);
        }
    };

    const { debouncedCallback: emitLater, clearDebounce } = useDebouncedCallback(emitPending, INPUT_CHANGE_DEBOUNCE_MS);

    useEffect(() => clearDebounce, [clearDebounce]);

    return {
        report: (payload: TPayload) => {
            pendingRef.current = payload;
            emitLater();
        },
        flush: () => {
            clearDebounce();
            emitPending();
        }
    };
};

/**
 * Owns the value of one time input. While the field is being typed into, the typed text is shown
 * verbatim; otherwise the value is shown normalized. `parts` are derived from the value, never
 * stored, so the popover selection cannot drift from the text.
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

    const setValue = (nextValue: string | null) => {
        if (!isControlled) setInternalValue(nextValue);
    };

    return {
        rawValue,
        /** The value without the typed draft. */
        committedValue,
        /** Whether the field has been typed into since it was last left, picked from or cleared. */
        isEditing,
        displayValue: !isEditing && parsedValue ? composeTime(parsedValue, is12Hour) : rawValue,
        parts,
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
    onChange?: (event: ChangeEvent<HTMLInputElement>, values: Record<F, string>, field: F) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: F) => void;
    onBlur?: (values: Record<F, string>, event: FocusEvent<HTMLElement>, field: F) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: F) => void;
}

/**
 * Popover and field interaction shared by both pickers. The popover opens on click or `ArrowDown`
 * and closes once the focus leaves the field and the popover; `Enter` only closes it, so a form
 * around the picker still submits. Outside presses and `Escape` are handled by `atoms/Popover`.
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
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const typedChange = useTypedChange<{ event: ChangeEvent<HTMLInputElement>; values: Record<F, string>; field: F }>(
        ({ event, values, field }) => onChange?.(event, values, field)
    );
    const isInteractive = !disabled && !readOnly;

    /** The values of all fields with `field` replaced by `time`; an empty field reads as `""`. */
    const getValues = (field?: F, time?: string): Record<F, string> =>
        Object.fromEntries(
            (Object.entries(fields) as [F, TimeField][]).map(([name, current]) => [
                name,
                name === field ? time : (current.committedValue ?? "")
            ])
        ) as Record<F, string>;

    // The Popover's reference props without their ARIA attributes; the `ref` becomes the shell's ref.
    const { ref: anchorRef, ...anchorRest } = Object.fromEntries(
        Object.entries(anchorProps).filter(([key]) => !key.startsWith("aria-"))
    ) as { ref?: (node: HTMLElement | null) => void } & Record<string, unknown>;

    // `atoms/Popover` ignores RTL, so the side follows the edited field here.
    const getPopoverPosition = (alignment: "start" | "end"): PopoverPosition => {
        const isRTL = typeof document !== "undefined" && document.dir === "rtl";

        return (alignment === "start") !== isRTL ? "bottom-left" : "bottom-right";
    };

    // Whether `target` is inside the field or inside the popover.
    const isWithinPicker = (target: EventTarget | null): boolean => {
        if (!(target instanceof Node)) return false;

        const { referenceElement, floatingElement } = popoverRef.current;

        return [referenceElement.current, floatingElement.current].some(
            (element) => element instanceof Node && element.contains(target)
        );
    };

    const isFieldInput = (target: EventTarget | null): boolean =>
        Object.values<InputRef>(inputRefs).some((ref) => ref.current === target);

    /**
     * @param focusOnOpen move the focus into the popover (`ArrowDown`); a click leaves it in the
     * input, so `Tab` continues from there
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

    const focusInput = (input: HTMLInputElement | null) => {
        if (input && document.activeElement !== input) input.focus();
    };

    /**
     * Ends the editing of a field: flushes the pending typed report, commits the typed text
     * (normalized, clamped or restored) through `onChange`, then reports `onBlur`. Only typed text
     * is committed: a value from the props is displayed normalized but never reported back.
     */
    const leaveField = (field: F, event: FocusEvent<HTMLElement>) => {
        const current = fields[field];
        let finalValue = current.rawValue ?? "";

        current.setIsEditing(false);

        if (isInteractive && current.isEditing) {
            typedChange.flush();

            const resolved = resolveBlurValue(
                current.rawValue,
                current.lastValidValueRef.current,
                is12Hour,
                getBounds(field)
            );

            if (resolved) {
                finalValue = resolved.value ?? "";
                current.setValue(resolved.value);
                onChange?.(
                    toChangeEvent(event, inputRefs[field].current, finalValue),
                    getValues(field, finalValue),
                    field
                );
            }
        }

        onBlur?.(getValues(field, finalValue), event, field);
    };

    /**
     * Focus leaving the shell or the popover. The inputs report their own blur, so this covers the
     * clear button and the popover items.
     */
    const handleFocusOut = (event: FocusEvent<HTMLElement>) => {
        if (isWithinPicker(event.relatedTarget)) return;

        togglePopover(false);

        if (!isFieldInput(event.target)) leaveField(activeField, event);
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
            },
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                if (!isInteractive) return;

                const nextValue = event.target.value;

                current.setIsEditing(true);

                if (nextValue === current.rawValue) return;

                event.persist?.();
                current.setTypedValue(nextValue);
                typedChange.report({ event, values: getValues(field, nextValue), field });
            },
            onBlur: (event: FocusEvent<HTMLInputElement>) => {
                // The clear button and the popover are part of editing this field; the other range field is not.
                if (isWithinPicker(event.relatedTarget) && !isFieldInput(event.relatedTarget)) return;

                leaveField(field, event);
            },
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
                onKeyDown?.(event, field);

                if (!isInteractive) return;

                // Enter only closes an open popover (closed, a form may submit); ArrowDown opens it with the focus inside.
                if (event.key === KEYS.ENTER) {
                    if (!popoverOpenRef.current) return;

                    event.preventDefault();
                    togglePopover(false);
                    return;
                }

                if (event.key !== KEYS.ARROW_DOWN) return;

                event.preventDefault();
                setActiveField(field);
                togglePopover(true, true);
            }
        };
    };

    /**
     * Applies a pick on top of the typed text, flushing the pending typed report first. The "no
     * change" check uses `rawValue`: in controlled mode `committedValue` is still the prop of this
     * render, without the draft that was just flushed.
     */
    const handleSelect = (column: keyof TimeParts, value: string, event: SyntheticEvent) => {
        if (!isInteractive) return;

        const current = fields[activeField];
        const composedTime = processTimeSelection(current.parts, column, value, is12Hour, getBounds(activeField));

        typedChange.flush();
        current.setIsEditing(false);

        if (composedTime === current.rawValue) return;

        current.setValue(composedTime);
        onChange?.(
            toChangeEvent(event, inputRefs[activeField].current, composedTime),
            getValues(activeField, composedTime),
            activeField
        );
    };

    /** Clears every field; a range reports the clear once, for its initial field. */
    const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
        onClear?.();

        if (!clearable) return;

        const allFields = Object.values<TimeField>(fields);
        const hadValue = allFields.some((field) => !!field.rawValue);

        typedChange.flush();
        allFields.forEach((field) => {
            field.setIsEditing(false);
            field.setValue(null);
        });
        setActiveField(initialField);
        togglePopover(false);

        if (hadValue) {
            const values = Object.fromEntries(Object.keys(fields).map((name) => [name, ""])) as Record<F, string>;

            onChange?.(toChangeEvent(event, inputRefs[initialField].current, ""), values, initialField);
        }

        focusInput(inputRefs[initialField].current);
    };

    /**
     * Hands the focus back to the input when the popover closes on `Escape` or with the focus
     * inside it (its content unmounts, and a removed element blurs silently).
     */
    const handlePopoverClose: PopoverCloseHandler = (_event, reason) => {
        const floating = popoverRef.current.floatingElement.current;
        const isFocusInside = floating instanceof Node && floating.contains(document.activeElement);

        togglePopover(false);

        if (reason === ESCAPE_CLOSE_REASON || isFocusInside) {
            focusInput(inputRefs[activeField].current);
        }
    };

    const handleShellClick = () => {
        inputRefs[activeField].current?.focus();
        togglePopover(true);
    };

    // The icon toggles the popover, so it can also close it.
    const handleIconClick = () => {
        inputRefs[activeField].current?.focus();
        togglePopover(!popoverOpenRef.current);
    };

    return {
        activeField,
        getFieldHandlers,
        getPopoverPosition,
        inputProps: {
            isExpanded: popoverOpen,
            anchorProps: anchorRest,
            anchorRef,
            onAreaClick: handleShellClick,
            onIconClick: handleIconClick,
            onFocusOut: handleFocusOut,
            onClear: handleClear
        },
        popoverProps: {
            open: popoverOpen,
            focusOnOpen: shouldFocusPopover,
            setProps: setAnchorProps,
            popoverRef,
            onClose: handlePopoverClose,
            onFocusOut: handleFocusOut,
            // `Tab` continues from the input, with the popover closed.
            onTabOut: () => {
                focusInput(inputRefs[activeField].current);
                togglePopover(false);
            },
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

    const core = useTimePickerCore({
        ...options,
        is12Hour,
        fields: { single: field },
        inputRefs: { single: inputRef },
        initialField: "single",
        onChange: (event) => onChange?.(event),
        onBlur: (values, event) => onBlur?.(values.single, event),
        onFocus: (event) => onFocus?.(event),
        onKeyDown: (event) => onKeyDown?.(event)
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
            partsEnd: fields.end.parts
        }
    };
};
