import React, { FC, MouseEvent, useContext, useState } from "react";
import classNames from "classnames";

import { CaretDown, PersonFilled } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Profile.scss";

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
     * The display fullName shown next to the avatar.
     */
    fullName?: string;
    /**
     * Avatar background image source.
     */
    src?: string;
}

/**
 * Profile component provides users with access to quick actions, including links to settings, personal preferences, and other utility functions such.
 */
const Profile: FC<IProfileProps> = ({ className, onToggle, fullName, src }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;

    const onProfileClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onToggle) {
            onToggle(e, !isOpen);
        }

        setIsOpen((prev) => !prev);
    };

    return (
        <button type="button" className={classNames("profile", className)} onClick={onProfileClickHandler}>
            <Avatar className="profile__avatar" fullName={fullName} Icon={PersonFilled} src={src} />
            {!isMobileBreakpoint && (
                <div className="profile__content">
                    <span className="profile__text">{fullName}</span>
                    <CaretDown className="profile__icon" size={20} />
                </div>
            )}
        </button>
    );
};

export { IProfileProps, Profile as default };
