import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import {
    isSameDay,
    isPast,
    startOfDay,
} from 'date-fns';

import './Day.scss';
import { DatePickerExcludedDates } from '../../types';
import Tooltip from '@components/molecules/Tooltip';

interface IDatePickerDayProps {
    day: number;
    startDate?: Date | null;
    endDate?: Date | null;
    withRange?: boolean;
    date: Date;
    excludedDates?: DatePickerExcludedDates
}

const Day: React.FC<IDatePickerDayProps> = ({ day, date, startDate, endDate, withRange, excludedDates = [] }) => {
    const today = useMemo(() => new Date(), []);
    const excludeKey = "date";
    // console.log('Excluded dates: ', excludedDates)
    const disabledEntry = useMemo(() => {
        if (!excludedDates || excludedDates.length === 0) return undefined;

        return excludedDates.find(item => {
            const rawValue = item instanceof Date ? item : item?.[excludeKey];
            if (!rawValue) return false;

            // Convert both to standard local Date objects at 00:00:00
            const dateToCompare = startOfDay(new Date(rawValue));
            const currentDay = startOfDay(new Date(date));

            const match = isSameDay(dateToCompare, currentDay);

            // UNCOMMENT THIS TO FIND THE CULPRIT:
            if (date.getDate() === 5) { // Check a specific day you know should be disabled
                console.log('Comparing:', dateToCompare.toISOString(), 'with', currentDay.toISOString(), 'Match:', match);
            }

            return match;
        });
    }, [excludedDates, date]);
    console.log('Disabled entry: ', disabledEntry);

    const isDisabled = !!disabledEntry;
    const tooltipMsg = disabledEntry instanceof Date ? undefined : disabledEntry?.message ? disabledEntry.message : undefined;

    console.log('tooltipMsg: ', tooltipMsg);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            // onClick();
        }
    };

    const getCustomDayClass = useCallback((date: Date) => {
        const isToday = isSameDay(date, today);
        const isSelectedStart = startDate && isSameDay(date, startDate);
        const isSelectedEnd = endDate && isSameDay(date, endDate);
        const isInsideRange = startDate && endDate && date > startDate && date < endDate;
        // const isInCurrentMonth = isWithinInterval(date, currentMonthInterval);


        return classNames("datePicker__day", {
            "datePicker__day_today": isToday,
            "datePicker__day_past": isPast(date) && !isToday,
            "datePicker__day_withRange": withRange,
            // "datePicker__day_outsideOfMonth": !isInCurrentMonth,
            "datePicker__day_selected": isSelectedStart || isSelectedEnd,
            "datePicker__day_insideSelectedRange": isInsideRange,
            "datePicker__day_disabled": isDisabled,
        });
    }, [startDate, endDate, withRange, today]);

    if (isDisabled && tooltipMsg) {
        return (
            <Tooltip text={tooltipMsg} position="bottom-center">
                <div className={getCustomDayClass(date)}>{day}</div>
            </Tooltip>)
    }

    return (
        <div className={getCustomDayClass(date)}>{day}</div>
    );
};

export default Day;