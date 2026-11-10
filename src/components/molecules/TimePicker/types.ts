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
 * The two values of a range picker as reported by `onChange` and `onBlur`: time strings, an empty
 * string for an empty field.
 */
export type TimePickerRangeValue = {
    start: string;
    end: string;
};

export type ITimePickerLocalization = {
    /**
     * Header of the 'hours' column.
     */
    hours?: string;
    /**
     * Header of the 'minutes' column.
     */
    minutes?: string;
    /**
     * Header of the 'seconds' column.
     */
    seconds?: string;
    /**
     * Accessible label of the clear button.
     */
    clear?: string;
    /**
     * Accessible label of the 'hours' column.
     */
    selectHours?: string;
    /**
     * Accessible label of the 'minutes' column.
     */
    selectMinutes?: string;
    /**
     * Accessible label of the 'seconds' column.
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
