import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Day({
    value,
    disabled,
    isCurrent,
    isSelected,
    isRanged,
    onClick,
    onHover,
    rangeStart,
    isHoveredBefore,
    startDate,
    endDate,
    isHovered,
    rangeEnd,
    hide,
    max,
    min
}) {
    const handleClick = useCallback(() => {
        const checkedValue = disabled ? (value.isBefore(min) ? min : max) : value;
        onClick && onClick(checkedValue);
    }, [value, onClick, max, min, disabled]);
    const handleMouseEnter = useCallback(() => onHover && onHover(value), [value, onHover]);

    return (
        <li
            className={classnames({
                disabled,
                selected: !disabled && isSelected,
                current: isCurrent,
                ranged: !disabled && isRanged,
                'range-start':
                    (endDate && value.isSame(startDate)) ||
                    (isHoveredBefore && isHovered) ||
                    (rangeStart && !isHoveredBefore),
                'range-end':
                    endDate && value.isSame(startDate)
                        ? false
                        : (rangeStart && isHoveredBefore) || (!isHoveredBefore && isHovered) || rangeEnd
            })}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            {!hide && <span>{value.date()}</span>}
        </li>
    );
}

Day.propTypes = {
    value: PropTypes.instanceOf(dayjs).isRequired,
    startDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    endDate: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    max: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    min: PropTypes.oneOfType([
        PropTypes.instanceOf(dayjs),
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
    ]),
    isHovered: PropTypes.bool,
    disabled: PropTypes.bool,
    isCurrent: PropTypes.bool,
    isSelected: PropTypes.bool,
    isRanged: PropTypes.bool,
    isHoveredBefore: PropTypes.bool,
    onClick: PropTypes.func
};

Day.defaultProps = {
    disabled: false,
    isCurrent: false,
    isSelected: false,
    isRanged: false
};

export default Day;
