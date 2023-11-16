import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const DateWeekPickerProp = (props) => <div></div>;

DateWeekPickerProp.propTypes = {
    /**
     * Fires event when user changes datepicker value
     * ([startDate: Date, endDate: Date]) => void
     */
    onChange: PropTypes.func,
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

export default DateWeekPickerProp;
