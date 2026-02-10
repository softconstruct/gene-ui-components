export type DatePickerSizes = "small" | "medium" | "large";
export type DatePickerViewMode = "day" | "month" | "year";
export type DatePickerExcludedDates =
    | Array<{
          date: Date;
          message?: string;
      }>
    | Array<Date>;
