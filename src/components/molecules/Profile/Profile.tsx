import React, { FC, JSX, MouseEvent, useContext, useState } from "react";
import classNames from "classnames";

import { CaretDownFilled, IconProps, PersonFilled } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Profile.scss";

interface IProfileData {
    selected?: boolean;
    children?: IProfileData[];
    title?: string;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    danger?: boolean;
    disabled?: boolean;
    id: number | string;
    divider?: boolean;
    emptyText?: string;
    ComponentRender?: FC;
    loading?: boolean;
    loadingText?: string;
}

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
     * The full name of the user displayed next to the avatar.
     * Visible only on non-mobile breakpoints to preserve space.
     * If no avatar image is provided, the avatar will display the user's initials based on this name.
     */
    fullName?: string;
    /**
     * The source URL for the avatar image.
     */
    src?: string;
    /**
     * An array of menu items that define the structure of the profile dropdown menu.
     * Each item can optionally include nested `children` for submenus, icons, custom render components,
     * loading states, and various item configuration options like `danger`, `disabled`, or `divider`.
     */
    profileData: IProfileData[];
    /**
     * Callback triggered when a profile menu item is selected.
     * Receives the selected menu item as an argument.
     */
    onProfileItemSelect?: (item: IMenuItemProps) => void;
}

const ProfileDataRecursion = (menuData: IProfileData[]): JSX.Element[] => {
    return menuData.map((el: IProfileData) => (
        <MenuItem
            key={el.id}
            selected={el.selected}
            title={el.children ? el.title : ""}
            IconBefore={el.IconBefore}
            IconAfter={el.IconAfter}
            danger={el.danger}
            disabled={el.disabled}
            loading={el.loading}
            id={el.id}
            divider={el.divider}
            loadingText={el.loadingText}
            emptyText={el.emptyText}
            ComponentRender={el.ComponentRender}
        >
            {el.children ? ProfileDataRecursion(el.children) : el.title}
        </MenuItem>
    ));
};

/**
 * Profile component provides users with access to quick actions, including links to settings, personal preferences, and other utility functions such.
 */
const Profile: FC<IProfileProps> = ({ className, onToggle, fullName, src, onProfileItemSelect, profileData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState({});
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
    const isRTLMode = document.dir === "rtl";

    const onProfileClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (onToggle) {
            onToggle(e, !isOpen);
        }

        setIsOpen((prev) => !prev);
    };

    const onProfileItemSelectHandler = (item: IMenuItemProps) => {
        onProfileItemSelect?.(item);
    };

    return (
        <div className="profile">
            <button
                type="button"
                onClick={onProfileClickHandler}
                className={classNames("profile__button", className)}
                {...propsForPopover}
            >
                <Avatar className="profile__avatar" fullName={fullName} Icon={PersonFilled} src={src} />
                {!isMobileBreakpoint && (
                    <div className="profile__content">
                        <span className="profile__text">{fullName}</span>
                        <CaretDownFilled className="profile__icon" size={20} />
                    </div>
                )}
            </button>
            <Menu
                onChange={onProfileItemSelectHandler}
                setPropsForPopover={setPropsForPopover}
                position={isRTLMode ? "bottom-left" : "bottom-right"}
                swappable
                size="large"
            >
                {ProfileDataRecursion(profileData)}
            </Menu>
        </div>
    );
};

export { IProfileProps, IProfileData, Profile as default };
