import { dayjsWithPlugins } from 'wrappers';
import { checkTimeValidation } from './checkTimeValidation';

const nonLettersRegex = /[\W_]+/g;

const hourFormats = ['H', 'HH', 'h', 'hh'];
const minuteFormats = ['m', 'mm'];
const secondFormats = ['s', 'ss'];

const getFormatSeparator = (format) => format[format.search(nonLettersRegex)];

/*
 * Splitting time to { format, value } object
 * For checking is value fit format
 * Formats are taken from day.js date formats list
 * */
function splitTimeToObjects(dateParts, formatParts) {
    const hour = {};
    const minute = {};
    const second = {};

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

    return { hour, minute, second };
}

const isHourInRightFormat = ({ value, format }) =>
    value &&
    (((format === 'H' || format === 'h') && value.length <= 2 && Number(value[0]) !== 0) ||
        ((format === 'HH' || format === 'hh') && value.length === 2));

const isMinuteInRightFormat = ({ value, format }) =>
    value &&
    ((format === 'm' && value.length <= 2 && (value.length !== 2 || Number(value[0]) !== 0)) ||
        (format === 'mm' && value.length === 2));

const isSecondInRightFormat = ({ value, format }) =>
    !format ||
    (value &&
        ((format === 's' && value.length <= 2 && (value.length !== 2 || Number(value[0]) !== 0)) ||
            (format === 'ss' && value.length === 2)));

const checkTimeFormat = ({ hour, minute, second }) =>
    isHourInRightFormat(hour) && isMinuteInRightFormat(minute) && isSecondInRightFormat(second);

export function validateTimeField(value, required, isValid, min, max, format) {
    const time = value ? dayjsWithPlugins(value).format(format).split(' ')[1] : '';
    const timeFormat = format ? format.split(' ')[1] : '';

    const date = dayjsWithPlugins(value);
    const separator = getFormatSeparator(timeFormat);

    const dateParts = time.split(separator);
    const formatParts = timeFormat.split(separator);

    const timeObject = splitTimeToObjects(dateParts, formatParts);

    const isValidFormat = checkTimeFormat(timeObject);
    const isValidDate = checkTimeValidation(timeObject);

    const isBefore = !max || date.isBefore(dayjsWithPlugins(max, format));
    const isAfter = !min || date.isAfter(dayjsWithPlugins(min, format));

    if (!time.length) {
        return required ? { key: 'required', isValid: false } : { key: null, isValid: true };
    }

    if (!isValidFormat) return { key: 'isValidFormat', isValid: false };
    if (!isValidDate) return { key: 'isValidDate', isValid: false };
    if (!isBefore) return { key: 'isBefore', isValid: false };
    if (!isAfter) return { key: 'isAfter', isValid: false };
    if (!isValid) return { key: 'customValidation', isValid: false };

    return { key: null, isValid: true };
}

export function validateTimePickerField(required, isValid, min, max, format, value = '') {
    if (typeof value === 'string') {
        return validateTimeField(value, required, isValid, min, max, format);
    }
    const [start, end] = value;
    const startDateValidation = validateTimeField(start || '', required, isValid, min, max, format);
    const endDateValidation = validateTimeField(end || '', required, isValid, min, max, format);

    const isRangeInvalid = dayjsWithPlugins(start, format).isAfter(dayjsWithPlugins(end, format));

    if (!startDateValidation.isValid) return startDateValidation;
    if (!endDateValidation.isValid) return endDateValidation;
    if (isRangeInvalid) return { key: 'isValidRange', isValid: false };

    return { key: null, isValid: true };
}
