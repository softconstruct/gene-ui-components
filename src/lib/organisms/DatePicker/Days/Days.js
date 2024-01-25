import React, { useMemo, useCallback } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Helpers
import { chunk, guid } from 'utils';
import { getRange, getCalendarDays, nextMonthAvailable, prevMonthAvailable } from '../utils';

// Local components
import { useDatePickerContext } from '../Context';
import Day from './Day';

dayjs.extend(isBetween);
dayjs.Ls.en.weekStart = 1;

function Days({
    preview,
    selected,
    rangePicker,
    weekPicker,
    rangeStart,
    rangeEnd,
    onRangeChange,
    onChange,
    onPreviewChange,
    hovered,
    onHover,
    maxPreview,
    minPreview,
    max,
    min,
    frozenDateRange,
    markedDate
}) {
    const [contextConfigs] = useDatePickerContext();

    const days = useMemo(() => chunk(getCalendarDays(preview.startOf('M')), 7), [preview]);

    const handleRangeClick = useCallback(
        (day) => {
            const range = getRange(rangeStart, rangeEnd, day);
            onRangeChange && onRangeChange(range);
        },
        [rangeStart, rangeEnd, onRangeChange]
    );

    const handleWeekClick = useCallback(
        (day) => {
            const start = day.startOf('w');
            const end = day.endOf('w');
            onRangeChange && onRangeChange([start, end]);
        },
        [onRangeChange]
    );

    const handleDiffMonthClick = useCallback(
        (day) => {
            if (day.isBefore(preview) && !prevMonthAvailable(preview, minPreview)) return;
            if (day.isAfter(preview) && !nextMonthAvailable(preview, maxPreview)) return;
            onPreviewChange && onPreviewChange(day);
        },
        [preview, minPreview, maxPreview, onPreviewChange]
    );

    const handleClick = useCallback(
        (day) => {
            if (!day.isSame(preview, 'M')) {
                handleDiffMonthClick(day);
                // return; // TODO ::: check if this correct
            }

            rangePicker && handleRangeClick(day);
            weekPicker && handleWeekClick(day);
            !rangePicker && !weekPicker && onChange && onChange(day);
        },
        [handleRangeClick, handleWeekClick, handleDiffMonthClick, preview, rangePicker, weekPicker, onChange]
    );

    const checkDayFrozenState = useCallback(
        (item) => {
            const format = 'YYYY/MM/DD';
            const formattedItem = dayjs(item.format(format));

            return (
                Array.isArray(frozenDateRange) &&
                frozenDateRange.length &&
                !!frozenDateRange.find(
                    ({ from, to }) =>
                        from &&
                        to &&
                        formattedItem.isBetween(dayjs(from).format(format), dayjs(to).format(format), 'day', '[]')
                )
            );
        },
        [frozenDateRange]
    );

    const checkDayDisabledState = useCallback(
        (item) => !item.isSame(preview, 'M') || (min && item.endOf('day').isBefore(min)) || (max && item.isAfter(max)),
        [min, max, preview]
    );

    const checkDayHideState = useCallback((item) => !item.isSame(preview, 'M'), [preview]);

    const isHovered = useCallback(
        (item) => hovered && hovered.isSame(item) && !dayjs(hovered).isBetween(rangeStart, rangeEnd),
        [hovered, rangeStart, rangeEnd]
    );

    const isSelected = useCallback(
        (item) =>
            rangePicker || weekPicker
                ? item.isSame(rangeStart, 'd') || item.isSame(rangeEnd, 'd')
                : (selected && selected.isSame(item, 'd')) || false,
        [rangePicker, weekPicker, rangeStart, rangeEnd, selected]
    );

    const isRanged = useCallback(
        (item) =>
            Boolean(
                (rangePicker || weekPicker) &&
                    rangeStart &&
                    dayjs(item).isBetween(rangeStart, rangeEnd || hovered, 'd', '[]')
            ),
        [rangePicker, weekPicker, rangeStart, rangeEnd, hovered]
    );

    return (
        <div className="calendar-days">
            <ul>
                {contextConfigs.weekdays &&
                    contextConfigs.weekdays.map((item, i) => (
                        <li key={i} className="heading">
                            <span>{item.slice(0, contextConfigs.weekdaysSlice)}</span>
                        </li>
                    ))}
            </ul>
            {days.map((items) => (
                <ul key={guid()} className={classnames({ 'hover-row': weekPicker })}>
                    {items.map((item) => (
                        <Day
                            isCurrent={!checkDayDisabledState(item) && item.isSame(markedDate || dayjs(), 'd')}
                            rangeStart={rangePicker && rangeStart && item.isSame(rangeStart, 'd')}
                            disabled={checkDayDisabledState(item) || checkDayFrozenState(item)}
                            rangeEnd={rangePicker && rangeEnd && item.isSame(rangeEnd, 'd')}
                            isHoveredBefore={!!(rangeStart && rangeStart.isAfter(hovered))}
                            hide={checkDayHideState(item)}
                            isSelected={isSelected(item)}
                            isHovered={isHovered(item)}
                            isRanged={isRanged(item)}
                            startDate={rangeStart}
                            onClick={handleClick}
                            endDate={rangeEnd}
                            onHover={onHover}
                            value={item}
                            key={guid()}
                            max={max}
                            min={min}
                        />
                    ))}
                </ul>
            ))}
        </div>
    );
}

Days.defaultProps = {
    preview: dayjs().startOf('M'),
    rangeStart: null,
    rangeEnd: null
};

export default Days;
