import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const DatePickerProp = (props) => <div></div>;

DatePickerProp.propTypes = {
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
    todayText: PropTypes.string
};

export default DatePickerProp;
