export type TimePickerMeridiem = "AM" | "PM";

export type TimeParts = {
    hours?: string;
    minutes?: string;
    seconds?: string;
    meridiem?: TimePickerMeridiem;
};

export type TimePickerRangeFields = "start" | "end";

export type TimePickerSizes = "small" | "medium" | "large";

export type TimePickerFormat = "12h" | "24h";

export type TimePickerStatus = "rest" | "warning" | "error";

/**
 * Describes what caused an `onChange` call: `input` when the user typed,
 * `select` when a value was picked from the popover, `clear` when the clear button was used.
 */
export type TimePickerChangeSource = "input" | "select" | "clear";

export type ShouldDisableTime = (type: keyof TimeParts, value: string) => boolean;

export type TimePickerChangeContext = {
    source: TimePickerChangeSource;
    /**
     * The parsed time parts, or `null` when the current value is not a complete, valid time.
     */
    parts: TimeParts | null;
};

export type TimePickerRangeChangeContext = TimePickerChangeContext & {
    field: TimePickerRangeFields;
};

export type TimePickerLocalization = {
    /**
     * Header of the hours column.
     */
    hours?: string;
    /**
     * Header of the minutes column.
     */
    minutes?: string;
    /**
     * Header of the seconds column.
     */
    seconds?: string;
    /**
     * Text of the AM button.
     */
    am?: string;
    /**
     * Text of the PM button.
     */
    pm?: string;
    /**
     * Accessible label of the clear button.
     */
    clear?: string;
    /**
     * Accessible label of the hours column.
     */
    selectHours?: string;
    /**
     * Accessible label of the minutes column.
     */
    selectMinutes?: string;
    /**
     * Accessible label of the seconds column.
     */
    selectSeconds?: string;
    /**
     * Accessible label of the meridiem column.
     */
    selectMeridiem?: string;
    /**
     * Accessible label of the range start input.
     */
    startTime?: string;
    /**
     * Accessible label of the range end input.
     */
    endTime?: string;
};
