import React, { FC, JSX, PointerEvent, useEffect, useState } from "react";
import classNames from "classnames";

import { IconProps, Square } from "@geneui/icons"; // TODO: replace with the person icon

// Styles
import "./Avatar.scss";

const iconSizes: Record<"small" | "large" | "medium" | "6Xlarge", IconProps["size"]> = {
    small: 16,
    large: 20,
    medium: 20,
    "6Xlarge": 48
} as const;

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
    Icon?: React.FC<IconProps>;
    /**
     * This prop defines the width and height for the component <br/>
     * Possible values: `6Xlarge | large | medium | small`
     */
    size?: "6Xlarge" | "large" | "medium" | "small";
    /**
     * Avatar background color. This prop also has an effect on the `fullName` prop color <br/>
     * Possible values: `neutral | blue | red | green | purple | orange | lagoon | magenta | slate `
     */
    color?: "neutral" | "blue" | "red" | "green" | "purple" | "orange" | "lagoon" | "magenta" | "slate";
    /**
     * A callback function is called when the `avatar` is clicked. It receives an argument containing the event object, a mouse or keyboard event. If onClick is not passed, the Avatar component becomes a non-interactable element.
     */
    onClick?: (e: PointerEvent<HTMLButtonElement>) => void;
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

interface IAvatarWrapperProps {
    onClick?: (e: PointerEvent<HTMLButtonElement>) => void;
    children: JSX.Element;
    parentClass: string;
    isDisabled: boolean | undefined;
}

const AvatarWrapper: FC<IAvatarWrapperProps> = ({ onClick, children, parentClass, isDisabled }) => {
    return onClick ? (
        <button type="button" onClick={onClick} className={`${parentClass} avatar_button`} disabled={isDisabled}>
            {children}
        </button>
    ) : (
        <div className={parentClass}>{children}</div>
    );
};

/**
 * An avatar is a graphical representation of a user, typically displayed as a small image or icon. It can be a photo, illustration, or initials, and is used to personalize the user experience by visually identifying the user in interfaces such as profiles, comment sections, and messaging apps.
 */
const Avatar: FC<IAvatarProps> = ({
    size = "medium",
    color = "magenta",
    fullName = "",
    src,
    onClick,
    isDisabled,
    isLoading,
    Icon = Square, // todo need to change to User icon after releasing new icons
    className
}) => {
    const [proceedFullName, setProceedFullName] = useState(fullName);

    useEffect(() => {
        const [firstName = "", lastName = ""] = fullName.split(" ");
        const [firstNameFirstLetter] = firstName;
        const [lastNameFirstLetter] = lastName || "";

        setProceedFullName(
            firstNameFirstLetter
                ? `${firstNameFirstLetter}${
                      !!lastNameFirstLetter && (size === "6Xlarge" || size === "large") ? ` ${lastNameFirstLetter}` : ""
                  }`
                : ``
        );
    }, [fullName, size]);

    let content = <Icon className="avatar__icon" size={iconSizes[size]} />;

    if (src) {
        content = <img className="avatar__image" alt="avatar" src={src} />;
    } else if (proceedFullName) {
        content = <span className="avatar__text">{proceedFullName}</span>;
    }

    return isLoading ? (
        <span>skeleton</span>
    ) : (
        <AvatarWrapper
            parentClass={classNames(`avatar avatar_size_${size} avatar_color_${color}`, className, {
                avatar_disabled: isDisabled
            })}
            onClick={onClick}
            isDisabled={isDisabled}
        >
            {content}
        </AvatarWrapper>
    );
};

export { IAvatarProps, Avatar as default };
