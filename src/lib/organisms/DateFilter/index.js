import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
    getBrowserDateFormat,
    isToday,
    isYesterday,
    isThisWeek,
    isLastWeek,
    isThisMonth,
    isLastMonth,
    isLastMonthToDate,
    getLMTD,
    noop
} from 'utils';
import { dayjsWithPlugins } from 'wrappers';

import DatePickerInput from '../../molecules/DatePickerInput';
import Button from '../../atoms/Button';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function getFilterByKey(key, date) {
    const [start, end] = date;
    const startDate = start ? dayjsWithPlugins(start) : null;
    const endDate = end ? dayjsWithPlugins(end) : null;

    const today = dayjsWithPlugins();
    const dayFromLastWeek = today.subtract(7, 'day');
    const dayFromLastMonth = today.subtract(1, 'month');

    if (key === 'today')
        return {
            selected: startDate && isToday(startDate, endDate || startDate),
            value: [today, today]
        };
    if (key === 'yesterday')
        return {
            selected: startDate && isYesterday(startDate, endDate || startDate),
            value: [today.subtract(1, 'day'), today.subtract(1, 'day')]
        };
    if (key === 'thisWeek')
        return {
            selected: startDate && isThisWeek(startDate, endDate),
            value: [today.startOf('week'), today.endOf('week')]
        };
    if (key === 'lastWeek')
        return {
            selected: startDate && isLastWeek(startDate, endDate),
            value: [dayFromLastWeek.startOf('week'), dayFromLastWeek.endOf('week')]
        };
    if (key === 'thisMonth')
        return {
            selected: startDate && isThisMonth(startDate, endDate),
            value: [today.startOf('month'), today.endOf('month')]
        };
    if (key === 'lastMonth')
        return {
            selected: startDate && isLastMonth(startDate, endDate),
            value: [dayFromLastMonth.startOf('month'), dayFromLastMonth.endOf('month')]
        };
    if (key === 'LMTD')
        return {
            selected: startDate && isLastMonthToDate(startDate, endDate),
            value: [dayFromLastMonth.startOf('month'), getLMTD(today, dayFromLastMonth)]
        };
}

const getRightDate = (date, isControlled) => (isControlled && date ? dayjsWithPlugins(date).toDate() : null);

function DateFilter(props) {
    const { value, onChange, format, filters, className, buttonProps, pickerProps, ...restProps } = props;

    const isControlled = 'value' in props;

    const [localValue, setLocalValue] = useState(() => {
        const [start, end] = value;
        const startDate = getRightDate(start, isControlled);
        const endDate = getRightDate(end, isControlled);

        return [startDate, endDate];
    });

    const handleChange = useCallback(
        (dates) => {
            setLocalValue(dates);
            onChange(dates);
        },
        [onChange]
    );

    const handleButtonClick = useCallback(
        ([start, end]) => {
            const dateObj = [start.toDate(), end.toDate()];

            setLocalValue(dateObj);
            onChange(dateObj);
        },
        [onChange]
    );

    return (
        <div className={classnames('date-filters-holder', className)} {...restProps}>
            {Object.keys(filters).map((key) => {
                const label = filters[key];
                const filter = getFilterByKey(key, localValue, format);

                return filter ? (
                    <Button
                        key={key}
                        onClick={() => handleButtonClick(filter.value)}
                        color="default"
                        active={filter.selected}
                        appearance="minimal"
                        {...buttonProps}
                    >
                        {label}
                    </Button>
                ) : null;
            })}
            <DatePickerInput.WithRange
                value={localValue}
                format={format}
                onChange={handleChange}
                appearance="minimal"
                flexibility="content-size"
                className="date-filter-input active"
                {...pickerProps}
            />
        </div>
    );
}

DateFilter.propTypes = {
    /**
     * Specify the format of date
     */
    format: PropTypes.string,
    /**
     * Fires when user attempts to change value
     * (dates: Array) => void
     */
    onChange: PropTypes.func,
    /**
     * Controls which filter buttons will be displayed based on filters object existing keys.
     * For example if you define only `today` property on filters objects
     * It will be display button with [today]'s property value
     * Which will change Datefilter value to today.
     * All filters will be displayed by default.
     */
    filters: PropTypes.exact({
        today: PropTypes.string,
        yesterday: PropTypes.string,
        thisWeek: PropTypes.string,
        lastWeek: PropTypes.string,
        thisMonth: PropTypes.string,
        lastMonth: PropTypes.string,
        LMTD: PropTypes.string
    }),
    /**
     * Current value. Creates a controlled component.
     */
    value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(dayjsWithPlugins)),
        PropTypes.arrayOf(PropTypes.instanceOf(Date)),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number)
    ]),
    /**
     * Additional classname which applies to datefilter holder div element
     */
    className: PropTypes.string,
    /**
     * Accepts same props as button component (atoms)
     */
    buttonProps: PropTypes.object,
    /**
     * This props will pass to picker, check DatePicker prop types
     */
    pickerProps: PropTypes.object
};

DateFilter.defaultProps = {
    value: [],
    format: getBrowserDateFormat(),
    onChange: noop,
    filters: {
        today: 'Today',
        yesterday: 'Yesterday',
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        thisMonth: 'This Month',
        lastMonth: 'Last Month',
        LMTD: 'LMTD'
    }
};

export default DateFilter;
