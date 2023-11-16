import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getInitials, noop } from 'utils';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Avatar({ src, icon, size, color, shape, onClick, children }) {
    return (
        <div
            className={classnames('user-avatar-c', {
                [`size-${size}`]: size,
                [`color-${color}`]: color,
                [`shape-${shape}`]: shape,
                [icon]: !src && icon,
                'text-small': typeof children === 'string' && children.length > 1,
                clickable: !!onClick
            })}
            style={{ backgroundImage: src ? `url(${src})` : '' }}
            onClick={onClick}
        >
            {!src && !icon && children && getInitials(children)}
        </div>
    );
}

Avatar.propTypes = {
    /**
     * Background image source
     */
    src: PropTypes.string,
    /**
     * The property will show icon. This property will work when "src" is not specified.
     */
    icon: PropTypes.string,
    /**
     * The property will show first two letters in upper case. This will work when "src" or "icon" are not specified.
     */
    children: PropTypes.string,
    /**
     * Avatar size
     */
    size: PropTypes.oneOf(['small', 'default', 'medium', 'big']),
    /**
     * Avatar color
     */
    color: PropTypes.oneOf(['default', 'green', 'red']),
    /**
     * Avatar shape
     */
    shape: PropTypes.oneOf(['circle', 'square']),
    /**
     *
     * Handle click event on avatar component((event: Event) => void 0).
     */
    onClick: PropTypes.func
};

Avatar.defaultProps = {
    onClick: noop,
    size: 'default',
    color: 'default',
    shape: 'circle'
};

export default Avatar;
