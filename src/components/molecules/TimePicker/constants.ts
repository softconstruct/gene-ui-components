import { generateRange } from "@components/molecules/TimePicker/helpers";

const LABEL_SIZE_MAPPER = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

const HOURS_24 = generateRange(0, 23);
const HOURS_12 = generateRange(1, 12);
const MINUTES = generateRange(0, 59);
const SECONDS = generateRange(0, 59);
const MERIDIEMS = {
    AM: "AM",
    PM: "PM"
};
const PICKER_RANGE_FIELDS = {
    START: "start",
    END: "end"
} as const;

const TIME_PARTS = {
    HOURS: "hours",
    MINUTES: "minutes",
    SECONDS: "seconds",
    MERIDIEM: "meridiem"
} as const;

const MERIDIEM_OFFSET = 12;

const TIME_PART_DEFAULT_TEXT_VALUE = "00";
const TIME_PARTS_RADIX = 10;

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_HOUR = 3600;
const LAST_MINUTE_IN_HOUR = 59;
const LAST_SECOND_IN_MINUTE = 59;
const LAST_HOUR_IN_24H_FORMAT_DAY = 23;

const TIME_PICKER_FIELD_ID = "time-picker-field";

const RANGE_TIME_PICKER_FIELDS_IDS = {
    start: "range-time-picker-start-field",
    end: "range-time-picker-end-field"
};

export {
    LABEL_SIZE_MAPPER,
    HOURS_24,
    HOURS_12,
    MINUTES,
    SECONDS,
    MERIDIEMS,
    MINUTES_IN_HOUR,
    SECONDS_IN_HOUR,
    HOURS_IN_DAY,
    PICKER_RANGE_FIELDS,
    TIME_PARTS,
    TIME_PART_DEFAULT_TEXT_VALUE,
    MERIDIEM_OFFSET,
    TIME_PARTS_RADIX,
    LAST_MINUTE_IN_HOUR,
    LAST_SECOND_IN_MINUTE,
    LAST_HOUR_IN_24H_FORMAT_DAY,
    TIME_PICKER_FIELD_ID,
    RANGE_TIME_PICKER_FIELDS_IDS
};
