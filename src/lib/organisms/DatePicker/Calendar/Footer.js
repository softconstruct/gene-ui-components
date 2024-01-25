import React, { useCallback } from 'react';
import dayjs from 'dayjs';

// Components
import Button from '../../../atoms/Button';

function Footer({
    onPreviewChange,
    onSelect,
    weekPicker,
    monthPicker,
    onRangeChange,
    rangePicker,
    todayText,
    thisWeekText,
    thisMonthText,
    customOption,
    isThisMonthAllowed
}) {
    const handleClick = useCallback(() => {
        const today = customOption
            ? dayjs.isDayjs(customOption?.date)
                ? customOption?.date
                : dayjs(customOption?.date)
            : dayjs().startOf('d');
        onPreviewChange && onPreviewChange(today);

        if (!weekPicker && !monthPicker) {
            onSelect && onSelect(today);
        } else {
            const unit = weekPicker ? 'w' : 'M';
            onRangeChange && onRangeChange([today.startOf(unit), today.endOf(unit)]);
        }
    }, [weekPicker, monthPicker, onPreviewChange, onSelect, onRangeChange, customOption]);

    return (
        <li className="date-actions horizontal">
            {!rangePicker && (
                <ul>
                    <li>
                        <Button
                            color="default"
                            appearance="minimal"
                            flexibility="default"
                            onClick={handleClick}
                            disabled={!isThisMonthAllowed}
                        >
                            {customOption
                                ? customOption.label
                                : weekPicker
                                ? thisWeekText
                                : monthPicker
                                ? thisMonthText
                                : todayText}
                        </Button>
                    </li>
                </ul>
            )}
        </li>
    );
}

Footer.defaultProps = {
    todayText: 'Today',
    thisWeekText: 'This Week',
    thisMonthText: 'This Month'
};

export default Footer;
