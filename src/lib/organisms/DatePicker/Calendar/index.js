import React, { useState, useCallback, forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

// Helpers
import { dayjsWithPlugins } from 'wrappers';
import { addTime } from '../utils';

// Local components
import Body from './Body';
import Header from './Header';
import Footer from './Footer';
import { useDatePickerContext } from '../Context';
import TimeInput from '../TimeInput';

const Calendar = forwardRef((props, ref) => {
    const {
        onChange,
        defaultValue,
        weekPicker,
        monthPicker,
        className,
        rangePicker,
        defaultPreview,
        rangeStart,
        rangeEnd,
        onRangeChange,
        defaultTimeValues,
        hovered,
        onHover,
        onPreviewChange,
        maxPreview,
        minPreview,
        max,
        min,
        withTime,
        time,
        onTimeChange,
        todayText,
        thisWeekText,
        thisMonthText,
        value,
        markedDate,
        customOption,
        frozenDateRange
    } = props;
    const [contextConfigs] = useDatePickerContext();

    const defaultView = monthPicker ? 'months' : 'days';

    const [view, setView] = useState(defaultView);
    const [isThisDateAllowed, setIsThisDateAllowed] = useState(true);
    const [previewState, setPreviewState] = useState(() => defaultPreview || dayjs());
    const [selected, setSelected] = useState(defaultValue);

    const isControlled = 'preview' in props;
    const preview = isControlled ? props.preview : previewState;

    const handleSelect = useCallback(
        (value) => {
            setSelected(value);
            onChange && onChange(value);
        },
        [onChange]
    );

    const handlePreviewChange = useCallback(
        (preview) => {
            !isControlled && setPreviewState(preview);
            onPreviewChange && onPreviewChange(preview);
        },
        [onPreviewChange, isControlled]
    );

    const handleRangeChange = useCallback(
        ([start, end]) => {
            const formattedStart = start ? addTime(start.startOf('d'), defaultTimeValues[0]) : start;
            const formattedEnd = end ? addTime(end.startOf('d'), defaultTimeValues[1]) : end;

            onRangeChange([formattedStart, formattedEnd]);
        },
        [withTime, defaultTimeValues, onRangeChange]
    );

    useEffect(() => {
        const date = dayjsWithPlugins(value);

        if (date.isValid()) {
            setSelected(date);
            setPreviewState(date);
        }
    }, [value]);

    useEffect(() => {
        if (min && !max) {
            setIsThisDateAllowed(dayjs(min).isSameOrBefore(dayjs(new Date()), 'date'));
        } else if (!min && max) {
            setIsThisDateAllowed(dayjs(max).isSameOrAfter(dayjs(new Date()), 'date'));
        } else if (min && max) {
            setIsThisDateAllowed(
                dayjs(min).isSameOrBefore(dayjs(new Date()), 'date') &&
                    dayjs(max).isSameOrAfter(dayjs(new Date()), 'date')
            );
        }
    }, [max, min]);

    return (
        <>
            <li className={classnames('date-box', className)} ref={ref}>
                <Header
                    rangePicker={rangePicker}
                    view={view}
                    onViewChange={setView}
                    preview={preview}
                    onPreviewChange={handlePreviewChange}
                    monthPicker={monthPicker}
                    maxPreview={maxPreview}
                    minPreview={minPreview}
                    months={contextConfigs.months}
                />
                <Body
                    view={view}
                    rangePicker={rangePicker}
                    onViewChange={setView}
                    preview={preview}
                    onPreviewChange={handlePreviewChange}
                    selected={selected}
                    onChange={handleSelect}
                    weekPicker={weekPicker}
                    monthPicker={monthPicker}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    onRangeChange={handleRangeChange}
                    hovered={hovered}
                    onHover={onHover}
                    maxPreview={maxPreview}
                    minPreview={minPreview}
                    max={max}
                    min={min}
                    markedDate={markedDate}
                    frozenDateRange={frozenDateRange}
                />
                {withTime && time && <TimeInput value={time} onChange={onTimeChange} />}
            </li>
            <Footer
                onSelect={handleSelect}
                onPreviewChange={handlePreviewChange}
                weekPicker={weekPicker}
                monthPicker={monthPicker}
                onRangeChange={handleRangeChange}
                rangePicker={rangePicker}
                todayText={todayText || contextConfigs.buttons.today}
                thisWeekText={thisWeekText || contextConfigs.buttons.thisWeek}
                thisMonthText={thisMonthText || contextConfigs.buttons.thisMonth}
                customOption={customOption}
                isThisDateAllowed={isThisDateAllowed}
            />
        </>
    );
});

export default Calendar;
