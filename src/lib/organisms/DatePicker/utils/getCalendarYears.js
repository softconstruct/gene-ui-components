const getCalendarYears = (startYear) =>
    Array(12)
        .fill(startYear - 1)
        .map((item, i) => item + i);

const getStartOfDecade = (year) => Math.floor(year / 10) * 10;

const nextDecade = (date) => date.set('y', getStartOfDecade(date.year()) + 10).startOf('y');
const prevDecade = (date) => date.set('y', getStartOfDecade(date.year()) - 10).startOf('y');

export { getCalendarYears, getStartOfDecade, nextDecade, prevDecade };
