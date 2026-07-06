import { ChangeEvent, useEffect, useRef, useState } from "react";

import { IPopoverRef } from "@components/atoms/Popover";
import { TimeParts } from "@components/molecules/TimePicker/types";

import { useClickOutside } from "@hooks/index";

import { composeTime, getNearestAvailableTime } from "../helpers";

const getInitialParts = (): TimeParts => ({
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
    meridiem: undefined
});

const parseTime = (v?: string | null, is12Hour = false): TimeParts | null => {
    if (!v) return null;

    const trimmed = v.trim();
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?(?:\s+(AM|PM))?$/i.exec(trimmed);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2], 10);
    let seconds = match[3] ? parseInt(match[3], 10) : 0;
    const defaultMeridiem = is12Hour ? "AM" : undefined;
    const meridiem = match[4] ? match[4].toUpperCase() : defaultMeridiem;

    if (is12Hour) {
        if (hours > 12) hours = 12;
        if (hours < 1) hours = 1;
    } else if (hours > 23) hours = 23;
    if (minutes > 59) minutes = 59;
    if (seconds > 59) seconds = 59;

    return {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        meridiem
    };
};

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

export const useSingleTimePicker = (
    value?: string | null,
    clearable?: boolean,
    onClear?: () => void,
    onTimeSelect?: (time: string, parts: TimeParts, field?: "start" | "end") => void,
    onTimeInputChange?: (time: string, parts: TimeParts | null, field?: "start" | "end") => void,
    onPopoverToggle?: (open: boolean) => void,
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", val: string) => boolean,
    is12Hour = false
) => {
    const base = useBasePicker(onPopoverToggle);
    const [internalValue, setInternalValue] = useState(value ?? null);
    const [parts, setParts] = useState(getInitialParts());

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        let parsed: TimeParts | null = parseTime(nextValue, is12Hour);

        if (parsed) {
            if (shouldDisableTime) {
                const nearestParts = getNearestAvailableTime(parsed, is12Hour, shouldDisableTime);
                if (nearestParts) parsed = nearestParts;
            }

            const composed = composeTime(parsed, is12Hour);
            setInternalValue(composed);
            setParts(parsed);
            onTimeInputChange?.(composed, parsed);
        } else {
            setInternalValue(nextValue);
            onTimeInputChange?.(nextValue, null);
        }
    };

    const handleSelect = (column: string, val: string) => {
        setParts((prev) => {
            const next = {
                hours: prev.hours ?? (is12Hour ? "12" : "00"),
                minutes: prev.minutes ?? "00",
                seconds: prev.seconds ?? "00",
                meridiem: prev.meridiem ?? (is12Hour ? "AM" : undefined),
                [column]: val
            };
            const composed = composeTime(next, is12Hour);
            setInternalValue(composed);
            onTimeSelect?.(composed, next);
            return next;
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
        if (parsed) setParts(parsed);
    }, [value, is12Hour]);

    return { ...base, internalValue, parts, handleInputChange, handleSelect, handleClear };
};

export const useRangeTimePicker = (
    value?: { start: string | null; end: string | null },
    clearable?: boolean,
    onClear?: () => void,
    onTimeSelect?: (time: string, parts: TimeParts, field?: "start" | "end") => void,
    onTimeInputChange?: (time: string, parts: TimeParts | null, field?: "start" | "end") => void,
    onPopoverToggle?: (open: boolean) => void,
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", val: string) => boolean,
    is12Hour = false
) => {
    const base = useBasePicker(onPopoverToggle);
    const [activeField, setActiveField] = useState<"start" | "end">("start");
    const [internalStart, setInternalStart] = useState(value?.start ?? null);
    const [internalEnd, setInternalEnd] = useState(value?.end ?? null);

    const [partsStart, setPartsStart] = useState(getInitialParts());
    const [partsEnd, setPartsEnd] = useState(getInitialParts());

    const handleInputClick = (field: "start" | "end") => {
        setActiveField(field);
        base.setPopoverOpen(true);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: "start" | "end") => {
        const nextValue = e.target.value;
        let parsed: TimeParts | null = parseTime(nextValue, is12Hour);

        if (parsed && shouldDisableTime) {
            const nearestParts = getNearestAvailableTime(parsed, is12Hour, shouldDisableTime);
            if (nearestParts) parsed = nearestParts;
        }

        if (field === "start") {
            if (parsed) {
                const composed = composeTime(parsed, is12Hour);
                setInternalStart(composed);
                setPartsStart(parsed);
                onTimeInputChange?.(composed, parsed, "start");
            } else {
                setInternalStart(nextValue);
                onTimeInputChange?.(nextValue, null, "start");
            }
        } else if (parsed) {
            const composed = composeTime(parsed, is12Hour);
            setInternalEnd(composed);
            setPartsEnd(parsed);
            onTimeInputChange?.(composed, parsed, "end");
        } else {
            setInternalEnd(nextValue);
            onTimeInputChange?.(nextValue, null, "end");
        }
    };

    const handleSelect = (column: string, val: string) => {
        if (activeField === "start") {
            setPartsStart((prev) => {
                const next = {
                    hours: prev.hours ?? (is12Hour ? "12" : "00"),
                    minutes: prev.minutes ?? "00",
                    seconds: prev.seconds ?? "00",
                    meridiem: prev.meridiem ?? (is12Hour ? "AM" : undefined),
                    [column]: val
                };
                const composed = composeTime(next, is12Hour);
                setInternalStart(composed);
                onTimeSelect?.(composed, next, "start");
                return next;
            });
        } else {
            setPartsEnd((prev) => {
                const next = {
                    hours: prev.hours ?? (is12Hour ? "12" : "00"),
                    minutes: prev.minutes ?? "00",
                    seconds: prev.seconds ?? "00",
                    meridiem: prev.meridiem ?? (is12Hour ? "AM" : undefined),
                    [column]: val
                };
                const composed = composeTime(next, is12Hour);
                setInternalEnd(composed);
                onTimeSelect?.(composed, next, "end");
                return next;
            });
        }
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
        if (pStart) setPartsStart(pStart);
        const pEnd = parseTime(value?.end, is12Hour);
        if (pEnd) setPartsEnd(pEnd);
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
