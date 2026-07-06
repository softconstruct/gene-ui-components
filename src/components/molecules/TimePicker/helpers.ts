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

    let meridiem: string | undefined;
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

const isTimeDisabled = (
    parts: TimeParts,
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", value: string) => boolean
): boolean => {
    if (!shouldDisableTime) return false;
    if (parts.hours && shouldDisableTime("hours", parts.hours)) return true;
    if (parts.minutes && shouldDisableTime("minutes", parts.minutes)) return true;
    if (parts.seconds && shouldDisableTime("seconds", parts.seconds)) return true;
    if (parts.meridiem && shouldDisableTime("meridiem", parts.meridiem)) return true;
    return false;
};

const getNearestAvailableTime = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", value: string) => boolean
): TimeParts | null => {
    if (!shouldDisableTime) return parts;
    if (!isTimeDisabled(parts, shouldDisableTime)) return parts;

    const initialSeconds = convertPartsToSeconds(parts, is12Hour);
    const MAX_SECONDS = 24 * 3600;

    // Search outwards from the current inputted time for the closest valid time
    for (let offset = 1; offset <= MAX_SECONDS / 2; offset++) {
        // Forward check
        const forwardSeconds = (initialSeconds + offset + MAX_SECONDS) % MAX_SECONDS;
        const forwardParts = convertSecondsToParts(forwardSeconds, is12Hour);
        if (!isTimeDisabled(forwardParts, shouldDisableTime)) {
            return forwardParts;
        }

        // Backward check
        const backwardSeconds = (initialSeconds - offset + MAX_SECONDS) % MAX_SECONDS;
        const backwardParts = convertSecondsToParts(backwardSeconds, is12Hour);
        if (!isTimeDisabled(backwardParts, shouldDisableTime)) {
            return backwardParts;
        }
    }

    // In case all times are disabled (safeguard)
    return null;
};

export {
    generateRange,
    composeTime,
    convertPartsToSeconds,
    convertSecondsToParts,
    isTimeDisabled,
    getNearestAvailableTime
};
