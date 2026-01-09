import React, { FC, Fragment, useState } from "react";
import classNames from "classnames";

import { Plus, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Spreadsheet from "@components/atoms/Spreadsheet";
import Text from "@components/atoms/Text";
import { IMenuItemProps } from "@components/molecules/Menu";
import NavigationItem from "@components/molecules/Navigation/NavigationItem";

// Styles
import "./NavigationMobile.scss";

import { INavigationCreateData, INavigationData, INavigationProps } from "../Navigation";

const getChildActivePathIndex = (activePathIndex: number[] | null | undefined, index: number): number[] | null => {
    if (activePathIndex && index === activePathIndex[0]) {
        return activePathIndex.slice(1);
    }
    return null;
};

interface INavigationMobileProps {
    /**
     * Controls whether the mobile navigation menu is open.
     */
    open: boolean;
    /**
     * Callback when the mobile navigation menu should close.
     */
    onClose: () => void;
    /**
     * Array of navigation items data to display in the menu.
     */
    navigationData: INavigationData[];
    /**
     * Data for items shown in the create/add menu at the bottom.
     */
    navigationCreateData?: INavigationCreateData[];
    /**
     * Called when a navigation item is clicked.
     */
    onClick?: (path: string) => void;
    /**
     * Called when a create menu item is clicked.
     */
    onNavigationCreateDataClick?: (item: INavigationCreateData) => void;
    /**
     * Custom render function for navigation links.
     */
    render?: INavigationProps["render"];
    /**
     * Array of indices representing the path to the currently active item.
     */
    activePathIndex: number[] | null;
    /**
     * Text for the create button. If not provided, only the icon will be shown.
     */
    createButtonText?: string;
}

interface INavMenuContentMobileProps {
    data?: INavigationData | null;
    depth?: number;
    createClickHandler: (hasChildren: boolean) => (path: string) => void;
    activePathIndex?: number[] | null;
    render?: INavigationProps["render"];
}

const NavMenuContentMobile: FC<INavMenuContentMobileProps> = ({
    data,
    depth = 0,
    createClickHandler,
    activePathIndex,
    render
}) => {
    if (!data) return null;
    return data.children?.map((item, index) => {
        const itemKey = `${item.title}-${item.path}`;
        const hasChildren = !!(item.children && item.children.length > 0);
        return (
            <Fragment key={itemKey}>
                <NavigationItem
                    title={item.title}
                    path={item.path}
                    depth={depth}
                    Icon={item.Icon}
                    onClick={createClickHandler(hasChildren)}
                    disabled={item.disabled}
                    selected={index === activePathIndex?.[0]}
                    render={render}
                >
                    {hasChildren && (
                        <NavMenuContentMobile
                            data={item}
                            depth={depth + 1}
                            createClickHandler={createClickHandler}
                            activePathIndex={activePathIndex?.slice(1)}
                            render={render}
                        />
                    )}
                </NavigationItem>
            </Fragment>
        );
    });
};

const NavigationMobile: FC<INavigationMobileProps> = ({
    open,
    onClose,
    navigationData,
    navigationCreateData,
    onClick,
    onNavigationCreateDataClick,
    render,
    activePathIndex,
    createButtonText
}) => {
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    const handleCreateMenuOpen = () => setIsCreateMenuOpen(true);
    const handleCreateMenuClose = () => setIsCreateMenuOpen(false);

    // Close both main navigation and create menu
    const handleMainClose = () => {
        // If create menu is open, don't close the main navigation
        // (clicks inside create menu trigger this, but we only want to close create menu)
        if (isCreateMenuOpen) {
            return;
        }
        onClose();
    };

    // Force close everything (used by X button and item selection)
    const handleForceClose = () => {
        setIsCreateMenuOpen(false);
        onClose();
    };

    // Handler for items - only close if item has no children (leaf item)
    const createItemClickHandler = (hasChildren: boolean) => (path?: string) => {
        if (path && onClick) {
            onClick(path);
        }
        // Only close navigation when clicking leaf items (no children)
        if (!hasChildren) {
            handleForceClose();
        }
    };

    const onCreateItemClick = (item: INavigationCreateData) => {
        onNavigationCreateDataClick?.(item);
        handleForceClose();
    };

    const hasCreateData = navigationCreateData && navigationCreateData.length > 0;

    return (
        <>
            <Spreadsheet open={open} onClose={handleMainClose} inset={false} className="navigationMobile">
                <div className="navigationMobile__container">
                    <div className="navigationMobile__header">
                        <Button
                            Icon={X}
                            size="medium"
                            appearance="secondary"
                            layout="text"
                            onClick={handleForceClose}
                            aria-label="Close navigation"
                        />
                    </div>

                    <div className="navigationMobile__content">
                        <Scrollbar className="navigationMobile__scrollbar">
                            <div className="navigationMobile__list">
                                {navigationData.map((item, index) => {
                                    const hasChildren = !!(item.children && item.children.length > 0);
                                    return (
                                        <Fragment key={`mobile-nav-${item.title}-${item.path || index}`}>
                                            <NavigationItem
                                                title={item.title}
                                                path={item.path}
                                                depth={0}
                                                Icon={item.Icon}
                                                onClick={createItemClickHandler(hasChildren)}
                                                disabled={item.disabled}
                                                selected={index === activePathIndex?.[0]}
                                                render={render}
                                            >
                                                {hasChildren && (
                                                    <NavMenuContentMobile
                                                        data={item}
                                                        depth={1}
                                                        createClickHandler={createItemClickHandler}
                                                        activePathIndex={getChildActivePathIndex(
                                                            activePathIndex,
                                                            index
                                                        )}
                                                        render={render}
                                                    />
                                                )}
                                            </NavigationItem>
                                        </Fragment>
                                    );
                                })}
                            </div>
                        </Scrollbar>
                    </div>

                    {hasCreateData && (
                        <div className="navigationMobile__footer">
                            <Button
                                Icon={Plus}
                                iconPosition={createButtonText ? "before" : undefined}
                                size="large"
                                appearance="secondary"
                                fullWidth
                                onClick={handleCreateMenuOpen}
                            >
                                {createButtonText}
                            </Button>
                        </div>
                    )}
                </div>
            </Spreadsheet>

            {hasCreateData && (
                <Spreadsheet
                    open={isCreateMenuOpen}
                    onClose={handleCreateMenuClose}
                    inset={false}
                    className="navigationMobile navigationMobile_create"
                >
                    <div className="navigationMobile__container navigationMobile__container_create">
                        <div className="navigationMobile__header">
                            <Button
                                Icon={X}
                                size="medium"
                                appearance="secondary"
                                layout="text"
                                onClick={handleCreateMenuClose}
                                aria-label="Close create menu"
                            />
                        </div>

                        <div className="navigationMobile__content">
                            <Scrollbar className="navigationMobile__scrollbar">
                                <div className="navigationMobile__list navigationMobile__list_create">
                                    {navigationCreateData?.map((props: IMenuItemProps, index) => {
                                        const { title, IconBefore, IconAfter, danger, disabled, id } = props;
                                        return (
                                            <button
                                                key={`create-mobile-${title}-${id || index}`}
                                                type="button"
                                                className={classNames("navigationMobile__createItem", {
                                                    navigationMobile__createItem_danger: danger,
                                                    navigationMobile__createItem_disabled: disabled
                                                })}
                                                onClick={() => onCreateItemClick(props)}
                                                disabled={disabled}
                                            >
                                                {IconBefore && (
                                                    <IconBefore
                                                        className="navigationMobile__createItemIcon"
                                                        size={20}
                                                    />
                                                )}
                                                {title && (
                                                    <Text as="span" variant="bodyMediumMedium">
                                                        {title}
                                                    </Text>
                                                )}
                                                {IconAfter && (
                                                    <IconAfter
                                                        className="navigationMobile__createItemIcon navigationMobile__createItemIcon_after"
                                                        size={20}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Scrollbar>
                        </div>
                    </div>
                </Spreadsheet>
            )}
        </>
    );
};

export { INavigationMobileProps, NavigationMobile as default };
