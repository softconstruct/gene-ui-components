/* Localization (https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Web_Localizability/Creating_localizable_web_applications)
 * The localization problem includes languages(i18n),
 * date & number formating, currency and document direction.
 * The project itself did not include any text and currency.
 * Document direction problem is solved on the markup level.
 * Here will be helpers for localizing date and number formats.
 */

// For IE11
const getParsedString = (date) => [].filter.call(date, (v, i) => date.charCodeAt(i) !== 8206).join('');

/**
 * This function is used to get time format depending on browser settings.
 * @param {boolean} includeSeconds - includes seconds
 * @returns {string} Time format.
 */

const getNumberFormat = (number) => number.toLocaleString();

const getBrowserTimeFormat = (includeSeconds = false) => {
    const date = new Date(2013, 11, 31, 23, 5, 8);
    const dateString = date.toLocaleTimeString();
    const parsedString = getParsedString(dateString);

    let timeFormat;
    if (!dateString.match(/23/i)) {
        timeFormat = parsedString
            .replace(/PM|AM/, '')
            .replace('11', 'hh')
            .replace('05', 'mm')
            .replace('08', includeSeconds ? 'ss' : '')
            .trim();

        timeFormat = includeSeconds ? `${timeFormat} A` : `${timeFormat.slice(0, -1)} A`;
    } else {
        timeFormat = parsedString
            .replace('23', 'HH')
            .replace('05', 'mm')
            .replace('08', includeSeconds ? 'ss' : '');

        timeFormat = includeSeconds ? timeFormat : timeFormat.trim().slice(0, -1);
    }
    return timeFormat;
};

/**
 * This function is used to get date format depending on browser settings.
 * @param {boolean} withTime - returns time format also
 * @param {boolean} includeSeconds - shows seconds
 * @returns {string} Date format.
 */

const getBrowserDateFormat = (withTime = false, includeSeconds = false) => {
    const browserDate = new Date(2013, 11, 31).toLocaleDateString();
    const parsedString = getParsedString(browserDate);

    let dateFormat = parsedString.replace('31', 'DD').replace('12', 'MM').replace('2013', 'YYYY');

    if (withTime) {
        dateFormat = `${dateFormat} ${getBrowserTimeFormat(includeSeconds)}`;
    }
    return dateFormat;
};

export { getNumberFormat, getBrowserTimeFormat, getBrowserDateFormat };
