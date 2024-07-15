import React, { FC } from 'react';

// Styles
import './Avatar.scss';

interface IAvatarProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * An avatar is a graphical representation of a user, typically displayed as a small image or icon. It can be a photo, illustration, or initials, and is used to personalize the user experience by visually identifying the user in interfaces such as profiles, comment sections, and messaging apps.
 */
const Avatar: FC<IAvatarProps> = ({ size }) => {
    return <div className="avatar">Avatar</div>;
};

export { IAvatarProps, Avatar as default };
