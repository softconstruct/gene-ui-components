import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Helpers
import { noop } from 'utils';

// Local components
import Calendar from './Calendar';

function WeekPicker({
    onChange,
    rangeStartDefault,
    rangeEndDefault,
    className,
    thisWeekText,
    defaultTimeValues,
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
                weekPicker
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeChange={handleRangeChange}
                thisWeekText={thisWeekText}
                defaultTimeValues={defaultTimeValues}
            />
        </ul>
    );
}

WeekPicker.propTypes = {
    /**
     * Fires event when user changes datepicker value
     * ([startDate: Date, endDate: Date]) => void
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
     * Additional classname which will apply to datepicker holder ul element
     */
    className: PropTypes.string,
    /**
     * Custom text for this week button inside footer.
     * Default value is `This Week`
     */
    thisWeekText: PropTypes.string
};

WeekPicker.defaultProps = {
    defaultTimeValues: [
        ['00', '00', '00'],
        ['23', '59', '59']
    ],
    onChange: noop
};

export default WeekPicker;
