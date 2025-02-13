import React, { FC, MouseEvent, useState } from "react";
import classNames from "classnames";

import { CaretDown } from "@geneui/icons";

// Styles
import "./Profile.scss";

import Avatar, { IAvatarProps } from "../../atoms/Avatar";

interface IProfileProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Callback function triggered when the profile button is interacted with.
     * Receives the event and the updated open state.
     */
    onToggle?: (e: MouseEvent<HTMLButtonElement>, isOpen: boolean) => void;
    /**
     * Props to customize the Avatar component, such as image source, size, etc.<br>
     * See Avatar component documentation.
     */
    avatarProps?: IAvatarProps;
    /**
     * The display name shown next to the avatar.
     */
    name?: string;
}

/**
 * Profile component provides users with access to quick actions, including links to settings, personal preferences, and other utility functions such.
 */
const Profile: FC<IProfileProps> = ({ className, onToggle, avatarProps, name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onProfileClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onToggle) {
            onToggle(e, !isOpen);
        }

        setIsOpen((prev) => !prev);
    };

    return (
        <button type="button" className={classNames("profile", className)} onClick={onProfileClickHandler}>
            <Avatar {...avatarProps} className="profile__avatar" />
            <div className="profile__content">
                <span className="profile__text">{name}</span>
                <CaretDown className="profile__icon" size={20} />
            </div>
        </button>
    );
};

export { IProfileProps, Profile as default };
