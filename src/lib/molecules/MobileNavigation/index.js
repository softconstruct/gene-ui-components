import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Badge from '../../atoms/Badge';
import Icon from '../../atoms/Icon';

import './index.scss';

function MobileNavigation({ list, activeSlug, onChange, className, ...restProps }) {
    const handleClick = (event) => {
        const { index } = event.currentTarget.dataset;
        const item = list[index];

        onChange && onChange(item);
    };

    return (
        <div className={classnames('mob-navigation-bar', className)} {...restProps}>
            <ul>
                {list.map((item, index) => (
                    <li
                        key={item.slug}
                        data-index={index}
                        className={classnames({
                            active: item.slug === activeSlug,
                            disabled: item.disabled
                        })}
                        onClick={!item.disabled ? handleClick : null}
                    >
                        {item.badge && (
                            <div className={`badge-${item.badge.position || 'right'}`}>
                                <Badge size="default" maxCount={item.badge.maxCount} count={item.badge.count} />
                            </div>
                        )}
                        <Icon type={item.icon} />
                        <p className="ellipsis-text">{item.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

MobileNavigation.propTypes = {
    /**
     * Array of menu items data
     */
    list: PropTypes.arrayOf(
        PropTypes.shape({
            /**
             * Title for navigation item
             */
            title: PropTypes.string,
            /**
             *
             */
            slug: PropTypes.string,
            /**
             * Icon for navigation item
             */
            icon: PropTypes.string,
            /**
             * Notification Badge
             * count - the value of badge
             * maxCount - if the count is greater than the max count, the Badge shows maxCount+
             * position - position of Badge
             */
            badge: PropTypes.shape({
                count: PropTypes.number,
                maxCount: PropTypes.number,
                position: PropTypes.oneOf(['left', 'right'])
            })
        }).isRequired
    ),
    /**
     * Initially selected item
     */
    activeSlug: PropTypes.string,
    /**
     * CSS class name for element
     */
    className: PropTypes.string,
    /**
     * Fires event when user click on one of the items
     * (item: Object) => void
     */
    onChange: PropTypes.func
};

export default MobileNavigation;
