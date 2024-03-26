import React, { useMemo, useCallback } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

// Helpers
import { chunk } from 'utils';
import { getCalendarYears, getStartOfDecade } from '../utils';

// Components
import Button from '../../../atoms/Button';

function Years({ previewYear, selected, onChange, onPreviewChange, max, min }) {
    const startOfDecade = useMemo(() => getStartOfDecade(previewYear), [previewYear]);
    const years = useMemo(() => chunk(getCalendarYears(startOfDecade), 3), [startOfDecade]);

    const isFromDecade = useCallback((year) => year > startOfDecade - 1 && year < startOfDecade + 10, [startOfDecade]);

    const checkYearEnableState = useCallback(
        (year) => {
            if (!year) return false;
            if (min && !max) return year >= dayjs(min).year();
            if (!min && max) return year <= dayjs(max).year();
            if (min && max) return max && year <= dayjs(max).year() && min && year >= dayjs(min).year();
            return true;
        },
        [max, min]
    );

    const handleClick = useCallback(
        (year) => {
            isFromDecade(year) ? onChange && onChange(year) : onPreviewChange && onPreviewChange(year);
        },
        [isFromDecade, onPreviewChange, onChange]
    );

    return (
        <ul className="month-years-select">
            {years.map((row) => (
                <li key={row[0]}>
                    {row.map((year) => (
                        <Button
                            key={year}
                            className={classnames({
                                selected: selected && selected === year,
                                disabled: !isFromDecade(year) || !checkYearEnableState(year)
                            })}
                            onClick={() => handleClick(year)}
                            color="default"
                            flexibility="content-size"
                            appearance="minimal"
                        >
                            {year}
                        </Button>
                    ))}
                </li>
            ))}
        </ul>
    );
}

Years.defaultProps = {
    date: dayjs().year()
};

export default Years;
