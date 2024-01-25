import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import copyToClipboard from './copyToClipboard';

import Logger from './logger';
import { dayjsWithPlugins } from '../wrappers';

export { Logger };
export * from './localization';
export guid from './guid';
export * from './dateValidation';
export * from './timeValidation';
export * from './checkTimeValidation';
export * from './dateFormatChecker';
export { default as debounce } from './debounce';
export { default as callAfterDelay } from './callAfterDelay';

/*
 * Use this function for informing about
 * props that are in conflict with each other.
 */
export const conflictPropsLog = (componentName, props, isWarning = false) => {
    const message = props.map((prop) => `'${prop}'`).join(' and ');
    const logFunction = isWarning ? Logger.warning : Logger.error;

    logFunction(`You can't specify ${message} props together for ${componentName} component.`);
};

/*
 * Function will check does provided keyboard key codes
 * match with the one that bubbled event.
 */
export const keyboardHandler = (e, keys) => keys.some((key) => key === e.which || key === e.keycode);

/*
 * PropTypes.instanceOf works only for class components
 */
export const childrenOf = (types) => {
    const type = PropTypes.shape({
        type: PropTypes.oneOf(types)
    });

    return PropTypes.oneOfType([type, PropTypes.arrayOf(type)]);
};

/*
 * One of specified props is required. Use for conditinal required props.
 */

export const oneIsRequired = (properties) => {
    const keys = Object.keys(properties);
    return keys.reduce((acc, item) => {
        acc[item] = (props, propName, componentName) => {
            if (keys.every((key) => !props.hasOwnProperty(key))) {
                return new Error(`${keys.join(' or ')} must be specified for ${componentName}`);
            }
            PropTypes.checkPropTypes(
                {
                    [propName]: properties[propName]
                },
                props,
                propName,
                componentName
            );
        };
        return acc;
    }, {});
};

/*
 * Function will check does provided object
 * equals or not
 */
export const compareObjects = (source, comparable) => {
    if (source === comparable) {
        return true;
    }
    if (typeof source === 'object' && typeof comparable === 'object') {
        if (Object.keys(source).length !== Object.keys(comparable).length) {
            return false;
        }

        for (const prop in source) {
            if (comparable.hasOwnProperty(prop)) {
                if (!compareObjects(source[prop], comparable[prop])) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
};

export const chunk = (array, size = 0) => {
    const length = array && array.length;
    if (!array || !length) return [];
    if (size < 1) return array;

    let i = 0;
    let j = 0;
    const result = [];

    while (i < length) {
        result[j++] = array.slice(i, (i += size));
    }

    return result;
};

/*
 * Display file size bytes
 */
export const fileSizeDisplay = (bytes) => {
    if (!bytes || bytes < 1) return '0 Byte';
    const sizes = ['Byte', 'KB', 'MB', 'GB', 'TR'];
    const powerOfTwo = Math.floor(Math.log2(bytes) / 10);
    const i = powerOfTwo > 4 ? 4 : powerOfTwo;

    return `${Math.floor(bytes / 2 ** (i * 10))} ${sizes[i]}`;
};

export const getImageDimensions = (image) =>
    new Promise((resolve, reject) => {
        if (window.Image && window.URL) {
            const img = new Image();
            img.src = window.URL.createObjectURL(image);

            img.onload = function () {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
                window.URL.revokeObjectURL(img.src);
            };

            img.onerror = (error) => {
                reject(error);
            };
        } else {
            reject();
        }
    });

export const interceptValue = (event, value) => ({
    ...event,
    target: {
        ...event.target,
        value
    }
});

export const stopEvent = (event, isPreventNeeded = false) => {
    event.stopPropagation();
    isPreventNeeded && event.preventDefault();
};

/*
 *  This part for date filter organism,
 * functions are checking is your past date in right range or no.
 */

export const getLMTD = (today, dayFromLastMonth) => {
    const dayOfMonth = today.date();
    const selectedDayOfMonth = dayFromLastMonth.startOf('month').date(dayOfMonth);
    return today.isSame(selectedDayOfMonth, 'month') ? dayFromLastMonth.endOf('month') : selectedDayOfMonth;
};

const isDateInRightRange = (rangeStart, rangeEnd, startDate, endDate) =>
    rangeStart.isSame(startDate, 'day') && rangeEnd.isSame(endDate, 'day');

export const isToday = (startDate, endDate) => {
    const today = dayjs();
    return isDateInRightRange(today, today, startDate, endDate);
};

export const isYesterday = (startDate, endDate) => {
    const yesterday = dayjs().subtract(1, 'day');
    return isDateInRightRange(yesterday, yesterday, startDate, endDate);
};

export const isThisWeek = (startDate, endDate) => {
    const startOfCurrentWeek = dayjs().startOf('week');
    const endOfCurrentWeek = dayjs().endOf('week');
    return isDateInRightRange(startOfCurrentWeek, endOfCurrentWeek, startDate, endDate);
};

export const isLastWeek = (startDate, endDate) => {
    const startOfLastWeek = dayjs().subtract(7, 'day').startOf('week');
    const endOfLastWeek = dayjs().subtract(7, 'day').endOf('week');
    return isDateInRightRange(startOfLastWeek, endOfLastWeek, startDate, endDate);
};

export const isThisMonth = (startDate, endDate) => {
    const startOfCurrentMonth = dayjs().startOf('month');
    const endOfCurrentMonth = dayjs().endOf('month');
    return isDateInRightRange(startOfCurrentMonth, endOfCurrentMonth, startDate, endDate);
};

export const isLastMonth = (startDate, endDate) => {
    const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month');
    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month');
    return isDateInRightRange(startOfLastMonth, endOfLastMonth, startDate, endDate);
};

export const isLastMonthToDate = (startDate, endDate) => {
    const today = dayjs();
    const startOfLastMonth = today.subtract(1, 'month').startOf('month');
    const sameDayFromLastMonth = getLMTD(today, startOfLastMonth);

    return isDateInRightRange(startOfLastMonth, sameDayFromLastMonth, startDate, endDate);
};

export const isValidDate = (date, format) => {
    const dateObj = dayjsWithPlugins(date, format);

    return !isNaN(dateObj.toDate()) && dateObj.isValid();
};

export const isRtl = () => document.body.style.direction === 'rtl';

export const emptyArray = [];

export const emptyObject = [];

export const noop = () => {};

export const getInitials = (name) =>
    name
        .match(/\b(\w)/g)
        .join('')
        .substr(0, 2)
        .toUpperCase();

export { dayjsWithPlugins, copyToClipboard };

export const toLowerCaseString = (str) => str?.toString().toLowerCase();
