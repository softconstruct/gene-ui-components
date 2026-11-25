import {
    createMaskTrack,
    KEYS,
    MASK_PLACEHOLDER,
    resolveLocalization as resolvePickerLocalization
} from "@internal/components/Picker";

// Constants
import {
    CALENDAR_PAGE_MONTHS,
    DAYS_IN_WEEK,
    DEFAULT_FORMAT,
    DEFAULT_LOCALE,
    DEFAULT_LOCALIZATION,
    FIRST_SUPPORTED_DATE,
    LAST_SUPPORTED_DATE,
    MONTH_AND_YEAR_VIEW_COLUMNS,
    MONTHS_IN_YEAR,
    WEEK_START_DAY,
    WEEKS_IN_MONTH_VIEW,
    YEARS_PER_PAGE
} from "./constants";
// Types
import {
    CalendarDate,
    CalendarRange,
    CalendarView,
    DateBounds,
    DatePickerFormat,
    DatePickerPreset,
    DatePickerPresetDay,
    DatePickerRangePreset,
    IDatePickerLocalization
} from "./types";

type FormatToken = "DD" | "MM" | "YYYY";

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Remainder that is never negative, so weekday and page arithmetic works for any offset.
 */
const modulo = (value: number, divisor: number): number => ((value % divisor) + divisor) % divisor;

const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDaysInMonth = (year: number, month: number): number => {
    if (month === 2) return isLeapYear(year) ? 29 : 28;

    return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

export const compareDates = (a: CalendarDate, b: CalendarDate): number =>
    a.year - b.year || a.month - b.month || a.day - b.day;

export const isSameDate = (a?: CalendarDate | null, b?: CalendarDate | null): boolean =>
    !!a && !!b && compareDates(a, b) === 0;

/**
 * The two days as a range, the earlier one as its start.
 */
export const toRange = (a: CalendarDate, b: CalendarDate): CalendarRange =>
    compareDates(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a };

/**
 * Brings every part into its range: the year into the supported years, the month into `1`..`12`
 * and the day into the month, so `31/04` becomes `30/04` and `29/02/2027` becomes `28/02/2027`.
 */
export const normalizeDate = ({ year, month, day }: CalendarDate): CalendarDate => {
    const safeYear = clamp(year, FIRST_SUPPORTED_DATE.year, LAST_SUPPORTED_DATE.year);
    const safeMonth = clamp(month, 1, MONTHS_IN_YEAR);

    return { year: safeYear, month: safeMonth, day: clamp(day, 1, getDaysInMonth(safeYear, safeMonth)) };
};

/**
 * The day as a UTC midnight, so neither the time zone nor daylight saving time can shift it.
 */
const toUTCDate = ({ year, month, day }: CalendarDate): Date => {
    const date = new Date(0);

    date.setUTCFullYear(year, month - 1, day);

    return date;
};

const fromUTCDate = (date: Date): CalendarDate => ({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
});

export const getToday = (): CalendarDate => {
    const now = new Date();

    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
};

const addDays = (date: CalendarDate, days: number): CalendarDate =>
    fromUTCDate(toUTCDate({ ...date, day: date.day + days }));

/**
 * Keeps the day of the month where the target month has it, otherwise takes its last day.
 */
export const addMonths = ({ year, month, day }: CalendarDate, months: number): CalendarDate => {
    const monthIndex = year * MONTHS_IN_YEAR + month - 1 + months;
    const nextYear = Math.floor(monthIndex / MONTHS_IN_YEAR);
    const nextMonth = monthIndex - nextYear * MONTHS_IN_YEAR + 1;

    return { year: nextYear, month: nextMonth, day: Math.min(day, getDaysInMonth(nextYear, nextMonth)) };
};

/**
 * The number of months from the month of `from` to the month of `to`, negative when `to` is earlier.
 */
export const getMonthDistance = (from: CalendarDate, to: CalendarDate): number =>
    (to.year - from.year) * MONTHS_IN_YEAR + to.month - from.month;

/**
 * Weekday in `Date.getDay()` numbering: `0` is Sunday.
 */
const getWeekday = (date: CalendarDate): number => toUTCDate(date).getUTCDay();

const getWeekStart = (date: CalendarDate): CalendarDate =>
    addDays(date, -modulo(getWeekday(date) - WEEK_START_DAY, DAYS_IN_WEEK));

/**
 * The days shown for a month: six weeks from the week start day, with the days of the neighbouring
 * months around it.
 */
export const getMonthWeeks = (year: number, month: number): CalendarDate[][] => {
    const start = getWeekStart({ year, month, day: 1 });

    return Array.from({ length: WEEKS_IN_MONTH_VIEW }, (_, week) =>
        Array.from({ length: DAYS_IN_WEEK }, (__, weekday) => addDays(start, week * DAYS_IN_WEEK + weekday))
    );
};

/**
 * The first year of the decade the year view shows `year` in.
 */
export const getYearPageStart = (year: number): number => year - modulo(year, YEARS_PER_PAGE);

/**
 * The years of the year view page that shows `year`: its decade, with the year before and the year
 * after it.
 */
export const getYearPageYears = (year: number): number[] => {
    const start = getYearPageStart(year);

    return Array.from({ length: YEARS_PER_PAGE + 2 }, (_, index) => start - 1 + index);
};

export const isSupportedDate = (date: CalendarDate): boolean =>
    compareDates(date, FIRST_SUPPORTED_DATE) >= 0 && compareDates(date, LAST_SUPPORTED_DATE) <= 0;

const latest = (date: CalendarDate, other?: CalendarDate | null): CalendarDate =>
    other && compareDates(other, date) > 0 ? other : date;

const earliest = (date: CalendarDate, other?: CalendarDate | null): CalendarDate =>
    other && compareDates(other, date) < 0 ? other : date;

/**
 * Bounds from optional limits, always kept inside the supported days. Several limits on one side
 * combine into the tightest one.
 */
export const createBounds = (min: (CalendarDate | null)[] = [], max: (CalendarDate | null)[] = []): DateBounds => ({
    min: min.reduce<CalendarDate>((result, limit) => latest(result, limit), FIRST_SUPPORTED_DATE),
    max: max.reduce<CalendarDate>((result, limit) => earliest(result, limit), LAST_SUPPORTED_DATE)
});

export const isDateOutOfBounds = (date: CalendarDate, { min, max }: DateBounds): boolean =>
    compareDates(date, min) < 0 || compareDates(date, max) > 0;

export const isMonthOutOfBounds = (year: number, month: number, { min, max }: DateBounds): boolean =>
    year * MONTHS_IN_YEAR + month < min.year * MONTHS_IN_YEAR + min.month ||
    year * MONTHS_IN_YEAR + month > max.year * MONTHS_IN_YEAR + max.month;

export const isYearOutOfBounds = (year: number, { min, max }: DateBounds): boolean =>
    year < min.year || year > max.year;

/**
 * Returns the closest allowed day: the day itself while it is inside the bounds, otherwise the
 * bound it went past.
 */
export const getNearestAvailableDate = (date: CalendarDate, { min, max }: DateBounds): CalendarDate =>
    earliest(latest(date, min), max);

/**
 * Whether the cell of `view` that shows `date` cannot be picked: the day, its month or its year is
 * outside the bounds.
 */
export const isCalendarCellOutOfBounds = (view: CalendarView, date: CalendarDate, bounds: DateBounds): boolean => {
    if (view === "days") return isDateOutOfBounds(date, bounds);
    if (view === "months") return isMonthOutOfBounds(date.year, date.month, bounds);

    return isYearOutOfBounds(date.year, bounds);
};

/**
 * Whether the page of `view` that shows `date` has nothing selectable, so the header button that
 * leads to it is disabled.
 */
export const isCalendarPageOutOfBounds = (view: CalendarView, date: CalendarDate, bounds: DateBounds): boolean => {
    if (view === "days") return isMonthOutOfBounds(date.year, date.month, bounds);
    if (view === "months") return isYearOutOfBounds(date.year, bounds);

    const pageStart = getYearPageStart(date.year);

    return pageStart + YEARS_PER_PAGE - 1 < bounds.min.year || pageStart > bounds.max.year;
};

/**
 * Whether the page of `view` that shows `a` also shows `b`: the same month, year or decade.
 */
export const isSameCalendarPage = (view: CalendarView, a: CalendarDate, b: CalendarDate): boolean => {
    if (view === "years") return getYearPageStart(a.year) === getYearPageStart(b.year);

    return a.year === b.year && (view === "months" || a.month === b.month);
};

/**
 * The pages the panel at `index` of `count` side by side panels can be paged to: the months of the
 * bounds, less the ones the panels before and after it need, as the panels never meet.
 */
export const getPanelPageBounds = ({ min, max }: DateBounds, index: number, count: number): DateBounds => {
    const lastMonth = addMonths({ ...max, day: 1 }, index - count + 1);

    return {
        min: addMonths({ ...min, day: 1 }, index),
        max: { ...lastMonth, day: getDaysInMonth(lastMonth.year, lastMonth.month) }
    };
};

/**
 * Keeps side by side panels in order, each a month after the one before it at least: the panel at
 * `index` keeps its date, and the panels it would meet move away from it, on the same day of the
 * month. A panel pushed past the supported dates stays on their edge, and the others give way to it.
 */
export const orderPanelDates = (dates: CalendarDate[], index: number): CalendarDate[] => {
    const ordered = dates.map((date, other) => {
        const offset = other - index;
        const distance = getMonthDistance(dates[index], date);

        if (offset > 0 ? distance >= offset : distance <= offset) return date;

        return addMonths({ ...dates[index], day: date.day }, offset);
    });
    const pushedOut = ordered.findIndex((date) => !isSupportedDate(date));

    if (pushedOut < 0) return ordered;

    return orderPanelDates(
        ordered.map((date) => getNearestAvailableDate(date, createBounds())),
        pushedOut
    );
};

/**
 * Whether the page is laid out right to left, which the arrow keys and the header chevrons follow.
 */
export const isDocumentRTL = (): boolean => typeof document !== "undefined" && document.dir === "rtl";

/**
 * The day a key moves the calendar focus to, or `null` for keys the calendar leaves alone. Days:
 * the arrows move by a day or a week, `Home`/`End` to the edges of the week, `PageUp`/`PageDown` by
 * a month, or by a year with `Shift`. Months and years: the arrows move by a cell or a row,
 * `Home`/`End` to the first or last month of the year or year of the decade, `PageUp`/`PageDown` by
 * a page. In RTL the horizontal arrows follow the layout.
 */
export const getCalendarKeyTarget = (
    view: CalendarView,
    date: CalendarDate,
    key: string,
    { shiftKey = false, isRTL = false }: { shiftKey?: boolean; isRTL?: boolean } = {}
): CalendarDate | null => {
    const forward = isRTL ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT;
    const backward = isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT;

    if (view === "days") {
        switch (key) {
            case forward:
                return addDays(date, 1);
            case backward:
                return addDays(date, -1);
            case KEYS.ARROW_DOWN:
                return addDays(date, DAYS_IN_WEEK);
            case KEYS.ARROW_UP:
                return addDays(date, -DAYS_IN_WEEK);
            case KEYS.HOME:
                return getWeekStart(date);
            case KEYS.END:
                return addDays(getWeekStart(date), DAYS_IN_WEEK - 1);
            case KEYS.PAGE_DOWN:
                return addMonths(date, shiftKey ? MONTHS_IN_YEAR : 1);
            case KEYS.PAGE_UP:
                return addMonths(date, shiftKey ? -MONTHS_IN_YEAR : -1);
            default:
                return null;
        }
    }

    const cell = view === "months" ? 1 : MONTHS_IN_YEAR;
    const row = cell * MONTH_AND_YEAR_VIEW_COLUMNS;
    const first = view === "months" ? 1 - date.month : (getYearPageStart(date.year) - date.year) * MONTHS_IN_YEAR;

    switch (key) {
        case forward:
            return addMonths(date, cell);
        case backward:
            return addMonths(date, -cell);
        case KEYS.ARROW_DOWN:
            return addMonths(date, row);
        case KEYS.ARROW_UP:
            return addMonths(date, -row);
        case KEYS.HOME:
            return addMonths(date, first);
        case KEYS.END:
            return addMonths(date, first + CALENDAR_PAGE_MONTHS[view] - cell);
        case KEYS.PAGE_DOWN:
            return addMonths(date, CALENDAR_PAGE_MONTHS[view]);
        case KEYS.PAGE_UP:
            return addMonths(date, -CALENDAR_PAGE_MONTHS[view]);
        default:
            return null;
    }
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const toISO = ({ year, month, day }: CalendarDate): string => `${pad(year, 4)}-${pad(month)}-${pad(day)}`;

/**
 * Identifies the cell of `view` that shows `date`: an ISO day, a `YYYY-MM` month or a `YYYY` year.
 */
export const getCalendarCellKey = (view: CalendarView, date: CalendarDate): string => {
    if (view === "days") return toISO(date);
    if (view === "months") return `${pad(date.year, 4)}-${pad(date.month)}`;

    return pad(date.year, 4);
};

/**
 * Reads an ISO date (`YYYY-MM-DD`). Out of range parts are clamped; anything else is `null`.
 */
export const fromISO = (value?: string | null): CalendarDate | null => {
    const match = value ? ISO_DATE_PATTERN.exec(value.trim()) : null;

    if (!match) return null;

    const [, year, month, day] = match;

    return normalizeDate({ year: Number(year), month: Number(month), day: Number(day) });
};

/**
 * A day of a preset: an ISO date, or a whole number of days from `today`. Anything else, and a day
 * outside the supported dates, is `null`.
 */
const resolvePresetDay = (day: DatePickerPresetDay, today: CalendarDate): CalendarDate | null => {
    let date: CalendarDate | null = null;

    if (typeof day === "number") date = Number.isInteger(day) ? addDays(today, day) : null;
    else if (typeof day === "string") date = fromISO(day);

    return date && isSupportedDate(date) ? date : null;
};

/**
 * The day a preset of the single picker picks on `today`, or `null` when its value is not a day.
 */
export const resolveSinglePreset = ({ value }: DatePickerPreset, today: CalendarDate): CalendarDate | null =>
    resolvePresetDay(typeof value === "function" ? value(toISO(today)) : value, today);

/**
 * The range a preset of the range picker picks on `today`, start first whatever the order of its
 * days, or `null` when one of them is not a day.
 */
export const resolveRangePreset = ({ value }: DatePickerRangePreset, today: CalendarDate): CalendarRange | null => {
    const range = typeof value === "function" ? value(toISO(today)) : value;
    const start = range ? resolvePresetDay(range.start, today) : null;
    const end = range ? resolvePresetDay(range.end, today) : null;

    if (!start || !end) return null;

    return toRange(start, end);
};

/**
 * The parts of the date a format writes, each one exactly once; the rest of the format is text.
 */
const FORMAT_TOKENS: FormatToken[] = ["DD", "MM", "YYYY"];

const FORMAT_SEGMENT_PATTERN = /D+|M+|Y+|[^DMY]+/g;

const TOKEN_SLOT_RULES: Record<FormatToken, RegExp[]> = {
    DD: [/[0-3]/, /\d/],
    MM: [/[01]/, /\d/],
    YYYY: [/\d/, /\d/, /\d/, /\d/]
};

const isToken = (segment: string): segment is FormatToken => (FORMAT_TOKENS as string[]).includes(segment);

/**
 * The runs of a format in order: `DD/MM/YYYY` gives `DD`, `/`, `MM`, `/`, `YYYY`.
 */
const getFormatSegments = (format: DatePickerFormat): string[] => format.match(FORMAT_SEGMENT_PATTERN) ?? [];

/**
 * The text after the last part of a format, like `日` in `YYYY年MM月DD日`. The input mask only shows
 * text up to the last typed digit, so a typed date ends without it.
 */
const getFormatSuffix = (format: DatePickerFormat): string => {
    const last = getFormatSegments(format).pop() ?? "";

    return isToken(last) ? "" : last;
};

/**
 * Whether the picker can use a format: `DD`, `MM` and `YYYY` once each, in any order, with any
 * text around them that has no other capital `D`, `M` or `Y` and no `_`, the placeholder of the mask.
 */
const isValidDateFormat = (format: string): boolean => {
    const tokens = getFormatSegments(format).filter((segment) => /^[DMY]/.test(segment));

    return (
        !format.includes(MASK_PLACEHOLDER) &&
        tokens.length === FORMAT_TOKENS.length &&
        FORMAT_TOKENS.every((token) => tokens.includes(token))
    );
};

/**
 * The format the picker works with: `format` when it is valid, the default one otherwise.
 */
export const resolveDateFormat = (format?: string): DatePickerFormat =>
    format && isValidDateFormat(format) ? format : DEFAULT_FORMAT;

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");

const formatPatterns = new Map<DatePickerFormat, RegExp>();

const getFormatPattern = (format: DatePickerFormat): RegExp => {
    let pattern = formatPatterns.get(format);

    if (!pattern) {
        const suffix = getFormatSuffix(format);
        const source = getFormatSegments(format)
            .slice(0, suffix ? -1 : undefined)
            .map((segment) => (isToken(segment) ? `(\\d{${segment.length}})` : escapeRegExp(segment)))
            .join("");

        pattern = new RegExp(`^${source}${suffix ? `(?:${escapeRegExp(suffix)})?` : ""}$`);
        formatPatterns.set(format, pattern);
    }

    return pattern;
};

/**
 * The input mask of a format: every digit of `DD/MM/YYYY` becomes a slot, `__/__/____`.
 */
export const getDateMask = (format: DatePickerFormat): string => format.replace(/[DMY]/g, MASK_PLACEHOLDER);

/**
 * The `track` of the input mask of a format: a day starts with `0`..`3`, a month with `0` or `1`,
 * so a typed value can only be off by its last digit, which `parseDate` clamps.
 */
export const createDateMaskTrack = (format: DatePickerFormat) =>
    createMaskTrack(
        getDateMask(format),
        getFormatSegments(format).flatMap((segment) => (isToken(segment) ? TOKEN_SLOT_RULES[segment] : []))
    );

export const formatDate = ({ year, month, day }: CalendarDate, format: DatePickerFormat): string => {
    const parts: Record<FormatToken, string> = { DD: pad(day), MM: pad(month), YYYY: pad(year, 4) };

    return getFormatSegments(format)
        .map((segment) => (isToken(segment) ? parts[segment] : segment))
        .join("");
};

/**
 * Reads a date typed in `format`. Out of range parts are clamped (`31/04/2026` reads as
 * `30/04/2026`); anything that is not a complete date is `null`. The text after the last part may
 * be left out, as the input mask does while the date is typed.
 */
export const parseDate = (text: string | null, format: DatePickerFormat): CalendarDate | null => {
    const match = text ? getFormatPattern(format).exec(text) : null;

    if (!match) return null;

    const parts: Record<FormatToken, number> = { DD: 1, MM: 1, YYYY: 1 };

    getFormatSegments(format)
        .filter(isToken)
        .forEach((segment, index) => {
            parts[segment] = Number(match[index + 1]);
        });

    return normalizeDate({ year: parts.YYYY, month: parts.MM, day: parts.DD });
};

/**
 * Whether `text` is `date` written in `format`, with or without the text after the last part, so
 * a typed date that needed clamping (`31/04/2026`) is told from one that did not.
 */
export const isFormattedDate = (text: string, date: CalendarDate, format: DatePickerFormat): boolean => {
    const formatted = formatDate(date, format);

    return text === formatted || text === formatted.slice(0, formatted.length - getFormatSuffix(format).length);
};

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
    const key = `${locale}|${JSON.stringify(options)}`;
    let formatter = formatters.get(key);

    if (!formatter) {
        try {
            // Some locales default to another calendar (Persian for `fa-IR`, Buddhist for `th-TH`), which
            // would put their day numbers and month names on the Gregorian grid.
            formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC", calendar: "gregory" });
        } catch {
            // A locale that is not a language tag, like `en_US` or an empty string, throws.
            formatter = getFormatter(DEFAULT_LOCALE, options);
        }

        formatters.set(key, formatter);
    }

    return formatter;
};

const formatInLocale = (date: CalendarDate, locale: string, options: Intl.DateTimeFormatOptions): string =>
    getFormatter(locale, options).format(toUTCDate(date));

/**
 * One part of the date alone, in the digits of the locale. On its own a day or a year is written with
 * more than its number in some locales (`15日`, `15.`, `2026 г.`), which a cell has no room for.
 */
const formatPartInLocale = (
    date: CalendarDate,
    locale: string,
    options: Intl.DateTimeFormatOptions,
    type: Intl.DateTimeFormatPartTypes
): string =>
    getFormatter(locale, options)
        .formatToParts(toUTCDate(date))
        .filter((part) => part.type === type)
        .map((part) => part.value)
        .join("");

export const formatFullDate = (date: CalendarDate, locale: string): string =>
    formatInLocale(date, locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export const formatDay = (date: CalendarDate, locale: string): string =>
    formatPartInLocale(date, locale, { day: "numeric" }, "day");

export const formatMonthYear = (year: number, month: number, locale: string): string =>
    formatInLocale({ year, month, day: 1 }, locale, { year: "numeric", month: "long" });

export const formatMonth = (month: number, locale: string, style: "long" | "short"): string =>
    formatInLocale({ year: 2000, month, day: 1 }, locale, { month: style });

export const formatYear = (year: number, locale: string): string =>
    formatPartInLocale({ year, month: 1, day: 1 }, locale, { year: "numeric" }, "year");

/**
 * The column headers of the day view, from the week start day.
 */
export const getWeekdayNames = (locale: string): { narrow: string; long: string }[] =>
    Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
        // 1 January 2023 is a Sunday, so day `1 + n` has the weekday `n`.
        const date = { year: 2023, month: 1, day: 1 + modulo(WEEK_START_DAY + index, DAYS_IN_WEEK) };

        return {
            narrow: formatInLocale(date, locale, { weekday: "narrow" }),
            long: formatInLocale(date, locale, { weekday: "long" })
        };
    });

/**
 * Merges the consumer localization over the defaults, ignoring empty entries.
 */
export const resolveLocalization = (localization?: IDatePickerLocalization): Required<IDatePickerLocalization> =>
    resolvePickerLocalization(DEFAULT_LOCALIZATION, localization);
