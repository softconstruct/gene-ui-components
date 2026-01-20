import React, { createContext, FC, ReactNode, useMemo, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { ChevronRight, IconProps, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import BreadcrumbItem, { IBreadcrumbItemProps } from "@components/molecules/Breadcrumb/BreadCrumbItem";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import Tooltip from "@components/molecules/Tooltip";

// Styles
import "./Breadcrumb.scss";

const MAX_VISIBLE_BREADCRUMB_ITEMS = 6;
const FIRST_VISIBLE_ITEMS = 2;
const LAST_VISIBLE_ITEMS = 2;

export type IBreadcrumbRender = (linkData: {
    path?: string;
    title?: string;
    isActive?: boolean;
    Icon?: FC<IconProps>;
}) => ReactNode;

interface IBreadcrumbProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom render function for breadcrumb links.
     */
    render?: IBreadcrumbRender;
    /**
     * Called when a breadcrumb item is clicked.
     */
    onClick?: (item: IBreadcrumbItemProps) => void;
    breadCrumbsData: IBreadcrumbItemProps[];
    iconOnly?: boolean;
}

interface IBreadcrumbContextProps {
    iconOnly?: boolean;
    isLastItem?: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbItemProps) => void;
}

export const BreadcrumbContext = createContext<IBreadcrumbContextProps>({} as IBreadcrumbContextProps);

interface BreadcrumbItemWrapperProps {
    props: IBreadcrumbItemProps;
    iconOnly: boolean;
    isLastItem: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbItemProps) => void;
}

const BreadcrumbItemWrapper: FC<BreadcrumbItemWrapperProps> = ({ props, iconOnly, isLastItem, render, onClick }) => {
    const itemContextValue: IBreadcrumbContextProps = useMemo(
        () => ({
            iconOnly,
            isLastItem,
            render,
            onClick
        }),
        [iconOnly, isLastItem, render, onClick]
    );

    return (
        <BreadcrumbContext.Provider value={itemContextValue}>
            <BreadcrumbItem {...props} />
        </BreadcrumbContext.Provider>
    );
};

/**
 * Breadcrumb component is a navigational aid that displays the user's current location within a website or application. It provides a trail of links back to the starting or entry point, allowing users to easily navigate through the hierarchical structure of the site. Breadcrumbs enhance usability by offering a clear path for users to trace their steps and return to previous sections.
 */
const Breadcrumb: FC<IBreadcrumbProps> = ({ className, breadCrumbsData, iconOnly = false, render, onClick }) => {
    const [menuPropsForPopover, setMenuPropsForPopover] = useState({});

    const shouldShowEllipsis = breadCrumbsData && breadCrumbsData.length > MAX_VISIBLE_BREADCRUMB_ITEMS;

    const menuItems = shouldShowEllipsis ? breadCrumbsData.slice(FIRST_VISIBLE_ITEMS, -LAST_VISIBLE_ITEMS) : [];

    const menuSelectHandler = (menuItem: IMenuItemProps) => {
        const selectedItem = menuItems.find((item) => {
            const itemId = item.path || item.title || "";
            return itemId === menuItem.id;
        });
        if (selectedItem && onClick) {
            onClick(selectedItem);
        }
    };

    const renderBreadcrumbItem = (item: IBreadcrumbItemProps, index: number, isLastItem: boolean) => {
        const key = nanoid();
        return (
            <BreadcrumbItemWrapper
                key={key}
                props={item}
                iconOnly={iconOnly}
                isLastItem={isLastItem}
                render={render}
                onClick={onClick}
            />
        );
    };

    return (
        <div className={classNames("breadcrumb", className)}>
            <nav aria-label="breadcrumb navigation">
                <ul className="breadcrumb__list">
                    {shouldShowEllipsis ? (
                        <>
                            {/* First visible items */}
                            {breadCrumbsData
                                .slice(0, FIRST_VISIBLE_ITEMS)
                                .map((item, index) => renderBreadcrumbItem(item, index, false))}
                            {/* Ellipsis button with menu */}
                            <li className="breadcrumb__item">
                                <Tooltip text="More items" isVisible={iconOnly}>
                                    <Button
                                        Icon={ThreeDotsHorizontal}
                                        layout="text"
                                        appearance="secondary"
                                        size="medium"
                                        {...menuPropsForPopover}
                                    />
                                </Tooltip>
                                <Menu
                                    onChange={menuSelectHandler}
                                    setPropsForPopover={setMenuPropsForPopover}
                                    position="bottom-right"
                                >
                                    {menuItems.map((item) => {
                                        const itemId = item.path || item.title || nanoid();
                                        return (
                                            <MenuItem key={itemId} id={itemId} IconBefore={item.Icon}>
                                                {item.title}
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>
                                <ChevronRight size={24} />
                            </li>
                            {/* Last visible items */}
                            {breadCrumbsData.slice(-LAST_VISIBLE_ITEMS).map((item, index) => {
                                const actualIndex = breadCrumbsData.length - LAST_VISIBLE_ITEMS + index;
                                const isLastItem = actualIndex === breadCrumbsData.length - 1;
                                return renderBreadcrumbItem(item, actualIndex, isLastItem);
                            })}
                        </>
                    ) : (
                        breadCrumbsData &&
                        breadCrumbsData.map((item, index) => {
                            const isLastItem = index === breadCrumbsData.length - 1;
                            return renderBreadcrumbItem(item, index, isLastItem);
                        })
                    )}
                </ul>
            </nav>
        </div>
    );
};

export { IBreadcrumbProps, Breadcrumb as default };
