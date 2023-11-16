import React, { forwardRef, useMemo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Calendar from './Calendar';

const DatePicker = forwardRef(
    (
        {
            defaultValue,
            onChange,
            className,
            todayText,
            defaultPreview,
            value,
            min,
            max,
            format,
            withTime,
            onTimeChange,
            markedDate,
            customOption,
            frozenDateRange,
            ...restProps
        },
        ref
    ) => {
        const date = useMemo(() => value && dayjs(value), [value]);

        return (
            <ul ref={ref} className={classnames(className, 'datepicker-holder')} {...restProps}>
                <Calendar
                    max={max}
                    min={min}
                    frozenDateRange={frozenDateRange}
                    defaultValue={defaultValue && dayjs(defaultValue)}
                    defaultPreview={defaultPreview && dayjs(defaultPreview)}
                    onChange={(date) => onChange(date.toDate())}
                    time={date}
                    value={date}
                    format={format}
                    withTime={withTime}
                    todayText={todayText}
                    onTimeChange={onTimeChange}
                    markedDate={markedDate}
                    customOption={customOption}
                />
            </ul>
        );
    }
);

DatePicker.propTypes = {
    /**
     * Initial datepicker value.
     */
    defaultValue: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Initial value for  datepicker preview
     */
    defaultPreview: PropTypes.oneOfType([
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
     * Fires event when user changes date[icker value
     * (date: Date) => void
     */
    onChange: PropTypes.func,
    /**
     * Additional classname which will apply to datepicker holder ul element
     */
    className: PropTypes.string,
    /**
     * Custom text for today button inside footer.
     * Default value is `Today`
     */
    todayText: PropTypes.string,
    /**
     * MarkedDate specifies the default mark date
     */
    markedDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * CustomOption is an object that is used to add a custom button to set a custom date.
     */
    customOption: PropTypes.shape({
        /**
         * Label of custom button
         */
        label: PropTypes.string,
        /**
         * Date of custom button
         */
        date: PropTypes.oneOfType([
            PropTypes.instanceOf(dayjs),
            PropTypes.instanceOf(Date),
            PropTypes.string,
            PropTypes.number
        ])
    })
};

export default DatePicker;
