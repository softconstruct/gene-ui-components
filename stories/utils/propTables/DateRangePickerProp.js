import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { noop } from 'src';

const DateRangePickerProp = (props) => <div></div>;

DateRangePickerProp.propTypes = {
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
     *  RangeOption will render buttons with custom range options
     */
    rangeOptions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            start: PropTypes.instanceOf(dayjs),
            end: PropTypes.instanceOf(dayjs)
        })
    )
};

DateRangePickerProp.defaultProps = {
    withRangeOptions: false,
    withTime: false,
    todayText: 'Today',
    applyText: 'Apply',
    onChange: noop
};

export default DateRangePickerProp;
