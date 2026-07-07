import { TimeParts } from "./types";

const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, "0"));

const composeTime = (p: Record<string, string | undefined>, is12Hours: boolean) => {
    const hh = p.hours ?? "00";
    const mm = p.minutes ?? "00";
    const ss = p.seconds ?? "00";
    const meridiem = is12Hours && p.meridiem ? p.meridiem : "";
    return meridiem ? `${hh}:${mm}:${ss} ${meridiem}` : `${hh}:${mm}:${ss}`;
};

const convertPartsToSeconds = (parts: TimeParts, is12Hour: boolean): number => {
    let h = parseInt(parts.hours || "0", 10);
    const m = parseInt(parts.minutes || "0", 10);
    const s = parseInt(parts.seconds || "0", 10);

    if (is12Hour) {
        if (parts.meridiem === "PM" && h !== 12) h += 12;
        if (parts.meridiem === "AM" && h === 12) h = 0;
    }

    return h * 3600 + m * 60 + s;
};

const convertSecondsToParts = (totalSeconds: number, is12Hour: boolean): TimeParts => {
    let h = Math.floor(totalSeconds / 3600) % 24;
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    let meridiem;
    if (is12Hour) {
        meridiem = h >= 12 ? "PM" : "AM";
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
    }

    return {
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
        meridiem
    };
};

const isValidTimeParts = (parts: TimeParts) =>
    parts.hours !== undefined && parts.minutes !== undefined && parts.seconds !== undefined;

const isTimeDisabled = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): boolean => {
    if (shouldDisableTime) {
        if (parts.hours && shouldDisableTime("hours", parts.hours)) return true;
        if (parts.minutes && shouldDisableTime("minutes", parts.minutes)) return true;
        if (parts.seconds && shouldDisableTime("seconds", parts.seconds)) return true;
        if (parts.meridiem && shouldDisableTime("meridiem", parts.meridiem)) return true;
    }

    if (isValidTimeParts(parts)) {
        const currentSec = convertPartsToSeconds(parts, is12Hour);
        if (minParts && isValidTimeParts(minParts)) {
            if (currentSec < convertPartsToSeconds(minParts, is12Hour)) return true;
        }
        if (maxParts && isValidTimeParts(maxParts)) {
            if (currentSec > convertPartsToSeconds(maxParts, is12Hour)) return true;
        }
    }
    return false;
};

const getNearestAvailableTime = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): TimeParts | null => {
    if (!isTimeDisabled(parts, is12Hour, shouldDisableTime, minParts, maxParts)) return parts;

    const initialSeconds = convertPartsToSeconds(parts, is12Hour);
    const MAX_SECONDS = 24 * 3600;

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

const convertTo24Hour = (hStr?: string, meridiem?: string): number => {
    if (!hStr) return 0;
    let h = parseInt(hStr, 10);
    if (meridiem) {
        if (meridiem === "PM" && h !== 12) h += 12;
        if (meridiem === "AM" && h === 12) h = 0;
    }
    return h;
};

const isPickerPartDisabled = (
    header: keyof TimeParts,
    item: string,
    parts: TimeParts | undefined,
    is12Hour: boolean,
    activeField?: "start" | "end",
    partsStart?: TimeParts,
    partsEnd?: TimeParts,
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean
): boolean => {
    if (shouldDisableTime?.(header, item)) return true;

    const currentMeridiem = parts?.meridiem ?? (is12Hour ? "AM" : undefined);

    if (activeField === "end" && partsStart && partsStart.hours) {
        const startH = convertTo24Hour(partsStart.hours, partsStart.meridiem);
        const startM = parseInt(partsStart.minutes ?? "00", 10);
        const startS = parseInt(partsStart.seconds ?? "00", 10);

        if (header === "meridiem") {
            return partsStart.meridiem === "PM" && item === "AM";
        }
        if (header === "hours") {
            return convertTo24Hour(item, currentMeridiem) < startH;
        }
        if (header === "minutes") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            if (currentH < startH) return true;
            if (currentH === startH) return parseInt(item, 10) < startM;
        }
        if (header === "seconds") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            const currentM = parseInt(parts?.minutes ?? "00", 10);
            if (currentH < startH) return true;
            if (currentH === startH && currentM < startM) return true;
            if (currentH === startH && currentM === startM) return parseInt(item, 10) < startS;
        }
    }

    if (activeField === "start" && partsEnd && partsEnd.hours) {
        const endH = convertTo24Hour(partsEnd.hours, partsEnd.meridiem);
        const endM = parseInt(partsEnd.minutes ?? "00", 10);
        const endS = parseInt(partsEnd.seconds ?? "00", 10);

        if (header === "meridiem") {
            return partsEnd.meridiem === "AM" && item === "PM";
        }
        if (header === "hours") {
            return convertTo24Hour(item, currentMeridiem) > endH;
        }
        if (header === "minutes") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            if (currentH > endH) return true;
            if (currentH === endH) return parseInt(item, 10) > endM;
        }
        if (header === "seconds") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            const currentM = parseInt(parts?.minutes ?? "00", 10);
            if (currentH > endH) return true;
            if (currentH === endH && currentM > endM) return true;
            if (currentH === endH && currentM === endM) return parseInt(item, 10) > endS;
        }
    }

    return false;
};

export {
    generateRange,
    composeTime,
    convertPartsToSeconds,
    convertSecondsToParts,
    isTimeDisabled,
    getNearestAvailableTime,
    convertTo24Hour,
    isPickerPartDisabled
};
