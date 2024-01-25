import React, { useCallback, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { getBrowserDateFormat, checkTimeValidation } from 'utils';
import { dayjsWithPlugins } from 'wrappers';

// Components
import ExtendedInput from '../../ExtendedInput';

const nonLettersRegex = /[\W_]+/g;

const getFormatSeparator = (format) => format[format.search(nonLettersRegex)];

const isUpperCase = (str) => str === str.toUpperCase();

const isLowerCase = (str) => str === str.toLowerCase();

/*
 * Splitting time to { format, value } object
 * For checking is value fit format
 * Formats are taken from day.js date formats list
 * */
function splitTimeToObjects(dateParts, formatParts, meridiemValue, meridiemFormat) {
    const hourFormats = ['H', 'HH', 'h', 'hh'];
    const minuteFormats = ['m', 'mm'];
    const secondFormats = ['s', 'ss'];

    const hour = {};
    const minute = {};
    const second = {};
    const meridiem = {};

    formatParts.forEach((item, index) => {
        if (hourFormats.includes(item)) {
            hour.value = dateParts[index];
            hour.format = item;
        } else if (minuteFormats.includes(item)) {
            minute.value = dateParts[index];
            minute.format = item;
        } else if (secondFormats.includes(item)) {
            second.value = dateParts[index];
            second.format = item;
        }
    });

    if (meridiemFormat || meridiemValue) {
        meridiem.value = meridiemValue;
        meridiem.format = meridiemFormat;
    }

    return { hour, minute, second, meridiem };
}

const isHourInRightFormat = ({ value, format }) =>
    value &&
    ((format === 'H' && value.length <= 2 && Number(value[0]) !== 0) ||
        (format === 'h' && value.length <= 2 && Number(value[0]) !== 0) ||
        (format === 'HH' && value.length === 2) ||
        (format === 'hh' && value.length === 2));

const isMinuteInRightFormat = ({ value, format }) =>
    value &&
    ((format === 'm' && value.length <= 2 && (value.length !== 2 || Number(value[0]) !== 0)) ||
        (format === 'mm' && value.length === 2));

const isSecondInRightFormat = ({ value, format }) =>
    !format ||
    (value &&
        ((format === 's' && value.length <= 2 && (value.length !== 2 || Number(value[0]) !== 0)) ||
            (format === 'ss' && value.length === 2)));

const isMeridiemInRightFormat = ({ value, format }) =>
    !(format || value) || (value && ((format === 'A' && isUpperCase(value)) || (format === 'a' && isLowerCase(value))));

const checkTimeFormat = ({ hour, minute, second, meridiem }) =>
    isHourInRightFormat(hour) &&
    isMinuteInRightFormat(minute) &&
    isSecondInRightFormat(second) &&
    isMeridiemInRightFormat(meridiem);

function validateField(value = '', required, customValidation, min, max, format) {
    const date = dayjsWithPlugins(value, format);
    const separator = getFormatSeparator(format);

    const splittedDate = value.split(' ');
    const splittedFormat = format.split(' ');

    const dateParts = splittedDate[0].split(separator);
    const formatParts = splittedFormat[0].split(separator);

    const timeObject = splitTimeToObjects(dateParts, formatParts, splittedDate[1], splittedFormat[1]);

    const isValidFormat = checkTimeFormat(timeObject);
    const isValidDate = checkTimeValidation(timeObject);

    const isSameLength = dateParts.length === formatParts.length;

    const isBefore = !max || date.isBefore(dayjsWithPlugins(max, format));
    const isAfter = !min || date.isAfter(dayjsWithPlugins(min, format));

    return (
        (!customValidation || customValidation(value)) &&
        (!required || value.length) &&
        ((!required && !value.length) || (isValidDate && isSameLength && isValidFormat && isBefore && isAfter))
    );
}

const DateInput = forwardRef(
    ({ onChange, value, customValidation, required, getInitialState, min, max, format, ...restProps }, ref) => {
        const [isValid, setValidation] = useState(() =>
            validateField(value, required, customValidation, min, max, format)
        );

        const handleChange = useCallback(
            (e) => {
                const { value } = e.target;

                const isValid = validateField(value, required, customValidation, min, max, format);

                setValidation(isValid);
                onChange && onChange(e, isValid);
            },
            [onChange, required, customValidation, min, max, format]
        );

        useEffect(() => {
            getInitialState && getInitialState(isValid);
        }, [getInitialState, isValid]);

        useEffect(
            () => setValidation(validateField(value, required, customValidation, min, max, format)),
            [required, min, max, format, value, customValidation]
        );

        return <ExtendedInput ref={ref} value={value} isValid={isValid} onChange={handleChange} {...restProps} />;
    }
);

DateInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    getInitialState: PropTypes.func,
    customValidation: PropTypes.func,
    min: PropTypes.string,
    max: PropTypes.string,
    format: PropTypes.string
};

DateInput.defaultProps = {
    format: getBrowserDateFormat()
};

export default DateInput;
