import { useEffect, useRef, useState } from "react";

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

export const useSingleTimePicker = (value?: string | null) => {
    const base = useBasePicker();

    const [internalValue, setInternalValue] = useState(value ?? null);
    const [parts, setParts] = useState(getInitialParts());

    const handleInputChange = (v: string) => {
        setInternalValue(v);
        const parsed = parseTime(v);
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
        handleSelect
    };
};

export const useRangeTimePicker = (
    value?: { start: string | null; end: string | null },
    placeholder?: { start?: string | null; end?: string | null }
) => {
    const base = useBasePicker();

    const [activeField, setActiveField] = useState<"start" | "end">("start");

    const [internalStart, setInternalStart] = useState(value?.start ?? null);
    const [internalEnd, setInternalEnd] = useState(value?.end ?? null);

    const [partsStart, setPartsStart] = useState(getInitialParts());
    const [partsEnd, setPartsEnd] = useState(getInitialParts());

    const handleInputClick = (target: HTMLInputElement) => {
        const ph = target.getAttribute("placeholder");

        if (ph === placeholder?.end) setActiveField("end");
        else setActiveField("start");

        base.setPopoverOpen(true);
    };

    const handleInputChange = (val: string, field: "start" | "end") => {
        const parsed = parseTime(val);

        if (field === "start") {
            setInternalStart(val);
            if (parsed) setPartsStart(parsed);
        } else {
            setInternalEnd(val);
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
        handleSelect
    };
};
