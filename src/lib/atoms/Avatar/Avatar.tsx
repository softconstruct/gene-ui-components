import React, { FC, PointerEvent, useEffect, useState, JSX, cloneElement } from 'react';
import classNames from 'classnames';
import { Square } from '@geneui/icons';
// Styles
import './Avatar.scss';

interface IAvatarProps {
    /**
     * Avatar background image source.
     */
    src?: string;
    /**
     * The `fullName` property will show first two letters in upper case. This will work when `src` property are not specified.
     */
    fullName?: string;
    /**
     * Avatar icon <br/>
     * The `Icon` prop accepts a JSX element that will be displayed as an avatar.
     */
    Icon?: JSX.Element;
    /**
     * This prop also has an effect on the `fullName` or `Icon` prop size <br/>
     * Possible values: `6Xlarge | large | medium | small`
     */
    size?: '6Xlarge' | 'large' | 'medium' | 'small';
    /**
     * Avatar background color. This prop also has an effect on the `fullName` prop color <br/>
     * Possible values: `neutral | blue | red | green | purple | orange | lagoon | magenta | slate `
     */
    color?: 'neutral' | 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'lagoon' | 'magenta' | 'slate';
    /**
     * A callback function is called when the `avatar` is clicked. It receives an argument containing the event object, a mouse or keyboard event.
     */
    onClick?: (e: PointerEvent<HTMLDivElement>) => void;
    /**
     * Indicates whether the `avatar` is `disabled`, preventing user interaction. When `true`, the `avatar` appears dimmed and can not be clicked.
     */
    isDisabled?: boolean;
    /**
     * Indicates whether the `Avatar` is in a loading state.
     * When set to `true` a `skeleton` indicator will be shown instead of the `Avatar`.
     */
    isLoading?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const iconSizes = {
    small: 16,
    large: 20,
    '6Xlarge': 48
} as const;

/**
 * An avatar is a graphical representation of a user, typically displayed as a small image or icon. It can be a photo, illustration, or initials, and is used to personalize the user experience by visually identifying the user in interfaces such as profiles, comment sections, and messaging apps.
 */
const Avatar: FC<IAvatarProps> = ({
    size = 'medium',
    color = 'magenta',
    fullName,
    src,
    onClick,
    isDisabled,
    isLoading,
    Icon = <Square />,
    className
}) => {
    const [cutFirstAndLastName, setCutFirstAndLastName] = useState<string>('');

    useEffect(() => {
        if (!fullName) {
            setCutFirstAndLastName('');
            return;
        }
        const [firstName, lastName] = fullName.split(' ');

        setCutFirstAndLastName(
            `${firstName[0]}${lastName && (size === '6Xlarge' || size === 'large') ? ' ' + lastName[0] : ''}`
        );
    }, [fullName, size]);

    const iconMock =
        Icon &&
        cloneElement(Icon, {
            size: iconSizes[size]
        });

    return isLoading ? (
        <span>skeleton</span>
    ) : (
        <div
            className={classNames(`avatar avatar_size_${size} avatar_color_${color}`, className, {
                avatar_disabled: isDisabled
            })}
            tabIndex={0}
            onClick={onClick}
        >
            {iconMock && !cutFirstAndLastName && iconMock}
            {src && <img className="avatar__image" alt={'avatar'} src={src} />}
            {cutFirstAndLastName && !src && <span className="avatar__text">{cutFirstAndLastName}</span>}
        </div>
    );
};

export { IAvatarProps, Avatar as default };
