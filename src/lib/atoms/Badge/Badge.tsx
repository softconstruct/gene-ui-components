import React, { ReactNode, FC, HTMLAttributes } from 'react';

// Helpers
import classnames from 'classnames';

//@ts-ignore
import { badgeConfig } from 'configs';

// Styles
import './Badge.scss';

interface IBadgeProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Any custom class name
     */
    className?: string;
    /**
     * Badge size
     */
    size?: 'default' | 'medium' | 'big' | 'huge';
    /**
     * Badge color
     */
    color?: 'danger' | 'primary';
    /**
     * Shows the specified number on the badge
     */
    count?: number;
    /**
     * Set this property to have only dot instead of number
     */
    dot?: boolean;
    /**
     * When the "count" is greater than "maxCount" Badge will show "maxCount" value and "+"
     */
    maxCount?: number;
    /**
     * Any valid React node
     */
    children?: ReactNode;
}

const getShowValue = (count?: number, maxCount?: number) => {
    if (!count && count !== 0) return null;
    if (!maxCount) return count;
    return count > maxCount ? `${maxCount}+` : count;
};

const Badge: FC<IBadgeProps> = ({
    size = badgeConfig.size[0],
    dot = false,
    color = badgeConfig.color[0],
    count,
    maxCount,
    className,
    children,
    ...restProps
}) => {
    const show = dot ? '' : getShowValue(count, maxCount);

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
};

export { IBadgeProps, Badge as default };
