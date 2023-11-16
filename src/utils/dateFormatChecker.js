const nonLettersRegex = /[\W_]+/g;

const dateFormats = ['YY', 'YYYY', 'M', 'MM', 'MMM', 'MMMM', 'D', 'DD'];
const timeFormats = ['H', 'HH', 'h', 'hh', 'm', 'mm', 's', 'ss'];

const getFormatSeparator = (format) => format[format.search(nonLettersRegex)];

export const checkFormat = (format) => {
    const [dateFormatOnly, timeFormatOnly] = format.split(' ');

    const dateFormatSeparator = getFormatSeparator(dateFormatOnly);
    const timeFormatSeparator = timeFormatOnly && getFormatSeparator(timeFormatOnly);
    const isDateFormatValid = dateFormatOnly.split(dateFormatSeparator).every((part) => dateFormats.includes(part));
    const isTimeFormatValid =
        !timeFormatOnly || timeFormatOnly.split(timeFormatSeparator).every((part) => timeFormats.includes(part));

    return isDateFormatValid && isTimeFormatValid;
};
