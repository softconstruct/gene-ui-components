import React, { MouseEvent, ReactNode } from 'react';
import classnames from 'classnames';

// Helpers
// @ts-ignore
import { getInitials, noop } from 'utils';

// Styles
import './Avatar.scss';

interface IAvatarProps {
    /**
     * Background image source
     */
    src?: string;
    /**
     * The property will show icon. This property will work when "src" is not specified.
     */
    icon?: string;
    /**
     * The property will show first two letters in upper case. This will work when "src" or "icon" are not specified.
     */
    children?: ReactNode;
    /**
     * Avatar size
     */
    size?: 'small' | 'default' | 'medium' | 'big';
    /**
     * Avatar color
     */
    color?: 'default' | 'green' | 'red';
    /**
     * Avatar shape
     */
    shape?: 'circle' | 'square';
    /**
     * Handle click event on avatar component((event: Event) => void 0).
     */
    onClick?: (event: MouseEvent) => void;
}

const Avatar: React.FC<IAvatarProps> = ({ src, icon, size, color, shape, onClick, children }) => {
    return (
        <div
            className={classnames('user-avatar-c', {
                [`size-${size}`]: size,
                [`color-${color}`]: color,
                [`shape-${shape}`]: shape,
                [icon!]: !src && icon,
                'text-small': typeof children === 'string' && children.length > 1,
                clickable: !!onClick
            })}
            style={{ backgroundImage: src ? `url(${src})` : '' }}
            onClick={onClick}
        >
            {!src && !icon && children && getInitials(children)}
        </div>
    );
};

Avatar.defaultProps = {
    onClick: noop,
    size: 'default',
    color: 'default',
    shape: 'circle'
};

export { IAvatarProps, Avatar as default };
