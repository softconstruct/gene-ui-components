import { TimeParts, TimePickerLocalization } from "./types";

// ---------------------------------------------------------
// Range generation
// ---------------------------------------------------------

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

const PICKER_RANGE_FIELDS = {
    START: "start",
    END: "end"
} as const;

// ---------------------------------------------------------
// Numeric constants
// ---------------------------------------------------------

const MERIDIEM_OFFSET = 12;

const TIME_PART_DEFAULT_TEXT_VALUE = "00";
const TIME_PART_DEFAULT_12H_HOUR = "12";
const TIME_PARTS_RADIX = 10;

/**
 * Typing reports through `onChange` once the user pauses for this long.
 */
const INPUT_CHANGE_DEBOUNCE_MS = 300;

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

const HOURS_IN_DAY = 24;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = HOURS_IN_DAY * SECONDS_IN_HOUR;

const LAST_MINUTE_IN_HOUR = 59;
const LAST_SECOND_IN_MINUTE = 59;
const LAST_HOUR_IN_24H_FORMAT_DAY = 23;
const FIRST_HOUR_IN_12H_FORMAT = 1;

// ---------------------------------------------------------
// Size mappers
// ---------------------------------------------------------

const textSizeMap = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

const headerTextVariantMap = {
    large: "bodyMediumSemibold",
    medium: "bodyMediumSemibold",
    small: "captionLargeSemibold"
} as const;

const pickerShellIconSizeMap = {
    small: "smallNudge",
    medium: "small",
    large: "small"
} as const;

// ---------------------------------------------------------
// Input mask
// ---------------------------------------------------------

/**
 * The mask library displays its replacement character in every empty slot, so a single `_` is
 * used for all of them and the `replacement` only lists the characters a time can contain.
 * The rules of the individual slots (hour tens `0-2`, minute tens `0-5`, the meridiem letters, ...)
 * are enforced by `createMaskTrack`, which receives them in mask order.
 */
const MASK_PLACEHOLDER = "_";
const TIME_PICKER_INPUT_MASK = "__:__:__";
const TIME_PICKER_INPUT_MASK_WITH_MERIDIEM = "__:__:__ __";

const MASK_REPLACEMENT_24H: Record<string, RegExp> = { [MASK_PLACEHOLDER]: /[0-9]/ };
const MASK_REPLACEMENT_12H: Record<string, RegExp> = { [MASK_PLACEHOLDER]: /[0-9aApPmM]/ };

const MASK_SLOT_RULES_24H: RegExp[] = [/[0-2]/, /[0-9]/, /[0-5]/, /[0-9]/, /[0-5]/, /[0-9]/];
const MASK_SLOT_RULES_12H: RegExp[] = [/[0-1]/, /[0-9]/, /[0-5]/, /[0-9]/, /[0-5]/, /[0-9]/, /[aApP]/, /[mM]/];

// ---------------------------------------------------------
// Accessibility & localization
// ---------------------------------------------------------

/**
 * `id` prefix used when the consumer does not provide an `id`.
 */
const DEFAULT_ID_PREFIX = "default-id-";

const DEFAULT_LOCALIZATION: Required<TimePickerLocalization> = {
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    am: "AM",
    pm: "PM",
    clear: "Clear time selection",
    selectHours: "Select hours",
    selectMinutes: "Select minutes",
    selectSeconds: "Select seconds",
    selectMeridiem: "Select AM/PM",
    startTime: "Start time",
    endTime: "End time"
};

const KEYS = {
    ENTER: "Enter",
    SPACE: " ",
    ESCAPE: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    HOME: "Home",
    END: "End"
} as const;

export {
    DEFAULT_ID_PREFIX,
    DEFAULT_LOCALIZATION,
    EMPTY_TIME_PARTS,
    FIRST_HOUR_IN_12H_FORMAT,
    headerTextVariantMap,
    HOURS_12,
    HOURS_24,
    HOURS_IN_DAY,
    INPUT_CHANGE_DEBOUNCE_MS,
    KEYS,
    LAST_HOUR_IN_24H_FORMAT_DAY,
    LAST_MINUTE_IN_HOUR,
    LAST_SECOND_IN_MINUTE,
    MASK_PLACEHOLDER,
    MASK_REPLACEMENT_12H,
    MASK_REPLACEMENT_24H,
    MASK_SLOT_RULES_12H,
    MASK_SLOT_RULES_24H,
    MERIDIEM_LIST,
    MERIDIEM_OFFSET,
    MERIDIEMS,
    MINUTES,
    PICKER_RANGE_FIELDS,
    SECONDS,
    SECONDS_IN_DAY,
    SECONDS_IN_HOUR,
    SECONDS_IN_MINUTE,
    textSizeMap,
    TIME_COLUMNS_ORDER,
    TIME_PART_DEFAULT_12H_HOUR,
    TIME_PART_DEFAULT_TEXT_VALUE,
    TIME_PARTS,
    TIME_PARTS_RADIX,
    TIME_PICKER_INPUT_MASK,
    TIME_PICKER_INPUT_MASK_WITH_MERIDIEM,
    pickerShellIconSizeMap
};
