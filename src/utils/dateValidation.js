import { dayjsWithPlugins } from 'wrappers';

const lettersRegex = /[a-zA-Z]/;
const nonLettersRegex = /[\W_]+/g;

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const longMonthNames = dayjsWithPlugins.Ls.en.months;
const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const yearFormats = ['YY', 'YYYY'];
const monthFormats = ['M', 'MM', 'MMM', 'MMMM'];
const dayFormats = ['D', 'DD'];

const getFormatSeparator = (format) => format[format.search(nonLettersRegex)];

function capitalizeFirstLetter(value) {
    const lowerCaseValue = value.toLowerCase();
    const match = lowerCaseValue.match(lettersRegex);

    return match ? lowerCaseValue.replace(match[0], match[0].toUpperCase()) : lowerCaseValue;
}

/*
 * Splitting date to { format, value } object
 * For checking is value fit format
 * Formats are taken from day.js date formats list
 * */
function splitDateToObjects(dateParts, formatParts) {
    const day = {};
    const month = {};
    const year = {};

    formatParts.forEach((item, index) => {
        if (dayFormats.includes(item)) {
            day.value = dateParts[index];
            day.format = item;
        } else if (monthFormats.includes(item)) {
            month.value = dateParts[index];
            month.format = item;
        } else if (yearFormats.includes(item)) {
            year.value = dateParts[index];
            year.format = item;
        }
    });
    return { day, month, year };
}

function checkDateValidation({ day, month, year }) {
    if (isNaN(Number(year.value))) {
        return false;
    }

    if (dayjsWithPlugins(year.value).isLeapYear()) {
        monthLengths[1] = 29;
    }

    const currentMonth = !isNaN(Number(month.value))
        ? month.value - 1
        : month.format === 'MMM'
        ? shortMonthNames.indexOf(month.value)
        : longMonthNames.indexOf(month.value);

    return day.value > 0 && day.value <= monthLengths[currentMonth];
}

export function validateDateField(value = '', required, isValid, min, max, format) {
    // Need to capitalize first letter of month,
    // because day.js want month name with that format
    const dateString = typeof value === 'string' ? value : dayjsWithPlugins(value).format(format);
    const capitalizedValue = capitalizeFirstLetter(dateString);

    const date = dayjsWithPlugins(capitalizedValue, format);

    const dateWithoutTime = capitalizedValue.split(' ')[0];
    const dateFormat = format.split(' ')[0];

    const separator = getFormatSeparator(dateFormat);

    const dateParts = dateWithoutTime.split(separator);
    const formatParts = dateFormat.split(separator);

    const dateObject = splitDateToObjects(dateParts, formatParts);

    const isInvalidFormat = !dayjsWithPlugins(dateWithoutTime, dateFormat).isValid();
    const isInvalidDate = !checkDateValidation(dateObject);

    const isBefore = !max || date.isBefore(dayjsWithPlugins(capitalizeFirstLetter(max), format));
    const isAfter = !min || date.isAfter(dayjsWithPlugins(capitalizeFirstLetter(min), format));

    // TODO ::: fix for null case
    // should be valid if value=null and required=false
    if (!capitalizedValue.length) {
        return required ? { key: 'required', isValid: false } : { key: null, isValid: true };
    }
    if (isInvalidFormat) return { key: 'isValidFormat', isValid: false };
    if (isInvalidDate) return { key: 'isValidDate', isValid: false };
    if (!isBefore) return { key: 'isBefore', isValid: false };
    if (!isAfter) return { key: 'isAfter', isValid: false };
    if (!isValid) return { key: 'customValidation', isValid: false };

    return { key: null, isValid: true };
}

// TODO ::: rename 'receivedValue' and fix
export function validateDatePickerField(receivedValue, required, isValid, min, max, format) {
    const value = receivedValue || '';

    if (!Array.isArray(value)) {
        return validateDateField(value, required, isValid, min, max, format);
    }
    const [start, end] = value;
    const startDateValidation = validateDateField(start || '', required, isValid, min, max, format);
    const endDateValidation = validateDateField(end || '', required, isValid, min, max, format);

    const startFormatted = dayjsWithPlugins(start);

    const isRangeInvalid = dayjsWithPlugins(startFormatted, format).isAfter(dayjsWithPlugins(end, format));

    if (!startDateValidation.isValid) return startDateValidation;
    if (!endDateValidation.isValid) return endDateValidation;
    if (isRangeInvalid) return { key: 'isValidRange', isValid: false };

    return { key: null, isValid: true };
}
