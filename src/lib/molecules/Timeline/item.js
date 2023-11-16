import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../../atoms/Icon';

import './item.scss';

const timelineColors = ['hero', 'success', 'danger'];

const timelineAppearances = ['default', 'compact'];

function TimelineItem(props) {
    const { icon, title, color, withLine, isLoading, className, appearance, description, ...restProps } = props;

    return (
        <ul
            className={classnames('timeline-item', `a-${appearance}`, `c-${color}`, className, {
                'with-line': withLine
            })}
            {...restProps}
        >
            <li className="t-line">
                {isLoading ? <Icon type="bc-icon-loader" /> : icon ? <Icon type={icon} /> : <div className="t-icon" />}
            </li>
            <li className="t-texts">
                {!!title && <div className="t-title">{title}</div>}
                {!!description && <div className="t-description">{description}</div>}
            </li>
        </ul>
    );
}

TimelineItem.propTypes = {
    /**
     * Is loading state.
     */
    isLoading: PropTypes.bool,
    /**
     * Title for item
     */
    title: PropTypes.string,
    /**
     * Icon for item
     */
    icon: PropTypes.string,
    /**
     * Render line between items
     */
    withLine: PropTypes.bool,
    /**
     * Description fot item
     */
    description: PropTypes.string,
    /**
     * External/Additional className
     */
    className: PropTypes.string,
    /**
     * Different colors for items
     */
    color: PropTypes.oneOf(timelineColors),
    /**
     * Any valid React node.
     */
    appearance: PropTypes.oneOf(timelineAppearances)
};

TimelineItem.defaultProps = {
    color: timelineColors[0],
    withLine: true,
    appearance: timelineAppearances[0]
};

export { timelineColors, timelineAppearances };

export default TimelineItem;
