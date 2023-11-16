import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const DateMonthPickerProp = (props) => <div></div>;

DateMonthPickerProp.name = 'DateMonthPicker';

DateMonthPickerProp.propTypes = {
    /**
     * Fires event when user changes datepicker value
     * ([startDate: date endDate: date]) => void
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
     * Custom text for this month button inside footer.
     * Default value is `This Month`
     */
    thisMonthText: PropTypes.string
};

export default DateMonthPickerProp;
