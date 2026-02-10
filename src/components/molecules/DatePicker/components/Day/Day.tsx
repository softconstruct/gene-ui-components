import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { isPast, isSameDay, startOfDay } from "date-fns";

// Components
import Tooltip from "@components/molecules/Tooltip";

import "./Day.scss";

import { DatePickerExcludedDates } from "../../types";

interface IDatePickerDayProps {
    /**
     *
     */
    day: number;
    /**
     *
     */
    startDate?: Date | null;
    /**
     *
     */
    endDate?: Date | null;
    /**
     *
     */
    withRange?: boolean;
    /**
     *
     */
    date: Date;
    /**
     *
     */
    excludedDates?: DatePickerExcludedDates;
}

const Day: React.FC<IDatePickerDayProps> = ({ day, date, startDate, endDate, withRange, excludedDates }) => {
    const excludeKey = "date";

    const disabledEntry = useMemo(() => {
        if (!excludedDates || excludedDates.length === 0) return undefined;

        return excludedDates.find((item) => {
            const rawValue = item instanceof Date ? item : item?.[excludeKey];
            if (!rawValue) return false;

            const dateToCompare = startOfDay(new Date(rawValue));
            const currentDay = startOfDay(new Date(date));

            const match = isSameDay(dateToCompare, currentDay);

            return match;
        });
    }, [excludedDates, date]);

    const isDisabled = !!disabledEntry;
    const tooltipMsg = disabledEntry instanceof Date ? undefined : disabledEntry?.message;

    const getCustomDayClass = useCallback(
        (dayDate: Date) => {
            const isToday = isSameDay(dayDate, new Date());
            const isSelectedStart = startDate && isSameDay(dayDate, startDate);
            const isSelectedEnd = endDate && isSameDay(dayDate, endDate);
            const isInsideRange = startDate && endDate && dayDate > startDate && dayDate < endDate;
            // const isInCurrentMonth = isWithinInterval(date, currentMonthInterval);

            return classNames("datePicker__day", {
                datePicker__day_today: isToday,
                datePicker__day_past: isPast(dayDate) && !isToday,
                datePicker__day_withRange: withRange,
                // "datePicker__day_outsideOfMonth": !isInCurrentMonth,
                datePicker__day_selected: isSelectedStart || isSelectedEnd,
                datePicker__day_insideSelectedRange: isInsideRange,
                datePicker__day_disabled: isDisabled
            });
        },
        [startDate, endDate, withRange]
    );

    if (isDisabled && tooltipMsg) {
        return (
            <Tooltip text={tooltipMsg} position="bottom-center">
                <div className={getCustomDayClass(date)}>{day}</div>
            </Tooltip>
        );
    }

    return <div className={getCustomDayClass(date)}>{day}</div>;
};

export default Day;
