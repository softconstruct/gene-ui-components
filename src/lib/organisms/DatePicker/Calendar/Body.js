import React, { useCallback } from 'react';

import Days from '../Days';
import Months from '../Months';
import Years from '../Years';

function Body({
    view,
    onViewChange,
    preview,
    onPreviewChange,
    selected,
    onChange,
    weekPicker,
    rangeStart,
    rangeEnd,
    onRangeChange,
    monthPicker,
    rangePicker,
    hovered,
    onHover,
    maxPreview,
    minPreview,
    max,
    min,
    markedDate,
    setIsThisMonthAllowed,
    frozenDateRange
}) {
    const isRange = weekPicker || monthPicker || rangePicker;

    const handleMonthChange = useCallback(
        (month) => {
            if (!monthPicker) {
                onPreviewChange(month);
                onViewChange('days');
            } else {
                const start = month.startOf('M');
                const end = month.endOf('M');
                onPreviewChange(month);
                onRangeChange([start, end]);
            }
        },
        [monthPicker, onPreviewChange, onViewChange, onRangeChange]
    );

    const handleYearChange = useCallback(
        (year) => {
            onPreviewChange(preview.set('y', year));
            onViewChange('months');
        },
        [preview, onPreviewChange, onViewChange]
    );

    const handleFooterPreviewChange = useCallback(
        (year) => onPreviewChange(preview.set('y', year)),
        [preview, onPreviewChange]
    );

    return (
        <>
            {view === 'days' && (
                <Days
                    weekPicker={weekPicker}
                    preview={preview}
                    selected={selected}
                    onChange={onChange}
                    onPreviewChange={onPreviewChange}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    onRangeChange={onRangeChange}
                    rangePicker={rangePicker}
                    hovered={hovered}
                    onHover={onHover}
                    maxPreview={maxPreview}
                    minPreview={minPreview}
                    max={max}
                    min={min}
                    markedDate={markedDate}
                    frozenDateRange={frozenDateRange}
                />
            )}
            {view === 'months' && (
                <Months
                    selected={isRange ? rangeStart : selected}
                    onChange={handleMonthChange}
                    year={preview.startOf('y')}
                    max={max}
                    min={min}
                    setIsThisMonthAllowed={setIsThisMonthAllowed}
                />
            )}
            {view === 'years' && (
                <Years
                    selected={isRange ? rangeStart && rangeStart.year() : selected && selected.year()}
                    onChange={handleYearChange}
                    previewYear={preview.year()}
                    onPreviewChange={handleFooterPreviewChange}
                />
            )}
        </>
    );
}

export default Body;
