import React, { FC, useEffect, useState } from 'react';

// Styles
import './Avatar.scss';

interface IAvatarProps {
    /**
     * size description
     */
    size?: '6Xlarge' | 'large' | 'medium' | 'small';
    color?: 'neutral' | 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'lagoon';
    fullName?: string;
    src?: string;
}

/**
 * An avatar is a graphical representation of a user, typically displayed as a small image or icon. It can be a photo, illustration, or initials, and is used to personalize the user experience by visually identifying the user in interfaces such as profiles, comment sections, and messaging apps.
 */
const Avatar: FC<IAvatarProps> = ({ size, color, fullName, src }) => {
    const [cutFirstAndLastName, setCutFirstAndLastName] = useState<string>('');

    useEffect(() => {
        if (!fullName) {
            setCutFirstAndLastName('');
            return;
        }
        const [firstLetter, secondLetter] = fullName.split(' ');
        setCutFirstAndLastName(`${firstLetter?.[0]} ${secondLetter ? secondLetter?.[0] : ''}`);
    }, [fullName]);

    return (
        <div className={`avatar avatar_size_${size} avatar_color_${color}`} tabIndex={0}>
            {src && <img className="avatar__image" alt={src} src={src} />}
            {cutFirstAndLastName && !src && <span className="avatar__text">{cutFirstAndLastName}</span>}
        </div>
    );
};

export { IAvatarProps, Avatar as default };
