import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getBrowserTimeFormat } from 'utils';
import { dayjsWithPlugins } from 'wrappers';
import dayjs from 'dayjs';

import Icon from '../Icon';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Time({ format, showIcon, startDate, showSeconds, ...restProps }) {
    const startDateValue = useMemo(() => startDate && dayjs(startDate), [startDate]);

    const difference = useMemo(() => (startDateValue ? startDateValue.diff(dayjs()) : 0), [startDateValue]);

    const [time, setTime] = useState(() => Date.now() + difference);

    const timeFormat = format || getBrowserTimeFormat(showSeconds);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(Date.now() + difference);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [difference]);

    return (
        <div className="time-holder" {...restProps}>
            {showIcon && <Icon type="bc-icon-clock" />}
            <p>{dayjsWithPlugins(time).format(timeFormat)}</p>
        </div>
    );
}

Time.propTypes = {
    /**
     * Displays a clock icon when set to "true"
     */
    showIcon: PropTypes.bool,
    /**
     * Display format
     */
    format: PropTypes.string,
    /**
     * Display seconds when set to "true"
     */
    showSeconds: PropTypes.bool,
    /**
     * Specifing this prop will make the Time atom a counter starting from "startDate"
     */
    startDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ])
};

Time.defaultProps = {
    showIcon: false,
    showSeconds: true
};

export default Time;
