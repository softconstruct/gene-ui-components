// Constants
import {
    DEFAULT_LOCALIZATION,
    FIRST_HOUR_IN_12H_FORMAT,
    HOURS_12,
    HOURS_24,
    LAST_HOUR_IN_24H_FORMAT_DAY,
    LAST_MINUTE_IN_HOUR,
    LAST_SECOND_IN_MINUTE,
    MERIDIEM_LIST,
    MERIDIEM_OFFSET,
    MERIDIEMS,
    MINUTES,
    PICKER_RANGE_FIELDS,
    SECONDS,
    SECONDS_IN_DAY,
    SECONDS_IN_HOUR,
    SECONDS_IN_MINUTE,
    TIME_PART_DEFAULT_TEXT_VALUE,
    TIME_PARTS,
    TIME_PARTS_RADIX
} from "./constants";
// Types
import {
    ShouldDisableTime,
    TimeParts,
    TimePickerLocalization,
    TimePickerMeridiem,
    TimePickerRangeFields
} from "./types";

// ---------------------------------------------------------
// Primitives
// ---------------------------------------------------------

const padTimePart = (value: number): string => value.toString().padStart(2, "0");

const toTimeNumber = (value?: string): number => {
    const parsed = parseInt(value ?? TIME_PART_DEFAULT_TEXT_VALUE, TIME_PARTS_RADIX);
    return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * A single leading letter is accepted so the meridiem can be switched with one keystroke:
 * typing `P` over the `A` of `10:30:00 AM` already reads as PM.
 */
const MERIDIEM_INITIALS: Record<string, TimePickerMeridiem> = {
    A: MERIDIEMS.AM,
    P: MERIDIEMS.PM
};

const toMeridiem = (value?: string): TimePickerMeridiem | undefined => {
    const normalized = value?.trim().toUpperCase();

    if (!normalized) return undefined;
    if (normalized === MERIDIEMS.AM) return MERIDIEMS.AM;
    if (normalized === MERIDIEMS.PM) return MERIDIEMS.PM;

    return MERIDIEM_INITIALS[normalized];
};

const isValidTimeParts = (parts: TimeParts): boolean =>
    parts.hours !== undefined && parts.minutes !== undefined && parts.seconds !== undefined;

// ---------------------------------------------------------
// Core converters
// ---------------------------------------------------------

export const convertTo24Hour = (hStr?: string, meridiem?: string): number => {
    if (!hStr) return 0;

    let hours = toTimeNumber(hStr);

    if (meridiem) {
        if (meridiem === MERIDIEMS.PM && hours !== MERIDIEM_OFFSET) {
            hours += MERIDIEM_OFFSET;
        }
        if (meridiem === MERIDIEMS.AM && hours === MERIDIEM_OFFSET) {
            hours = 0;
        }
    }

    return hours;
};

export const convertPartsToSeconds = (parts: TimeParts, is12Hour: boolean): number => {
    const hours = is12Hour ? convertTo24Hour(parts.hours, parts.meridiem) : toTimeNumber(parts.hours);

    return hours * SECONDS_IN_HOUR + toTimeNumber(parts.minutes) * SECONDS_IN_MINUTE + toTimeNumber(parts.seconds);
};

export const convertSecondsToParts = (totalSeconds: number, is12Hour: boolean): TimeParts => {
    const normalized = ((totalSeconds % SECONDS_IN_DAY) + SECONDS_IN_DAY) % SECONDS_IN_DAY;

    let hours = Math.floor(normalized / SECONDS_IN_HOUR);
    const minutes = Math.floor((normalized % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    const seconds = normalized % SECONDS_IN_MINUTE;

    let meridiem: TimePickerMeridiem | undefined;

    if (is12Hour) {
        meridiem = hours >= MERIDIEM_OFFSET ? MERIDIEMS.PM : MERIDIEMS.AM;

        if (hours > MERIDIEM_OFFSET) {
            hours -= MERIDIEM_OFFSET;
        }
        if (hours === 0) {
            hours = MERIDIEM_OFFSET;
        }
    }

    return {
        hours: padTimePart(hours),
        minutes: padTimePart(minutes),
        seconds: padTimePart(seconds),
        meridiem
    };
};

export const composeTime = (timePartsValues: TimeParts, is12Hours: boolean): string => {
    const { hours, minutes, seconds, meridiem } = timePartsValues;

    const hh = hours ?? TIME_PART_DEFAULT_TEXT_VALUE;
    const mm = minutes ?? TIME_PART_DEFAULT_TEXT_VALUE;
    const ss = seconds ?? TIME_PART_DEFAULT_TEXT_VALUE;

    return is12Hours && meridiem ? `${hh}:${mm}:${ss} ${meridiem}` : `${hh}:${mm}:${ss}`;
};

/**
 * @description
 * Parses a `HH:mm[:ss] [AM|PM]` string into time parts.
 *
 * Returns `null` for anything that is not a complete time, so partially typed input can be
 * distinguished from a committed value. Out of range numeric parts are clamped.
 *
 * In the 12-hour format a missing meridiem means the value is **incomplete**, unless
 * `allow24HourInput` is set. That option is only used for values that come from outside (the
 * `value`/`defaultValue` props, or a `format` switch), where `18:45` should become `06:45 PM`.
 * It must stay off while the user types: otherwise deleting the `AM` of `10:30:00 AM` leaves
 * `10:30:00`, which would be re-read as a 24-hour time and completed straight back to `AM` —
 * making the meridiem impossible to delete or change.
 */
export const parseTime = (
    value?: string | null,
    is12Hour = false,
    { allow24HourInput = false }: { allow24HourInput?: boolean } = {}
): TimeParts | null => {
    if (!value) return null;

    const parsedTime = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s+([AaPp])[Mm]?)?$/.exec(value.trim());

    if (!parsedTime) return null;

    const [, rawHours, rawMinutes, rawSeconds, rawMeridiem] = parsedTime;

    let hours = toTimeNumber(rawHours);
    const minutes = Math.min(toTimeNumber(rawMinutes), LAST_MINUTE_IN_HOUR);
    const seconds = Math.min(rawSeconds ? toTimeNumber(rawSeconds) : 0, LAST_SECOND_IN_MINUTE);
    let meridiem = toMeridiem(rawMeridiem);

    if (!is12Hour) {
        return {
            hours: padTimePart(Math.min(hours, LAST_HOUR_IN_24H_FORMAT_DAY)),
            minutes: padTimePart(minutes),
            seconds: padTimePart(seconds),
            meridiem: undefined
        };
    }

    if (meridiem) {
        // Already a 12-hour string: `00` means 12 AM/PM, anything above 12 is clamped.
        if (hours === 0) {
            hours = MERIDIEM_OFFSET;
        }
        hours = Math.min(Math.max(hours, FIRST_HOUR_IN_12H_FORMAT), MERIDIEM_OFFSET);
    } else if (allow24HourInput) {
        // An externally supplied 24-hour string: convert it, so `18:45` becomes `06:45 PM`
        // instead of being truncated to `12:45 AM`.
        const converted = convertSecondsToParts(Math.min(hours, LAST_HOUR_IN_24H_FORMAT_DAY) * SECONDS_IN_HOUR, true);

        hours = toTimeNumber(converted.hours);
        meridiem = converted.meridiem;
    } else {
        return null;
    }

    return {
        hours: padTimePart(hours),
        minutes: padTimePart(minutes),
        seconds: padTimePart(seconds),
        meridiem
    };
};

/**
 * @description
 * Merges the consumer localization over the defaults, ignoring empty entries so a partially
 * provided object cannot blank out a label (including the accessible ones).
 */
export const resolveLocalization = (localization?: TimePickerLocalization): Required<TimePickerLocalization> => {
    const resolved: Required<TimePickerLocalization> = { ...DEFAULT_LOCALIZATION };

    if (!localization) return resolved;

    (Object.keys(localization) as (keyof TimePickerLocalization)[]).forEach((key) => {
        const text = localization[key];

        if (text) {
            resolved[key] = text;
        }
    });

    return resolved;
};

/**
 * @description
 * Returns a copy of `parts` with a single column replaced.
 * Written as a switch (instead of a computed key) so the `meridiem` column keeps its literal type.
 */
export const withTimePart = (parts: TimeParts, part: keyof TimeParts, value: string): TimeParts => {
    switch (part) {
        case TIME_PARTS.HOURS:
            return { ...parts, hours: value };
        case TIME_PARTS.MINUTES:
            return { ...parts, minutes: value };
        case TIME_PARTS.SECONDS:
            return { ...parts, seconds: value };
        default:
            return { ...parts, meridiem: toMeridiem(value) };
    }
};

// ---------------------------------------------------------
// Validation & disabling logic
// ---------------------------------------------------------

/**
 * @description
 * Returns the selectable values of a single time column.
 */
export const getTimePartValues = (part: keyof TimeParts, is12Hour: boolean): string[] => {
    switch (part) {
        case TIME_PARTS.HOURS:
            return is12Hour ? HOURS_12 : HOURS_24;
        case TIME_PARTS.MINUTES:
            return MINUTES;
        case TIME_PARTS.SECONDS:
            return SECONDS;
        default:
            return MERIDIEM_LIST;
    }
};

/**
 * @description
 * A time is disabled when any of its parts is rejected by `shouldDisableTime`
 * **or** when it falls outside the `minParts`/`maxParts` bounds.
 *
 * Both checks are applied: previously a provided `shouldDisableTime` short circuited the
 * function, which silently disabled the range (start/end) bounds.
 */
export const isTimeDisabled = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: ShouldDisableTime,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): boolean => {
    if (shouldDisableTime) {
        const isPartDisabled = ([part, value]: [keyof TimeParts, string | undefined]) =>
            !!value && shouldDisableTime(part, value);

        const entries: [keyof TimeParts, string | undefined][] = [
            [TIME_PARTS.HOURS, parts.hours],
            [TIME_PARTS.MINUTES, parts.minutes],
            [TIME_PARTS.SECONDS, parts.seconds],
            [TIME_PARTS.MERIDIEM, parts.meridiem]
        ];

        if (entries.some(isPartDisabled)) return true;
    }

    if (!isValidTimeParts(parts)) return false;

    const currentSeconds = convertPartsToSeconds(parts, is12Hour);

    if (minParts && isValidTimeParts(minParts) && currentSeconds < convertPartsToSeconds(minParts, is12Hour)) {
        return true;
    }
    if (maxParts && isValidTimeParts(maxParts) && currentSeconds > convertPartsToSeconds(maxParts, is12Hour)) {
        return true;
    }

    return false;
};

/**
 * @description
 * Finds the closest allowed value inside a single column, searching forward and backward
 * from the current one. Returns `null` when the whole column is disabled.
 */
const nearestAllowedValue = (
    values: string[],
    current: string | undefined,
    isDisabled: (value: string) => boolean
): string | null => {
    if (current !== undefined && !isDisabled(current)) return current;

    const currentIndex = current === undefined ? 0 : values.indexOf(current);
    const startIndex = currentIndex < 0 ? 0 : currentIndex;

    for (let offset = 0; offset < values.length; offset++) {
        const forward = values[startIndex + offset];
        if (forward !== undefined && !isDisabled(forward)) return forward;

        const backward = values[startIndex - offset];
        if (backward !== undefined && !isDisabled(backward)) return backward;
    }

    return null;
};

const resolveDisabledParts = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: ShouldDisableTime
): TimeParts | null => {
    if (!shouldDisableTime) return parts;

    const hours = nearestAllowedValue(getTimePartValues(TIME_PARTS.HOURS, is12Hour), parts.hours, (value) =>
        shouldDisableTime(TIME_PARTS.HOURS, value)
    );
    const minutes = nearestAllowedValue(MINUTES, parts.minutes, (value) =>
        shouldDisableTime(TIME_PARTS.MINUTES, value)
    );
    const seconds = nearestAllowedValue(SECONDS, parts.seconds, (value) =>
        shouldDisableTime(TIME_PARTS.SECONDS, value)
    );

    if (hours === null || minutes === null || seconds === null) return null;

    if (!is12Hour) {
        return { hours, minutes, seconds, meridiem: undefined };
    }

    const meridiem = nearestAllowedValue(MERIDIEM_LIST, parts.meridiem ?? MERIDIEMS.AM, (value) =>
        shouldDisableTime(TIME_PARTS.MERIDIEM, value)
    );

    if (meridiem === null) return null;

    return { hours, minutes, seconds, meridiem: toMeridiem(meridiem) };
};

const clampPartsToBounds = (
    parts: TimeParts,
    is12Hour: boolean,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): TimeParts => {
    if (!isValidTimeParts(parts)) return parts;

    const currentSeconds = convertPartsToSeconds(parts, is12Hour);

    if (minParts && isValidTimeParts(minParts) && currentSeconds < convertPartsToSeconds(minParts, is12Hour)) {
        return { ...minParts };
    }
    if (maxParts && isValidTimeParts(maxParts) && currentSeconds > convertPartsToSeconds(maxParts, is12Hour)) {
        return { ...maxParts };
    }

    return parts;
};

/**
 * @description
 * Returns the closest allowed time, or `null` when no allowed time exists.
 *
 * `shouldDisableTime` is evaluated per column and the bounds are a direct clamp, so the cost is
 * proportional to the number of selectable values (≤ 146 predicate calls) instead of the previous
 * second by second scan over the whole day (up to ~345.000 predicate calls per keystroke).
 */
export const getNearestAvailableTime = (
    parts: TimeParts,
    is12Hour: boolean,
    shouldDisableTime?: ShouldDisableTime,
    minParts?: TimeParts | null,
    maxParts?: TimeParts | null
): TimeParts | null => {
    if (!isTimeDisabled(parts, is12Hour, shouldDisableTime, minParts, maxParts)) return parts;

    let candidate: TimeParts = parts;

    // Two passes: clamping to a bound can land on a value the predicate rejects, and fixing a
    // rejected value can move the time back outside the bounds.
    for (let pass = 0; pass < 2; pass++) {
        const resolved = resolveDisabledParts(candidate, is12Hour, shouldDisableTime);
        if (resolved === null) return null;

        candidate = clampPartsToBounds(resolved, is12Hour, minParts, maxParts);
    }

    return isTimeDisabled(candidate, is12Hour, shouldDisableTime, minParts, maxParts) ? null : candidate;
};

/**
 * @description
 * Tells whether picking `item` in the `part` column would push the time past a range bound.
 *
 * The comparison is a lexicographic (prefix) one: only the columns up to and including the edited
 * one participate, which is what makes a bound disable whole hours rather than single seconds.
 */
const isPartOutOfBounds = (
    part: keyof TimeParts,
    item: string,
    currentParts: TimeParts | undefined,
    boundParts: TimeParts,
    is12Hour: boolean,
    isMinBound: boolean
): boolean => {
    const currentMeridiem = currentParts?.meridiem ?? (is12Hour ? MERIDIEMS.AM : undefined);

    if (part === TIME_PARTS.MERIDIEM) {
        return isMinBound
            ? boundParts.meridiem === MERIDIEMS.PM && item === MERIDIEMS.AM
            : boundParts.meridiem === MERIDIEMS.AM && item === MERIDIEMS.PM;
    }

    const candidate: TimeParts = {
        hours: part === TIME_PARTS.HOURS ? item : currentParts?.hours,
        minutes: part === TIME_PARTS.MINUTES ? item : currentParts?.minutes,
        seconds: part === TIME_PARTS.SECONDS ? item : currentParts?.seconds,
        meridiem: currentMeridiem
    };

    // Truncating both sides to the depth of the edited column turns the value comparison into a
    // prefix comparison: hours only, hours + minutes, or the full time.
    const truncateTo = (value: number): number => {
        if (part === TIME_PARTS.HOURS) return Math.floor(value / SECONDS_IN_HOUR) * SECONDS_IN_HOUR;
        if (part === TIME_PARTS.MINUTES) return Math.floor(value / SECONDS_IN_MINUTE) * SECONDS_IN_MINUTE;
        return value;
    };

    const candidateSeconds = truncateTo(convertPartsToSeconds(candidate, is12Hour));
    const boundSeconds = truncateTo(convertPartsToSeconds(boundParts, is12Hour));

    return isMinBound ? candidateSeconds < boundSeconds : candidateSeconds > boundSeconds;
};

export const isPickerPartDisabled = (
    part: keyof TimeParts,
    item: string,
    parts: TimeParts | undefined,
    is12Hour: boolean,
    activeField?: TimePickerRangeFields,
    partsStart?: TimeParts,
    partsEnd?: TimeParts,
    shouldDisableTime?: ShouldDisableTime
): boolean => {
    if (shouldDisableTime?.(part, item)) {
        return true;
    }

    if (activeField === PICKER_RANGE_FIELDS.END && partsStart?.hours) {
        return isPartOutOfBounds(part, item, parts, partsStart, is12Hour, true);
    }

    if (activeField === PICKER_RANGE_FIELDS.START && partsEnd?.hours) {
        return isPartOutOfBounds(part, item, parts, partsEnd, is12Hour, false);
    }

    return false;
};
