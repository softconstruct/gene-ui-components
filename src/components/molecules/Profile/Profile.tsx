import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Profile.scss";

interface IProfileProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Profile component props interface
}

/**
 * Profile component provides users with access to quick actions, including links to settings, personal preferences, and other utility functions such.
 */
const Profile: FC<IProfileProps> = ({ className }) => {
    return <div className={classNames("profile", className)}>Profile</div>;
};

export { IProfileProps, Profile as default };
