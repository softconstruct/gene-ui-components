import React, { useMemo, useCallback } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

import { chunk } from 'utils';
import { getCalendarYears, getStartOfDecade } from '../utils';

function Years({ previewYear, selected, onChange, onPreviewChange }) {
    const startOfDecade = useMemo(() => getStartOfDecade(previewYear), [previewYear]);
    const years = useMemo(() => chunk(getCalendarYears(startOfDecade), 3), [startOfDecade]);

    const isFromDecade = useCallback((year) => year > startOfDecade - 1 && year < startOfDecade + 10, [startOfDecade]);

    const handleClick = useCallback(
        (e) => {
            const { year } = e.target.dataset;
            isFromDecade(year) ? onChange && onChange(year) : onPreviewChange && onPreviewChange(year);
        },
        [isFromDecade, onPreviewChange, onChange]
    );

    return (
        <ul className="month-years-select">
            {years.map((row) => (
                <li key={row[0]}>
                    {row.map((year) => (
                        // TODO ::: replace with Button atom
                        <button
                            key={year}
                            data-year={year}
                            className={classnames({
                                selected: selected && selected === year,
                                disabled: !isFromDecade(year)
                            })}
                            onClick={handleClick}
                        >
                            {year}
                        </button>
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
