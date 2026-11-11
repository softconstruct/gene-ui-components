export type DatePickerSizes = "small" | "medium" | "large";

export type DatePickerStatus = "rest" | "warning" | "error";

export type DatePickerRangeFields = "start" | "end";

/**
 * Display format of the input: `DD`, `MM` and `YYYY` once each, in any order, with any text around
 * them, like `DD/MM/YYYY`, `YYYY.MM.DD` or `YYYY年MM月DD日`. The value is always an ISO date
 * (`YYYY-MM-DD`), whatever the format.
 */
export type DatePickerFormat = string;

/**
 * The two values of a range picker as reported by `onChange` and `onBlur`: ISO dates, an empty
 * string for an empty field.
 */
export type DatePickerRangeValue = {
    start: string;
    end: string;
};

/**
 * A day of the calendar, without a time or a time zone. `month` is 1-based.
 */
export type CalendarDate = {
    year: number;
    month: number;
    day: number;
};

export type CalendarView = "days" | "months" | "years";

/**
 * The selected days of the calendar; a single picker only uses `start`.
 */
export type CalendarSelection = {
    start: CalendarDate | null;
    end: CalendarDate | null;
};

/**
 * The days a range calendar highlights: the selected range, or the one the pointer previews.
 */
export type CalendarRange = {
    start: CalendarDate;
    end: CalendarDate;
};

/**
 * The days of a week row that the range covers, as the indexes of the first and the last one, with
 * whether the range starts or ends there.
 */
export type CalendarRangeBand = {
    from: number;
    to: number;
    isStart: boolean;
    isEnd: boolean;
};

/**
 * A day of a preset: an ISO date (`YYYY-MM-DD`), or a whole number of days from today, like `0` for
 * today and `-1` for yesterday.
 */
export type DatePickerPresetDay = string | number;

/**
 * A preset of the single picker: its text and the day it picks.
 */
export type DatePickerPreset = {
    /**
     * Text of the preset.
     */
    label: string;
    /**
     * The day the preset picks, or a function that gets today's ISO date and returns it, for days
     * like the first of the month.
     */
    value: DatePickerPresetDay | ((today: string) => DatePickerPresetDay);
};

/**
 * The days a preset of the range picker picks, in any order.
 */
export type DatePickerRangePresetValue = {
    start: DatePickerPresetDay;
    end: DatePickerPresetDay;
};

/**
 * A preset of the range picker: its text and the range it picks.
 */
export type DatePickerRangePreset = {
    /**
     * Text of the preset.
     */
    label: string;
    /**
     * The range the preset picks, like `{ start: -6, end: 0 }` for the last 7 days, or a function
     * that gets today's ISO date and returns it, for ranges like this month.
     */
    value: DatePickerRangePresetValue | ((today: string) => DatePickerRangePresetValue);
};

/**
 * A preset as the calendar shows it: selected while the value is the one it picks, disabled when
 * that value is outside `min`/`max` or is not a date.
 */
export type CalendarPresetState = {
    key: string;
    label: string;
    selected: boolean;
    disabled: boolean;
};

/**
 * The earliest and latest selectable day.
 */
export type DateBounds = {
    min: CalendarDate;
    max: CalendarDate;
};

export type IDatePickerLocalization = {
    /**
     * Accessible label of the clear button.
     */
    clear?: string;
    /**
     * Accessible label of the button that shows the previous month.
     */
    previousMonth?: string;
    /**
     * Accessible label of the button that shows the next month.
     */
    nextMonth?: string;
    /**
     * Accessible label of the button that shows the previous year, in the day and the month view.
     */
    previousYear?: string;
    /**
     * Accessible label of the button that shows the next year, in the day and the month view.
     */
    nextYear?: string;
    /**
     * Accessible label of the button that shows the previous decade in the year view.
     */
    previousDecade?: string;
    /**
     * Accessible label of the button that shows the next decade in the year view.
     */
    nextDecade?: string;
    /**
     * Added to the accessible label of the header month, which switches to the month view.
     */
    chooseMonth?: string;
    /**
     * Added to the accessible label of the header year, which switches to the year view.
     */
    chooseYear?: string;
    /**
     * Accessible label of the range start input.
     */
    startDate?: string;
    /**
     * Accessible label of the range end input.
     */
    endDate?: string;
    /**
     * Accessible label of the preset list.
     */
    presets?: string;
};
