import { ChangeEvent, useEffect, useRef, useState } from "react";

import { IPopoverRef } from "@components/atoms/Popover";
import { TimeParts } from "@components/molecules/TimePicker/types";

import { useClickOutside } from "@hooks/index";

import { composeTime } from "../helpers";

const getInitialParts = (): TimeParts => ({
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
    meridiem: undefined
});

const parseTime = (v?: string | null) => {
    if (!v) return null;

    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(v);
    if (!match) return null;

    return {
        hours: match[1],
        minutes: match[2],
        seconds: match[3] ?? "00",
        meridiem: undefined
    };
};

const useBasePicker = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorProps, setAnchorProps] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useClickOutside(() => {
        setPopoverOpen(false);
    }, [popoverRef?.current?.floatingElement, popoverRef?.current?.referenceElement]);

    return {
        popoverOpen,
        setPopoverOpen,
        anchorProps,
        setAnchorProps,
        popoverRef
    };
};

export const useSingleTimePicker = (value?: string | null, clearable?: boolean, onClear?: () => void) => {
    const base = useBasePicker();

    const [internalValue, setInternalValue] = useState(value ?? null);
    const [parts, setParts] = useState(getInitialParts());

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        setInternalValue(nextValue);
        const parsed = parseTime(nextValue);
        if (parsed) setParts(parsed);
    };

    const handleSelect = (column: string, val: string) => {
        setParts((prev) => {
            const next = { ...prev, [column]: val };
            const composed = composeTime(next, true);
            setInternalValue(composed);
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
        const parsed = parseTime(value);
        if (parsed) setParts(parsed);
    }, [value]);

    return {
        ...base,
        internalValue,
        parts,
        handleInputChange,
        handleSelect,
        handleClear
    };
};

export const useRangeTimePicker = (
    value?: { start: string | null; end: string | null },
    clearable?: boolean,
    onClear?: () => void
) => {
    const base = useBasePicker();

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
        const parsed = parseTime(nextValue);

        if (field === "start") {
            setInternalStart(nextValue);
            if (parsed) setPartsStart(parsed);
        } else {
            setInternalEnd(nextValue);
            if (parsed) setPartsEnd(parsed);
        }
    };

    const handleSelect = (column: string, val: string) => {
        if (activeField === "start") {
            setPartsStart((prev) => {
                const next = { ...prev, [column]: val };
                setInternalStart(composeTime(next, true));
                return next;
            });
        } else {
            setPartsEnd((prev) => {
                const next = { ...prev, [column]: val };
                setInternalEnd(composeTime(next, true));
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
    }, [value?.start, value?.end]);

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
