import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.scss';
import { badgeConfig } from '../../../configs';

const getShowValue = (count, maxCount) => {
    if (count !== 0 && !count) return null;
    if (!maxCount) return count;
    return count > maxCount ? `${maxCount}+` : count;
};

function Badge({ children, size, color, count, dot, maxCount, className, ...restProps }) {
    const show = useMemo(() => (dot ? '' : getShowValue(count, maxCount)), [dot, count, maxCount]);

    return (
        <div className="badge" {...restProps}>
            {show !== null && (
                <span
                    className={classnames('badge__content', className, {
                        [`badge__content-${size}`]: size,
                        [`badge__content-${color}`]: color,
                        [`badge__content-dot`]: dot,
                        [`badge__content-children`]: children
                    })}
                >
                    {show}
                </span>
            )}
            {children}
        </div>
    );
}

Badge.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node,
    /**
     * Any custom class name
     */
    className: PropTypes.string,
    /**
     * Badge size
     */
    size: PropTypes.oneOf(badgeConfig.size),
    /**
     * Badge color
     */
    color: PropTypes.oneOf(badgeConfig.color),
    /**
     * Shows the specified number on the badge
     */
    count: PropTypes.number,
    /**
     * Set this property to have only dot instead of number
     */
    dot: PropTypes.bool,
    /**
     * When the "count" is greater than "maxCount" Badge will show "maxCount" value and "+"
     */
    maxCount: PropTypes.number
};

Badge.defaultProps = {
    dot: false,
    size: badgeConfig.size[0],
    color: badgeConfig.color[0]
};

export default Badge;
