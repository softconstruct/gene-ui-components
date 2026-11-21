import {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    MutableRefObject,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";

import { IPopoverProps, IPopoverRef } from "@components/atoms/Popover";

// Constants
import { ESCAPE_CLOSE_REASON, KEYS } from "../constants";
// Helpers
import { toChangeEvent } from "../helpers";
// Types
import { PickerPosition } from "../types";
// Hooks
import useTypedChange from "./useTypedChange";

type PopoverCloseHandler = NonNullable<IPopoverProps["onClose"]>;
type InputRef = MutableRefObject<HTMLInputElement | null>;

/**
 * One input of a picker, as the core reads and updates it.
 */
export interface IPickerField {
    /**
     * Text in the input: the typed draft while the field is edited, the formatted value otherwise.
     */
    text: string | null;
    /**
     * The value the text stands for: the typed value while the field is edited, the committed one
     * otherwise.
     */
    value: string | null;
    /**
     * The value without the typed draft (the `value` prop when controlled).
     */
    committedValue: string | null;
    /**
     * Whether the field has been typed into since it was last left, picked from or cleared.
     */
    isEditing: boolean;
    setValue: (value: string | null) => void;
    setTypedText: (text: string) => void;
    setIsEditing: (editing: boolean) => void;
}

/**
 * The value a field settles on when it is left; `commit` reports it through `onChange`.
 */
export type PickerLeaveResult = { value: string | null; commit: boolean };

export interface IUsePickerCoreOptions<F extends string> {
    fields: Record<F, IPickerField>;
    inputRefs: Record<F, InputRef>;
    initialField: F;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    /**
     * The value typed text stands for, reported with a change event of its own; `undefined` while
     * the text is not a value yet. Without it the text is the value and the input's own change event
     * is reported.
     */
    getTypedValue?: (field: F, text: string) => string | null | undefined;
    /**
     * The value a field settles on when it is left. `isEditing` tells whether it was typed into.
     */
    resolveLeave: (field: F, isEditing: boolean) => PickerLeaveResult;
    onChange?: (event: ChangeEvent<HTMLInputElement>, values: Record<F, string>, field: F) => void;
    onClear?: () => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>, field: F) => void;
    onBlur?: (values: Record<F, string>, event: FocusEvent<HTMLElement>, field: F) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, field: F) => void;
}

/**
 * Popover and field interaction shared by the pickers. The popover opens on click or `ArrowDown`
 * and closes once the focus leaves the field and the popover; `Enter` only closes it, so a form
 * around the picker still submits. Outside presses and `Escape` are handled by `atoms/Popover`.
 */
const usePickerCore = <F extends string>({
    fields,
    inputRefs,
    initialField,
    clearable,
    disabled,
    readOnly,
    getTypedValue,
    resolveLeave,
    onChange,
    onClear,
    onOpenChange,
    onFocus,
    onBlur,
    onKeyDown
}: IUsePickerCoreOptions<F>) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [shouldFocusPopover, setShouldFocusPopover] = useState(false);
    const [anchorProps, setAnchorProps] = useState<Record<string, unknown>>({});
    const [activeField, setActiveField] = useState<F>(initialField);
    const [fieldToFocus, setFieldToFocus] = useState<F | null>(null);

    const popoverOpenRef = useRef(false);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const typedChange = useTypedChange<{ event: ChangeEvent<HTMLInputElement>; values: Record<F, string>; field: F }>(
        ({ event, values, field }) => onChange?.(event, values, field)
    );
    const isInteractive = !disabled && !readOnly;

    /** The values of all fields with `field` replaced by `value`; an empty field reads as `""`. */
    const getValues = (field?: F, value?: string): Record<F, string> =>
        Object.fromEntries(
            (Object.entries(fields) as [F, IPickerField][]).map(([name, current]) => [
                name,
                name === field ? value : (current.committedValue ?? "")
            ])
        ) as Record<F, string>;

    // The Popover's reference props without their ARIA attributes; the `ref` becomes the shell's ref.
    const { ref: anchorRef, ...anchorRest } = Object.fromEntries(
        Object.entries(anchorProps).filter(([key]) => !key.startsWith("aria-"))
    ) as { ref?: (node: HTMLElement | null) => void } & Record<string, unknown>;

    // `atoms/Popover` ignores RTL, so the side follows the edited field here.
    const getPopoverPosition = (alignment: "start" | "end"): PickerPosition => {
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

    const isFocusInPopover = (): boolean => {
        const floating = popoverRef.current.floatingElement.current;

        return floating instanceof Node && floating.contains(document.activeElement);
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

    // Focus moved after a commit waits for the render, so the field that is left reads its new value.
    useEffect(() => {
        if (fieldToFocus === null) return;

        setFieldToFocus(null);
        focusInput(inputRefs[fieldToFocus].current);
    }, [fieldToFocus]);

    /**
     * Ends the editing of a field: flushes the pending typed report, commits the value the field
     * settles on through `onChange`, then reports `onBlur`.
     */
    const leaveField = (field: F, event: FocusEvent<HTMLElement>) => {
        const current = fields[field];
        const isCommitting = isInteractive && current.isEditing;

        current.setIsEditing(false);

        if (isCommitting) typedChange.flush();

        const { value, commit } = resolveLeave(field, isCommitting);
        const finalValue = value ?? "";

        if (commit) {
            current.setValue(value);
            onChange?.(toChangeEvent(event, inputRefs[field].current, finalValue), getValues(field, finalValue), field);
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

                const text = event.target.value;

                current.setIsEditing(true);

                if (text === current.text) return;

                event.persist?.();
                current.setTypedText(text);

                const typedValue = getTypedValue ? getTypedValue(field, text) : text;

                if (typedValue === undefined) return;

                current.setValue(typedValue);
                typedChange.report({
                    event: getTypedValue ? toChangeEvent(event, inputRefs[field].current, typedValue ?? "") : event,
                    values: getValues(field, typedValue ?? ""),
                    field
                });
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
     * Commits values picked together from the popover, like a preset range, with a single `onChange`
     * for `field`. The pending typed report is flushed first. The "no change" check uses the value the
     * text stands for: in controlled mode `committedValue` is still the prop of this render, without
     * the draft that was just flushed.
     */
    const commitValues = (values: Partial<Record<F, string | null>>, field: F, event: SyntheticEvent) => {
        if (!isInteractive) return;

        const changes = Object.entries(values) as [F, string | null][];

        typedChange.flush();
        changes.forEach(([name]) => fields[name].setIsEditing(false));

        if (changes.every(([name, value]) => value === fields[name].value)) return;

        changes.forEach(([name, value]) => fields[name].setValue(value));

        const reported = changes.reduce((result, [name, value]) => ({ ...result, [name]: value ?? "" }), getValues());

        onChange?.(toChangeEvent(event, inputRefs[field].current, reported[field]), reported, field);
    };

    const commit = (field: F, value: string | null, event: SyntheticEvent) =>
        commitValues({ [field]: value } as Partial<Record<F, string | null>>, field, event);

    /** Clears every field; a range reports the clear once, for its initial field. */
    const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
        onClear?.();

        if (!clearable) return;

        const allFields = Object.values<IPickerField>(fields);
        const hadValue = allFields.some((field) => !!field.text);

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
        const isFocusInside = isFocusInPopover();

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
        setActiveField,
        getFieldHandlers,
        getPopoverPosition,
        commit,
        commitValues,
        isFocusInPopover,
        /** Moves the focus to the input of `field` once the current changes are rendered. */
        moveFocusTo: setFieldToFocus,
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
            }
        }
    };
};

export default usePickerCore;
