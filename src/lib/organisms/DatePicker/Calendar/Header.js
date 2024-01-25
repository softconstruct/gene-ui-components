import React, { useMemo, useCallback } from 'react';
import classnames from 'classnames';

// Helpers
import { getStartOfDecade, nextDecade, prevDecade, nextMonthAvailable, prevMonthAvailable } from '../utils';

// Components
import Icon from '../../../atoms/Icon';

function Header({
    view,
    months,
    onViewChange,
    preview,
    onPreviewChange,
    monthPicker,
    rangePicker,
    maxPreview,
    minPreview
}) {
    const startOfDecade = useMemo(() => getStartOfDecade(preview.year()), [preview]);
    const years = useMemo(() => `${startOfDecade} - ${startOfDecade + 9}`, [startOfDecade]);
    const month = useMemo(() => preview.get('month'), [preview]);

    const prevYearVisible = !minPreview || preview.subtract(1, 'y').isAfter(minPreview, 'M');
    const nextYearVisible = !maxPreview || preview.add(1, 'y').isBefore(maxPreview, 'M');
    const prevMonthVisible = view === 'days' && prevMonthAvailable(preview, minPreview);
    const nextMonthVisible = view === 'days' && nextMonthAvailable(preview, maxPreview);

    const headerMonthsVisible = view === 'days';
    const headerYearVisible = view !== 'years';
    const headerYearsVisible = view === 'years';
    const backButtonVisible = monthPicker ? view === 'years' : view !== 'days';

    const handlePrevMonth = () => onPreviewChange(preview.subtract(1, 'M'));
    const handleHeaderMonth = () => !rangePicker && onViewChange('months');
    const handleHeaderYear = () => !rangePicker && onViewChange('years');
    const handleNextMonth = () => onPreviewChange(preview.add(1, 'M'));
    const handleBack = () => onViewChange(view === 'years' ? 'months' : 'days');

    const handlePrevYear = useCallback(
        () => (view !== 'years' ? onPreviewChange(preview.subtract(1, 'y')) : onPreviewChange(prevDecade(preview))),
        [view, onPreviewChange, preview]
    );

    const handleNextYear = useCallback(
        () => (view !== 'years' ? onPreviewChange(preview.add(1, 'y')) : onPreviewChange(nextDecade(preview))),
        [view, onPreviewChange, preview]
    );

    return (
        <ul className="date-heading">
            <li>
                {backButtonVisible && <Icon onClick={handleBack} type="bc-icon-arrow-back" />}
                {prevYearVisible && <Icon onClick={handlePrevYear} type="bc-icon-left-outline" />}
                {prevMonthVisible && <Icon onClick={handlePrevMonth} type="bc-icon-arrow-left-nav" />}
            </li>
            <li className="title">
                {headerMonthsVisible && (
                    <span onClick={handleHeaderMonth} className={classnames({ clickable: !rangePicker })}>
                        {(months && months[month]) || preview.format('MMMM')}
                        &nbsp; &nbsp;
                    </span>
                )}
                {headerYearVisible && (
                    <span onClick={handleHeaderYear} className={classnames({ clickable: !rangePicker })}>
                        {preview.format('YYYY')}
                    </span>
                )}
                {headerYearsVisible && <span>{years}</span>}
            </li>
            <li>
                {nextMonthVisible && <Icon onClick={handleNextMonth} type="bc-icon-arrow-right-nav" />}
                {nextYearVisible && <Icon onClick={handleNextYear} type="bc-icon-right-outline" />}
            </li>
        </ul>
    );
}

export default Header;
