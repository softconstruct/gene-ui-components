import React, { useState, useCallback, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';

// Helpers
import { noop } from 'utils';
import { dayjsWithPlugins } from 'wrappers';

// Components
import Button from '../../atoms/Button';

// Local components
import Calendar from './Calendar';
import { useDatePickerContext } from './Context';
import { RangeOptions } from './RangeOptions';

const RangePicker = forwardRef(
    (
        {
            onChange,
            onApply,
            rangeStartDefault,
            rangeEndDefault,
            withRangeOptions,
            withTime,
            defaultTimeValues,
            className,
            todayText,
            applyText,
            customText,
            rangeOptions,
            max,
            min,
            value,
            withApply,
            markedDate,
            frozenDateRange,
            ...restProps
        },
        ref
    ) => {
        const [contextConfigs] = useDatePickerContext();
        const [hovered, setHovered] = useState();
        const [rangeStart, setRangeStart] = useState(() => rangeStartDefault && dayjs(rangeStartDefault));
        const [rangeEnd, setRangeEnd] = useState(() => rangeEndDefault && dayjs(rangeEndDefault));

        const [firstPreview, setFirstPreview] = useState(() => rangeStart || dayjs());
        const [secondPreview, setSecondPreview] = useState(() =>
            rangeEnd ? (rangeEnd.isSame(rangeStart, 'M') ? rangeEnd.add(1, 'M') : rangeEnd) : dayjs().add(1, 'M')
        );

        const setPreviews = useCallback((start, end) => {
            setFirstPreview(start);
            setSecondPreview(start.isSame(end, 'M') ? end.add(1, 'M') : end);
        }, []);

        const handleRangeChange = useCallback(
            ([startDate, endDate]) => {
                const start = withTime ? startDate : startDate && startDate.startOf('d');
                const end = withTime ? endDate : endDate && endDate.endOf('d');

                setRangeStart(start);
                setRangeEnd(end);
                start && end && setPreviews(start, end);
                onChange([start, end]);
            },
            [onChange, setPreviews, withTime]
        );

        const handleToday = useCallback(() => {
            const today = dayjs();
            handleRangeChange([today.startOf('d'), today.endOf('d')]);
        }, [handleRangeChange]);

        const handleApply = useCallback(() => {
            const diff = dayjsWithPlugins(rangeStart).diff(rangeEnd, 's');
            const endDate = diff > 0 ? rangeEnd.add(diff, 's') : rangeEnd;
            onApply && onApply([rangeStart.toDate(), endDate.toDate()]);
        }, [onApply, rangeStart, rangeEnd]);

        const handleFirstPreviewChange = useCallback(
            (preview) => {
                setFirstPreview(preview);

                if (!rangeEnd) {
                    // We must check this after, maybe this will mote cover all cases.
                    setSecondPreview(rangeStart && rangeStart.isAfter(preview) ? rangeStart : preview.add(1, 'M'));
                }
            },
            [rangeStart, rangeEnd]
        );

        const handleSecondPreviewChange = useCallback(
            (preview) => {
                setSecondPreview(preview);
                if (!rangeEnd) {
                    setFirstPreview(rangeStart || preview.subtract(1, 'M'));
                }
            },
            [rangeStart, rangeEnd]
        );

        useEffect(() => {
            const startDate = dayjsWithPlugins((value && value[0]) || null);
            const endDate = dayjsWithPlugins((value && value[1]) || null);

            if (startDate.isValid() && endDate.isValid()) {
                setRangeStart(startDate);
                setRangeEnd(endDate);

                setFirstPreview(startDate);

                setSecondPreview(endDate.isSame(startDate, 'M') ? endDate.add(1, 'M') : endDate);
            }
        }, [value]);

        return (
            <ul
                className={classnames('datepicker-holder', 'range-mode', {
                    'simple-range-mode': !withRangeOptions
                })}
                ref={ref}
                {...restProps}
            >
                <Calendar
                    onRangeChange={handleRangeChange}
                    defaultTimeValues={defaultTimeValues}
                    className="date-box-1"
                    rangePicker
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    hovered={hovered}
                    onHover={rangeStart ? setHovered : null}
                    onPreviewChange={handleFirstPreviewChange}
                    preview={firstPreview}
                    maxPreview={secondPreview}
                    withTime={withTime}
                    time={rangeStart || dayjs().startOf('d')}
                    onTimeChange={(start) => handleRangeChange([start, rangeEnd])}
                    max={max}
                    min={min}
                    value={value && value[0]}
                    markedDate={markedDate}
                    frozenDateRange={frozenDateRange}
                />
                <Calendar
                    onRangeChange={handleRangeChange}
                    defaultTimeValues={defaultTimeValues}
                    className="date-box-2"
                    rangePicker
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    hovered={hovered}
                    onHover={rangeStart ? setHovered : null}
                    preview={secondPreview}
                    onPreviewChange={handleSecondPreviewChange}
                    minPreview={firstPreview}
                    withTime={withTime}
                    time={rangeEnd || dayjs().startOf('d')}
                    onTimeChange={(end) => handleRangeChange([rangeStart, end])}
                    max={max}
                    min={min}
                    value={value && value[1]}
                    markedDate={markedDate}
                    frozenDateRange={frozenDateRange}
                />
                <li
                    className={classnames('date-actions', {
                        vertical: withRangeOptions,
                        horizontal: !withRangeOptions
                    })}
                >
                    <ul>
                        <li>
                            {!withRangeOptions && (
                                <Button
                                    color="default"
                                    appearance="minimal"
                                    flexibility="default"
                                    onClick={handleToday}
                                >
                                    {todayText || contextConfigs.buttons.today}
                                </Button>
                            )}
                            {withRangeOptions && (
                                <RangeOptions
                                    rangeStart={rangeStart}
                                    defaultTimeValues={defaultTimeValues}
                                    rangeEnd={rangeEnd}
                                    onClick={handleRangeChange}
                                    customText={customText}
                                    customOptions={rangeOptions}
                                />
                            )}
                        </li>
                        <li>
                            {withApply && (
                                <Button
                                    disabled={
                                        !rangeStart ||
                                        !rangeEnd ||
                                        (value && rangeStart.isSame(value[0]) && rangeEnd.isSame(value[1]))
                                    }
                                    appearance="outline"
                                    flexibility={withRangeOptions ? 'full-width' : 'default'}
                                    onClick={handleApply}
                                >
                                    {applyText || contextConfigs.buttons.apply}
                                </Button>
                            )}
                        </li>
                    </ul>
                </li>
            </ul>
        );
    }
);

RangePicker.propTypes = {
    /**
     * Fires event when user changes date range picker value.
     * ([startDate: Date, EndDate: Date]) => void
     */
    onChange: PropTypes.func,
    /**
     * Fires event when user clicks on apply button
     * ([startDate:Date, endDate: Date]) => void
     */
    onApply: PropTypes.func,
    /**
     * Initial start date value
     */
    rangeStartDefault: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Initial end date value
     */
    rangeEndDefault: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Max specifies the maximum value allowed for datepicker
     */
    max: PropTypes.instanceOf(dayjs),
    /**
     * Min specifies the minimum value allowed for datepicker
     */
    min: PropTypes.instanceOf(dayjs),
    /**
     * Removes Today button from left bottom corner, and
     * Displays buttons in the bottom of the calendar
     */
    withRangeOptions: PropTypes.bool,
    withTime: PropTypes.bool,
    /**
     * Additional className which will apply
     * To date range picker wrapper ul element
     */
    className: PropTypes.string,
    /**
     * Custom today button text
     */
    todayText: PropTypes.string,
    /**
     * Custom apply button text
     */
    applyText: PropTypes.string,
    /**
     * Custom text for range options
     */
    customText: PropTypes.string,
    /**
     * Setting default time value when date range changed
     */
    defaultTimeValues: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))),
    /**
     *  RangeOption will render buttons with custom range options
     */
    rangeOptions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            start: PropTypes.instanceOf(dayjs),
            end: PropTypes.instanceOf(dayjs)
        })
    ),
    /**
     * Ability to show/hide the apply button
     * default: true
     */
    withApply: PropTypes.bool,
    /**
     * MarkedDate specifies the default mark date
     */
    markedDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ])
};

RangePicker.defaultProps = {
    withRangeOptions: false,
    withTime: false,
    withApply: true,
    defaultTimeValues: [
        ['00', '00', '00'],
        ['23', '59', '59']
    ],
    onChange: noop
};

export default RangePicker;
