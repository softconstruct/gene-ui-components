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
    return (
        <div className="forAvatarTestHolder">
            <div className="avatar avatar_size_6Xlarge">
                <img
                    className="avatar__image"
                    alt=""
                    src="https://www.usatoday.com/gcdn/presto/2019/04/25/USAT/9778482f-f809-4a08-82a7-67ddfa3e2f98-XXX_AVENGERS_AGE_ULTRON_MOV_jy_5965_.JPG?crop=1068,600,x1088,y30&width=1068&height=600&format=pjpg&auto=webp"
                />
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_neutral">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_blue">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_red">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_green">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_purple">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_orange">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_lagoon">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_magenta">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_6Xlarge avatar_color_slate">
                <span className="avatar__text">ns</span>
            </div>

            <div className="avatar avatar_size_large">
                <img
                    className="avatar__image"
                    alt=""
                    src="https://www.usatoday.com/gcdn/presto/2019/04/25/USAT/9778482f-f809-4a08-82a7-67ddfa3e2f98-XXX_AVENGERS_AGE_ULTRON_MOV_jy_5965_.JPG?crop=1068,600,x1088,y30&width=1068&height=600&format=pjpg&auto=webp"
                />
            </div>
            <div className="avatar avatar_size_large avatar_color_neutral">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_blue">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_red">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_green">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_purple">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_orange">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_lagoon">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_magenta">
                <span className="avatar__text">ns</span>
            </div>
            <div className="avatar avatar_size_large avatar_color_slate">
                <span className="avatar__text">ns</span>
            </div>
        </div>
    );
};

export { IAvatarProps, Avatar as default };
