import {
    HOURS_IN_DAY,
    MERIDIEM_OFFSET,
    MERIDIEMS,
    MINUTES_IN_HOUR,
    PICKER_RANGE_FIELDS,
    SECONDS_IN_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE,
    TIME_PARTS,
    TIME_PARTS_RADIX
} from "@components/molecules/TimePicker/constants";

import { TimeParts, TimePickerRangeFields } from "./types";

// ---------------------------------------------------------
// Core Converters & Generators
// ---------------------------------------------------------

export const convertTo24Hour = (hStr?: string, meridiem?: string): number => {
    if (!hStr) return 0;
    let h = parseInt(hStr, TIME_PARTS_RADIX);
    if (meridiem) {
        if (meridiem === MERIDIEMS.PM && h !== MERIDIEM_OFFSET) {
            h += MERIDIEM_OFFSET;
        }
        if (meridiem === MERIDIEMS.AM && h === MERIDIEM_OFFSET) {
            h = 0;
        }
    }
    return h;
};

export const convertPartsToSeconds = (parts: TimeParts, is12Hour: boolean): number => {
    const h = is12Hour ? convertTo24Hour(parts.hours, parts.meridiem) : parseInt(parts.hours || "0", TIME_PARTS_RADIX);

    const m = parseInt(parts.minutes || "0", TIME_PARTS_RADIX);
    const s = parseInt(parts.seconds || "0", TIME_PARTS_RADIX);

    return h * SECONDS_IN_HOUR + m * MINUTES_IN_HOUR + s;
};

export const convertSecondsToParts = (totalSeconds: number, is12Hour: boolean): TimeParts => {
    let h = Math.floor(totalSeconds / SECONDS_IN_HOUR) % HOURS_IN_DAY;
    const m = Math.floor((totalSeconds % SECONDS_IN_HOUR) / MINUTES_IN_HOUR);
    const s = totalSeconds % SECONDS_IN_HOUR;

    let meridiem;
    if (is12Hour) {
        meridiem = h >= MERIDIEM_OFFSET ? MERIDIEMS.PM : MERIDIEMS.AM;
        if (h > MERIDIEM_OFFSET) {
            h -= MERIDIEM_OFFSET;
        }
        if (h === 0) {
            h = MERIDIEM_OFFSET;
        }
    }

    return {
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
        meridiem
    };
};

export const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, "0"));

export const composeTime = (timePartsValues: TimeParts, is12Hours: boolean) => {
    const { hours, minutes, seconds, meridiem } = timePartsValues;

    const hh = hours ?? TIME_PART_DEFAULT_TEXT_VALUE;
    const mm = minutes ?? TIME_PART_DEFAULT_TEXT_VALUE;
    const ss = seconds ?? TIME_PART_DEFAULT_TEXT_VALUE;
    const hasMeridiem = is12Hours && meridiem ? meridiem : null;
    return hasMeridiem ? `${hh}:${mm}:${ss} ${meridiem}` : `${hh}:${mm}:${ss}`;
};

const isValidTimeParts = (parts: TimeParts) =>
    parts.hours !== undefined && parts.minutes !== undefined && parts.seconds !== undefined;

// ---------------------------------------------------------
// Validation & Disabling Logic
// ---------------------------------------------------------

export const isTimeDisabled = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): boolean => {
    if (shouldDisableTime) {
        return (
            !!(parts.hours && shouldDisableTime(TIME_PARTS.HOURS, parts.hours)) ||
            !!(parts.minutes && shouldDisableTime(TIME_PARTS.MINUTES, parts.minutes)) ||
            !!(parts.seconds && shouldDisableTime(TIME_PARTS.SECONDS, parts.seconds)) ||
            !!(parts.meridiem && shouldDisableTime(TIME_PARTS.MERIDIEM, parts.meridiem))
        );
    }

    if (isValidTimeParts(parts)) {
        const currentSec = convertPartsToSeconds(parts, is12Hour);
        if (minParts && isValidTimeParts(minParts) && currentSec < convertPartsToSeconds(minParts, is12Hour))
            return true;
        if (maxParts && isValidTimeParts(maxParts) && currentSec > convertPartsToSeconds(maxParts, is12Hour))
            return true;
    }
    return false;
};

export const getNearestAvailableTime = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): TimeParts | null => {
    if (!isTimeDisabled(parts, is12Hour, shouldDisableTime, minParts, maxParts)) {
        return parts;
    }

    const initialSeconds = convertPartsToSeconds(parts, is12Hour);
    const MAX_SECONDS = HOURS_IN_DAY * SECONDS_IN_HOUR;

    for (let offset = 1; offset <= MAX_SECONDS / 2; offset++) {
        const forwardSeconds = (initialSeconds + offset + MAX_SECONDS) % MAX_SECONDS;
        const forwardParts = convertSecondsToParts(forwardSeconds, is12Hour);
        if (!isTimeDisabled(forwardParts, is12Hour, shouldDisableTime, minParts, maxParts)) {
            return forwardParts;
        }

        const backwardSeconds = (initialSeconds - offset + MAX_SECONDS) % MAX_SECONDS;
        const backwardParts = convertSecondsToParts(backwardSeconds, is12Hour);
        if (!isTimeDisabled(backwardParts, is12Hour, shouldDisableTime, minParts, maxParts)) {
            return backwardParts;
        }
    }

    return null;
};

const isPartOutOfBounds = (
    header: keyof TimeParts,
    item: string,
    currentParts: TimeParts | undefined,
    boundParts: TimeParts,
    is12Hour: boolean,
    isMinBound: boolean
): boolean => {
    const boundH = convertTo24Hour(boundParts.hours, boundParts.meridiem);
    const boundM = parseInt(boundParts.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE, TIME_PARTS_RADIX);
    const boundS = parseInt(boundParts.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE, TIME_PARTS_RADIX);

    const currentMeridiem = currentParts?.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined);

    if (header === TIME_PARTS.MERIDIEM) {
        if (isMinBound) {
            return boundParts.meridiem === MERIDIEMS.PM && item === MERIDIEMS.AM;
        }
        return boundParts.meridiem === MERIDIEMS.AM && item === MERIDIEMS.PM;
    }

    const itemH =
        header === TIME_PARTS.HOURS
            ? convertTo24Hour(item, currentMeridiem)
            : convertTo24Hour(currentParts?.hours, currentMeridiem);

    if (isMinBound ? itemH < boundH : itemH > boundH) {
        return true;
    }
    if (itemH !== boundH) {
        return false;
    }

    if (header === TIME_PARTS.HOURS) {
        return false;
    }

    const itemM =
        header === TIME_PARTS.MINUTES
            ? parseInt(item, TIME_PARTS_RADIX)
            : parseInt(currentParts?.minutes ?? TIME_PART_DEFAULT_TEXT_VALUE, TIME_PARTS_RADIX);

    if (isMinBound ? itemM < boundM : itemM > boundM) {
        return true;
    }
    if (itemM !== boundM) {
        return false;
    }

    if (header === TIME_PARTS.MINUTES) {
        return false;
    }

    const itemS =
        header === TIME_PARTS.SECONDS
            ? parseInt(item, TIME_PARTS_RADIX)
            : parseInt(currentParts?.seconds ?? TIME_PART_DEFAULT_TEXT_VALUE, TIME_PARTS_RADIX);

    if (header === TIME_PARTS.SECONDS) {
        return isMinBound ? itemS < boundS : itemS > boundS;
    }

    return false;
};

export const isPickerPartDisabled = (
    header: keyof TimeParts,
    item: string,
    parts: TimeParts | undefined,
    is12Hour: boolean,
    activeField?: TimePickerRangeFields,
    partsStart?: TimeParts,
    partsEnd?: TimeParts,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean
): boolean => {
    if (shouldDisableTime?.(header, item)) {
        return true;
    }

    if (activeField === PICKER_RANGE_FIELDS.END && partsStart?.hours) {
        return isPartOutOfBounds(header, item, parts, partsStart, is12Hour, true);
    }

    if (activeField === PICKER_RANGE_FIELDS.START && partsEnd?.hours) {
        return isPartOutOfBounds(header, item, parts, partsEnd, is12Hour, false);
    }

    return false;
};
