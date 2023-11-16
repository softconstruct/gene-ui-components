const nextMonthAvailable = (date, max) => !max || date.add(1, 'M').isBefore(max, 'M');
const prevMonthAvailable = (date, min) => !min || date.subtract(1, 'M').isAfter(min, 'M');

export { nextMonthAvailable, prevMonthAvailable };
