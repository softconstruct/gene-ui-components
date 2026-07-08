import { ChangeEvent, useEffect, useRef, useState } from "react";

import { IPopoverRef } from "@components/atoms/Popover";
import {
    LAST_HOUR_IN_24H_FORMAT_DAY,
    LAST_MINUTE_IN_HOUR,
    LAST_SECOND_IN_MINUTE,
    MERIDIEM_OFFSET,
    MERIDIEMS,
    PICKER_RANGE_FIELDS,
    TIME_PART_DEFAULT_TEXT_VALUE,
    TIME_PARTS_RADIX
} from "@components/molecules/TimePicker/constants";
import { TimeParts, TimePickerRangeFields } from "@components/molecules/TimePicker/types";

import { useClickOutside } from "@hooks/index";

import { composeTime, getNearestAvailableTime } from "../helpers";

// ---------------------------------------------------------
// Initialization & Parsing
// ---------------------------------------------------------

const getInitialParts = (): TimeParts => ({
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
    meridiem: undefined
});

const parseTime = (v?: string | null, is12Hour = false): TimeParts | null => {
    if (!v) return null;

    const trimmed = v.trim();
    const parsedTime = /^(\d{2}):(\d{2})(?::(\d{2}))?(?:\s+(AM|PM))?$/i.exec(trimmed);

    if (!parsedTime) return null;

    let hours = parseInt(parsedTime[1], TIME_PARTS_RADIX);
    let minutes = parseInt(parsedTime[2], TIME_PARTS_RADIX);
    let seconds = parsedTime[3] ? parseInt(parsedTime[3], TIME_PARTS_RADIX) : 0;
    const defaultMeridiem = is12Hour ? MERIDIEMS.AM : undefined;
    const meridiem = parsedTime[4] ? parsedTime[4].toUpperCase() : defaultMeridiem;

    if (is12Hour) {
        if (hours > MERIDIEM_OFFSET) {
            hours = MERIDIEM_OFFSET;
        }
        if (hours < 1) {
            hours = 1;
        }
    } else if (hours > LAST_HOUR_IN_24H_FORMAT_DAY) {
        hours = LAST_HOUR_IN_24H_FORMAT_DAY;
    }

    if (minutes > LAST_MINUTE_IN_HOUR) {
        minutes = LAST_MINUTE_IN_HOUR;
    }
    if (seconds > LAST_SECOND_IN_MINUTE) {
        seconds = LAST_SECOND_IN_MINUTE;
    }

    return {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        meridiem
    };
};

// ---------------------------------------------------------
// Shared Action Helpers
// ---------------------------------------------------------

/**
 * @description
 * Shared function to process raw string input from the user
 */
const processTimeInput = (
    nextValue: string,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts: TimeParts | null = null,
    maxParts: TimeParts | null = null
): { parsed: TimeParts | null; composedValue: string } => {
    let parsed = parseTime(nextValue, is12Hour);

    if (!parsed) {
        return { parsed: null, composedValue: nextValue };
    }

    const nearest = getNearestAvailableTime(parsed, is12Hour, shouldDisableTime, minParts, maxParts);
    if (nearest) {
        parsed = nearest;
    }

    return { parsed, composedValue: composeTime(parsed, is12Hour) };
};

/**
 * @description
 * Shared function between single and range picker hooks to process time selection
 */
const processTimeSelection = (
    prev: TimeParts,
    column: keyof TimeParts,
    val: string,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts: TimeParts | null = null,
    maxParts: TimeParts | null = null
): { nextParts: TimeParts; composedTime: string } => {
    const next: TimeParts = {
        hours: prev.hours ?? (is12Hour ? `${MERIDIEM_OFFSET}` : TIME_PART_DEFAULT_TEXT_VALUE),
        minutes: prev.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE,
        seconds: prev.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE,
        meridiem: prev.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined)
    };

    next[column] = val;

    const nearest = getNearestAvailableTime(next, is12Hour, shouldDisableTime, minParts, maxParts);
    if (nearest) {
        next[column] = nearest[column];
    }

    const composedTime = composeTime(next, is12Hour);
    return { nextParts: next, composedTime };
};

// ---------------------------------------------------------
// Hooks
// ---------------------------------------------------------

/**
 * @description
 * This hook is for internal use of single and range picker hooks. It's sharing common functionality.
 */
const useBasePicker = (onPopoverToggle?: (status: boolean) => void) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorProps, setAnchorProps] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useClickOutside(() => {
        if (popoverOpen) {
            setPopoverOpen(false);
            onPopoverToggle?.(false);
        }
    }, [popoverRef?.current?.floatingElement, popoverRef?.current?.referenceElement]);

    const handlePopoverToggle = (status: boolean) => {
        setPopoverOpen(status);
        onPopoverToggle?.(status);
    };

    return { popoverOpen, setPopoverOpen: handlePopoverToggle, anchorProps, setAnchorProps, popoverRef };
};

/**
 * @description
 * This hook is for managing the state of the time picker (single mode).
 */
export const useSingleTimePicker = (
    value?: string | null,
    clearable?: boolean,
    onClear?: () => void,
    onTimeSelect?: (time: string, parts: TimeParts, field?: TimePickerRangeFields) => void,
    onTimeInputChange?: (time: string, parts: TimeParts | null, field?: TimePickerRangeFields) => void,
    onPopoverToggle?: (open: boolean) => void,
    shouldDisableTime?: (type: keyof TimeParts, val: string) => boolean,
    is12Hour = false
) => {
    const base = useBasePicker(onPopoverToggle);
    const [internalValue, setInternalValue] = useState(value ?? null);
    const [parts, setParts] = useState(getInitialParts());

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { parsed, composedValue } = processTimeInput(e.target.value, is12Hour, shouldDisableTime);

        setInternalValue(composedValue);
        if (parsed) {
            setParts(parsed);
        }

        onTimeInputChange?.(composedValue, parsed);
    };

    const handleSelect = (column: keyof TimeParts, val: string) => {
        setParts((prev) => {
            const { nextParts, composedTime } = processTimeSelection(prev, column, val, is12Hour, shouldDisableTime);
            setInternalValue(composedTime);
            onTimeSelect?.(composedTime, nextParts);
            return nextParts;
        });
    };

    const handleClear = () => {
        onClear?.();
        if (clearable && value === undefined) {
            setInternalValue(null);
            setParts(getInitialParts());
        }
    };

    useEffect(() => {
        setInternalValue(value ?? null);
        const parsed = parseTime(value, is12Hour);
        if (parsed) {
            setParts(parsed);
        }
    }, [value, is12Hour]);

    return { ...base, internalValue, parts, handleInputChange, handleSelect, handleClear };
};

/**
 * @description
 * This hook is used to handle the time picker logic for a range time picker.
 */
export const useRangeTimePicker = (
    value?: { start: string | null; end: string | null },
    clearable?: boolean,
    onClear?: () => void,
    onTimeSelect?: (time: string, parts: TimeParts, field?: TimePickerRangeFields) => void,
    onTimeInputChange?: (time: string, parts: TimeParts | null, field?: TimePickerRangeFields) => void,
    onPopoverToggle?: (open: boolean) => void,
    shouldDisableTime?: (type: keyof TimeParts, val: string) => boolean,
    is12Hour = false
) => {
    const base = useBasePicker(onPopoverToggle);
    const [activeField, setActiveField] = useState<TimePickerRangeFields>(PICKER_RANGE_FIELDS.START);
    const [internalStart, setInternalStart] = useState(value?.start ?? null);
    const [internalEnd, setInternalEnd] = useState(value?.end ?? null);

    const [partsStart, setPartsStart] = useState(getInitialParts());
    const [partsEnd, setPartsEnd] = useState(getInitialParts());

    const handleInputClick = (field: TimePickerRangeFields) => {
        setActiveField(field);
        base.setPopoverOpen(true);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: TimePickerRangeFields) => {
        const isStart = field === PICKER_RANGE_FIELDS.START;

        const minParts = !isStart && partsStart.hours ? partsStart : null;
        const maxParts = isStart && partsEnd.hours ? partsEnd : null;

        const { parsed, composedValue } = processTimeInput(
            e.target.value,
            is12Hour,
            shouldDisableTime,
            minParts,
            maxParts
        );

        if (isStart) {
            setInternalStart(composedValue);
            if (parsed) {
                setPartsStart(parsed);
            }
        } else {
            setInternalEnd(composedValue);
            if (parsed) {
                setPartsEnd(parsed);
            }
        }

        onTimeInputChange?.(composedValue, parsed, field);
    };

    const handleSelect = (column: keyof TimeParts, val: string) => {
        const isStart = activeField === PICKER_RANGE_FIELDS.START;

        const updateState = isStart ? setPartsStart : setPartsEnd;
        const setInternal = isStart ? setInternalStart : setInternalEnd;
        const minParts = !isStart && partsStart.hours ? partsStart : null;
        const maxParts = isStart && partsEnd.hours ? partsEnd : null;

        updateState((prev) => {
            const { nextParts, composedTime } = processTimeSelection(
                prev,
                column,
                val,
                is12Hour,
                shouldDisableTime,
                minParts,
                maxParts
            );

            setInternal(composedTime);
            onTimeSelect?.(composedTime, nextParts, activeField);
            return nextParts;
        });
    };

    const handleClear = () => {
        onClear?.();
        if (clearable && value === undefined) {
            setInternalStart(null);
            setInternalEnd(null);
            setPartsStart(getInitialParts());
            setPartsEnd(getInitialParts());
        }
    };

    useEffect(() => {
        setInternalStart(value?.start ?? null);
        setInternalEnd(value?.end ?? null);

        const pStart = parseTime(value?.start, is12Hour);
        if (pStart) {
            setPartsStart(pStart);
        }

        const pEnd = parseTime(value?.end, is12Hour);
        if (pEnd) {
            setPartsEnd(pEnd);
        }
    }, [value?.start, value?.end, is12Hour]);

    return {
        ...base,
        activeField,
        setActiveField,
        internalStart,
        internalEnd,
        partsStart,
        partsEnd,
        handleInputClick,
        handleInputChange,
        handleSelect,
        handleClear
    };
};
