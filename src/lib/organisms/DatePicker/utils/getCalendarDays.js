const DAYS_TO_SHOW = 6 * 7;

function getCalendarDays(startOfMonth) {
    const firstWeekDay = startOfMonth.day();
    // Because of using Monday as week start
    const startDiff = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
    const first = startOfMonth.subtract(startDiff, 'days');

    const days = Array(DAYS_TO_SHOW)
        .fill()
        .map((_, i) => first.add(i, 'd'));

    return days;
}

export default getCalendarDays;
