/**
 * Setup dayjs plugin.
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);

export const dayjsWithPlugins = dayjs;
