import React, { useMemo, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

// Helpers
import { guid, chunk } from 'utils';
import { getCalendarMonths } from '../utils';

// Components
import Button from '../../../atoms/Button';

// Local components
import { useDatePickerContext } from '../Context';

function Months({ year, selected, onChange, max, min, setIsThisMonthAllowed }) {
    const [contextConfigs] = useDatePickerContext();

    const months = useMemo(() => chunk(getCalendarMonths(year.startOf('y')), 3), [year]);

    const monthName = useCallback(
        (date) => {
            const month = contextConfigs.months[date.get('month')];
            return month ? month.slice(0, contextConfigs.monthsSlice) : date.format('MMM');
        },
        [contextConfigs]
    );
    const isMonthMaxOrMinChecker = useCallback(
        (month) => {
            if (month && (max || min)) {
                return (
                    (max && dayjs(month).isAfter(dayjs(max), 'month')) ||
                    (min && dayjs(month).isBefore(dayjs(min), 'month'))
                );
            }
        },
        [max, min]
    );

    useEffect(() => {
        if (min && !max) {
            setIsThisMonthAllowed(dayjs(min).isSameOrBefore(dayjs(new Date()), 'month'));
        } else if (!min && max) {
            setIsThisMonthAllowed(dayjs(max).isSameOrAfter(dayjs(new Date()), 'month'));
        } else if (min && max) {
            setIsThisMonthAllowed(
                dayjs(min).isSameOrBefore(dayjs(new Date()), 'month') &&
                    dayjs(max).isSameOrAfter(dayjs(new Date()), 'month')
            );
        }
    }, [max, min]);

    return (
        <ul className="month-years-select">
            {months.map((row) => (
                <li key={guid()}>
                    {row.map((month) => (
                        <Button
                            key={guid()}
                            className={classnames('month-years-select-button', {
                                selected: selected && selected.isSame(month, 'M'),
                                disable: isMonthMaxOrMinChecker(month)
                            })}
                            onClick={() => onChange && onChange(month)}
                            color={isMonthMaxOrMinChecker(month) ? 'default' : 'default'}
                            flexibility="content-size"
                            appearance="minimal"
                        >
                            {monthName(month)}
                        </Button>
                    ))}
                </li>
            ))}
        </ul>
    );
}

Months.defaultProps = {
    year: dayjs().startOf('y')
};

export default Months;
