import React, { FC, PointerEvent, useEffect, useState } from 'react';
import classNames from 'classnames';

// Styles
import './Avatar.scss';

interface IAvatarProps {
    size?: '6Xlarge' | 'large' | 'medium' | 'small';
    color?: 'neutral' | 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'lagoon' | 'magenta' | 'slate ';
    fullName?: string;
    src?: string;
    onClick?: (e: PointerEvent<HTMLDivElement>) => void;
    isDisabled?: boolean;
}

/**
 * An avatar is a graphical representation of a user, typically displayed as a small image or icon. It can be a photo, illustration, or initials, and is used to personalize the user experience by visually identifying the user in interfaces such as profiles, comment sections, and messaging apps.
 */
const Avatar: FC<IAvatarProps> = ({ size, color, fullName, src, onClick, isDisabled }) => {
    const [cutFirstAndLastName, setCutFirstAndLastName] = useState<string>('');

    useEffect(() => {
        if (!fullName) {
            setCutFirstAndLastName('');
            return;
        }
        const [firstLetter, secondLetter] = fullName.split(' ');
        setCutFirstAndLastName(`${firstLetter[0]} ${secondLetter ? secondLetter[0] : ''}`);
    }, [fullName]);

    return (
        <div
            className={classNames(`avatar avatar_size_${size} avatar_color_${color}`, {
                avatar_disabled: isDisabled
            })}
            tabIndex={0}
            onClick={onClick}
        >
            {src && <img className="avatar__image" alt={'avatar'} src={src} />}
            {cutFirstAndLastName && !src && <span className="avatar__text">{cutFirstAndLastName}</span>}
        </div>
    );
};

export { IAvatarProps, Avatar as default };
