import dayjs from 'dayjs';

import { addTime } from '../utils';

const getDefaultOptions = ([startTime, endTime], actionsTextes = {}) => [
    {
        name: actionsTextes.today,
        start: addTime(dayjs().startOf('d'), startTime),
        end: addTime(dayjs().add(1, 'd').startOf('d'), endTime)
    },
    {
        name: actionsTextes.yesterday,
        start: addTime(dayjs().subtract(1, 'd').startOf('d'), startTime),
        end: addTime(dayjs().startOf('d'), endTime)
    },
    {
        name: actionsTextes.last7Days,
        start: addTime(dayjs().subtract(6, 'd').startOf('d'), startTime),
        end: addTime(dayjs().endOf('d'), endTime)
    },
    {
        name: actionsTextes.last30Days,
        start: addTime(dayjs().subtract(29, 'd').startOf('d'), startTime),
        end: addTime(dayjs().startOf('d'), endTime)
    },
    {
        name: actionsTextes.thisMonth,
        start: addTime(dayjs().startOf('M').startOf('d'), startTime),
        end: addTime(dayjs().endOf('M').startOf('d'), endTime)
    }
];

const getOptionIndex = (rangeStart, rangeEnd, options) =>
    options.findIndex(
        ({ start, end }) => rangeStart && rangeEnd && start.isSame(rangeStart, 'd') && end.isSame(rangeEnd, 'd')
    );

export { getDefaultOptions, getOptionIndex };
