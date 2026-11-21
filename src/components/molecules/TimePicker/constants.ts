import { MASK_PLACEHOLDER } from "@internal/components/Picker";

// Types
import { ITimePickerLocalization, TimeParts } from "./types";

/**
 * @description
 * Generates an inclusive list of zero padded numeric strings.
 */
const generateRange = (start: number, end: number): string[] =>
    Array.from({ length: end - start + 1 }, (_, index) => (start + index).toString().padStart(2, "0"));

// ---------------------------------------------------------
// Time domains
// ---------------------------------------------------------

const HOURS_24 = generateRange(0, 23);
const HOURS_12 = generateRange(1, 12);
const MINUTES = generateRange(0, 59);
const SECONDS = generateRange(0, 59);

const MERIDIEMS = {
    AM: "AM",
    PM: "PM"
} as const;

const MERIDIEM_LIST = [MERIDIEMS.AM, MERIDIEMS.PM];

const TIME_PARTS = {
    HOURS: "hours",
    MINUTES: "minutes",
    SECONDS: "seconds",
    MERIDIEM: "meridiem"
} as const;

/**
 * Visual (and keyboard navigation) order of the scrollable time columns.
 * The meridiem column is appended at runtime, only when the 12-hour format is active.
 */
const TIME_COLUMNS_ORDER = [TIME_PARTS.HOURS, TIME_PARTS.MINUTES, TIME_PARTS.SECONDS] as const;

// ---------------------------------------------------------
// Numeric constants
// ---------------------------------------------------------

const MERIDIEM_OFFSET = 12;

const TIME_PART_DEFAULT_TEXT_VALUE = "00";
const TIME_PART_DEFAULT_12H_HOUR = "12";
const TIME_PARTS_RADIX = 10;

/**
 * Shared "nothing selected yet" value. Kept as a single frozen object so that the derived
 * `parts` reference stays stable across renders and does not invalidate memoized children.
 */
const EMPTY_TIME_PARTS: TimeParts = Object.freeze({
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
    meridiem: undefined
});

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

const LAST_MINUTE_IN_HOUR = 59;
const LAST_SECOND_IN_MINUTE = 59;
const LAST_HOUR_IN_24H_FORMAT_DAY = 23;
const FIRST_HOUR_IN_12H_FORMAT = 1;

// ---------------------------------------------------------
// Input mask
// ---------------------------------------------------------

/**
 * The mask library displays its replacement character in every empty slot, so a single `_` is
 * used for all of them and the `replacement` only lists the characters a time can contain.
 * The rules of the individual slots (hour tens `0-2`, minute tens `0-5`, the meridiem letters, ...)
 * are enforced by `createMaskTrack`, which receives them in mask order.
 *
 * The hour slots take 24-hour input in both formats: in the 12-hour format a typed `19:30:00` is
 * converted to `07:30:00 PM` by `parseTime` once the field is left, instead of refusing the `2`.
 */
const TIME_PICKER_INPUT_MASK = "__:__:__";
const TIME_PICKER_INPUT_MASK_WITH_MERIDIEM = "__:__:__ __";

const MASK_REPLACEMENT_24H: Record<string, RegExp> = { [MASK_PLACEHOLDER]: /[0-9]/ };
const MASK_REPLACEMENT_12H: Record<string, RegExp> = { [MASK_PLACEHOLDER]: /[0-9aApPmM]/ };

const MASK_SLOT_RULES_24H: RegExp[] = [/[0-2]/, /[0-9]/, /[0-5]/, /[0-9]/, /[0-5]/, /[0-9]/];
const MASK_SLOT_RULES_12H: RegExp[] = [...MASK_SLOT_RULES_24H, /[aApP]/, /[mM]/];

// ---------------------------------------------------------
// Localization
// ---------------------------------------------------------

const DEFAULT_LOCALIZATION: Required<ITimePickerLocalization> = {
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    clear: "Clear time selection",
    selectHours: "Select hours",
    selectMinutes: "Select minutes",
    selectSeconds: "Select seconds",
    selectMeridiem: "Select AM/PM",
    startTime: "Start time",
    endTime: "End time"
};

export {
    DEFAULT_LOCALIZATION,
    EMPTY_TIME_PARTS,
    FIRST_HOUR_IN_12H_FORMAT,
    HOURS_12,
    HOURS_24,
    LAST_HOUR_IN_24H_FORMAT_DAY,
    LAST_MINUTE_IN_HOUR,
    LAST_SECOND_IN_MINUTE,
    MASK_REPLACEMENT_12H,
    MASK_REPLACEMENT_24H,
    MASK_SLOT_RULES_12H,
    MASK_SLOT_RULES_24H,
    MERIDIEM_LIST,
    MERIDIEM_OFFSET,
    MERIDIEMS,
    MINUTES,
    SECONDS,
    SECONDS_IN_HOUR,
    SECONDS_IN_MINUTE,
    TIME_COLUMNS_ORDER,
    TIME_PART_DEFAULT_12H_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE,
    TIME_PARTS,
    TIME_PARTS_RADIX,
    TIME_PICKER_INPUT_MASK,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM
};
