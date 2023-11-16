function getCalendarMonths(startOfYear) {
    const end = startOfYear.endOf('y');

    let pointer = startOfYear;
    const months = [];

    while (pointer.isBefore(end)) {
        months.push(pointer);
        pointer = pointer.add(1, 'M');
    }

    return months;
}

export default getCalendarMonths;
