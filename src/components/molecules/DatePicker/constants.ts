import { MASK_PLACEHOLDER } from "@internal/components/Picker";

// Types
import { CalendarDate, CalendarView, DatePickerFormat, IDatePickerLocalization } from "./types";

const DEFAULT_FORMAT: DatePickerFormat = "DD/MM/YYYY";

const DEFAULT_LOCALE = "en-US";

/**
 * The days the calendar can show and a typed value is clamped to.
 */
const FIRST_SUPPORTED_DATE: CalendarDate = { year: 1, month: 1, day: 1 };
const LAST_SUPPORTED_DATE: CalendarDate = { year: 9999, month: 12, day: 31 };

const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;

/**
 * Every month is shown as six weeks, so the calendar keeps its height from month to month.
 */
const WEEKS_IN_MONTH_VIEW = 6;

/**
 * The first column of the calendar, in `Date.getDay()` numbering: Monday, as in ISO 8601.
 */
const WEEK_START_DAY = 1;

/**
 * Columns of the month and year views; both show twelve cells.
 */
const MONTH_AND_YEAR_VIEW_COLUMNS = 3;

/**
 * The year view pages through decades, with the year before and the year after the decade around it.
 */
const YEARS_PER_PAGE = 10;

/**
 * Months one page of each calendar view spans: a month of days, a year of months, a decade of years.
 */
const CALENDAR_PAGE_MONTHS: Record<CalendarView, number> = {
    days: 1,
    months: MONTHS_IN_YEAR,
    years: MONTHS_IN_YEAR * YEARS_PER_PAGE
};

/**
 * The range calendar shows two months side by side, except on phones.
 */
const RANGE_CALENDAR_PANELS = 2;

/**
 * Digits are the only characters a date can contain; the rules of the individual slots (day tens
 * `0-3`, month tens `0-1`, ...) are enforced by `createMaskTrack`.
 */
const DATE_MASK_REPLACEMENT: Record<string, RegExp> = { [MASK_PLACEHOLDER]: /\d/ };

const DEFAULT_LOCALIZATION: Required<IDatePickerLocalization> = {
    clear: "Clear date selection",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYear: "Previous year",
    nextYear: "Next year",
    previousDecade: "Previous decade",
    nextDecade: "Next decade",
    chooseMonth: "choose month",
    chooseYear: "choose year",
    startDate: "Start date",
    endDate: "End date",
    presets: "Presets"
};

export {
    CALENDAR_PAGE_MONTHS,
    DATE_MASK_REPLACEMENT,
    DAYS_IN_WEEK,
    DEFAULT_FORMAT,
    DEFAULT_LOCALE,
    DEFAULT_LOCALIZATION,
    FIRST_SUPPORTED_DATE,
    LAST_SUPPORTED_DATE,
    MONTH_AND_YEAR_VIEW_COLUMNS,
    MONTHS_IN_YEAR,
    RANGE_CALENDAR_PANELS,
    WEEK_START_DAY,
    WEEKS_IN_MONTH_VIEW,
    YEARS_PER_PAGE
};
