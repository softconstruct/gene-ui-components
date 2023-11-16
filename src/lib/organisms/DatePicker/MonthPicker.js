import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { noop } from 'utils';

import Calendar from './Calendar';

function MonthPicker({
    onChange,
    rangeStartDefault,
    rangeEndDefault,
    className,
    thisMonthText,
    defaultTimeValues,
    max,
    min,
    ...restProps
}) {
    const [rangeStart, setRangeStart] = useState(rangeStartDefault && dayjs(rangeStartDefault));
    const [rangeEnd, setRangeEnd] = useState(rangeEndDefault && dayjs(rangeEndDefault));

    const handleRangeChange = useCallback(
        ([start, end]) => {
            setRangeStart(start);
            setRangeEnd(end);
            onChange && onChange([start.toDate(), end.toDate()]);
        },
        [onChange]
    );

    return (
        <ul className={classnames(className, 'datepicker-holder')} {...restProps}>
            <Calendar
                max={max}
                min={min}
                monthPicker
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeChange={handleRangeChange}
                thisMonthText={thisMonthText}
                defaultTimeValues={defaultTimeValues}
            />
        </ul>
    );
}

MonthPicker.propTypes = {
    /**
     * Fires event when user changes datepicker value
     * ([startDate: date endDate: date]) => void
     */
    onChange: PropTypes.func,
    /**
     * Setting default time value when date range changed
     */
    defaultTimeValues: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))),
    /**
     * Initial value for start date
     */
    rangeStartDefault: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Initial value for end date
     */
    rangeEndDefault: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Max specifies the maximum value allowed for monthPicker
     */
    max: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Min specifies the minimum value allowed for monthPicker
     */
    min: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * Additional classname which will apply to datepicker holder ul element
     */
    className: PropTypes.string,
    /**
     * Custom text for this month button inside footer.
     * Default value is `This Month`
     */
    thisMonthText: PropTypes.string
};

MonthPicker.defaultProps = {
    defaultTimeValues: [
        ['00', '00', '00'],
        ['23', '59', '59']
    ],
    onChange: noop
};

export default MonthPicker;
