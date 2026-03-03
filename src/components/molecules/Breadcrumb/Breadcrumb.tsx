import React, { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { IconProps, LineSlash, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import BreadcrumbItem, { IBreadcrumbItemProps } from "@components/molecules/Breadcrumb/BreadcrumbItem";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useContainerSize from "@hooks/useContainerSize";
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Breadcrumb.scss";

const MAX_VISIBLE_BREADCRUMB_ITEMS = 6;
const FIRST_VISIBLE_ITEMS = 2;

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
    const [visibleFirstItemsCount, setVisibleFirstItemsCount] = useState(FIRST_VISIBLE_ITEMS);
    const [showPreLastItem, setShowPreLastItem] = useState(true);
    const listRef = useRef<HTMLUListElement>(null);
    const prevContainerWidth = useRef<number>(0);
    // Flag to track if we're waiting for useEllipsisDetection to recalculate
    const isProcessingRef = useRef<boolean>(false);
    const prevIsOverflowingRef = useRef<boolean>(false);

    const itemsCount = breadCrumbsData?.length ?? 0;
    const isCountMode = itemsCount > MAX_VISIBLE_BREADCRUMB_ITEMS; // 7+ items
    const isResponsiveMode = itemsCount > 1 && !isCountMode; // 2–6 items

    const isOverflowing = useEllipsisDetection(listRef, [breadCrumbsData, visibleFirstItemsCount, showPreLastItem]);

    const maxFirstVisible = Math.max(0, itemsCount - 1);
    const hasHiddenResponsiveItems = isResponsiveMode && visibleFirstItemsCount < maxFirstVisible;
    const shouldShowEllipsis = itemsCount > 1 && (isCountMode || isOverflowing || hasHiddenResponsiveItems);
    const { containerRef, sizes: containerSizes } = useContainerSize<HTMLDivElement>();

    // Reset state when breadCrumbsData changes
    useEffect(() => {
        const total = breadCrumbsData?.length ?? 0;

        if (total > MAX_VISIBLE_BREADCRUMB_ITEMS) {
            setVisibleFirstItemsCount(FIRST_VISIBLE_ITEMS);
            setShowPreLastItem(true);
        } else if (total > 1) {
            setVisibleFirstItemsCount(total - 1);
            setShowPreLastItem(false);
        } else {
            setVisibleFirstItemsCount(0);
            setShowPreLastItem(false);
        }
        isProcessingRef.current = false;
        prevIsOverflowingRef.current = false;
    }, [breadCrumbsData]);

    const hideOneItem = useCallback(() => {
        if (!breadCrumbsData || breadCrumbsData.length <= 1) {
            return false;
        }

        if (isCountMode) {
            if (visibleFirstItemsCount > 0) {
                setVisibleFirstItemsCount((prev) => Math.max(0, prev - 1));
                return true;
            }
            if (showPreLastItem && breadCrumbsData.length > 1) {
                setShowPreLastItem(false);
                return true;
            }
            return false;
        }

        if (isResponsiveMode) {
            if (visibleFirstItemsCount > 0) {
                setVisibleFirstItemsCount((prev) => Math.max(0, prev - 1));
                return true;
            }
            return false;
        }

        return false;
    }, [breadCrumbsData, isCountMode, isResponsiveMode, visibleFirstItemsCount, showPreLastItem]);

    const restoreOneItem = useCallback(() => {
        if (!breadCrumbsData || breadCrumbsData.length <= 1) {
            return false;
        }

        if (isCountMode) {
            if (!showPreLastItem && breadCrumbsData.length > 1) {
                setShowPreLastItem(true);
                return true;
            }
            if (visibleFirstItemsCount < FIRST_VISIBLE_ITEMS) {
                setVisibleFirstItemsCount((prev) => Math.min(FIRST_VISIBLE_ITEMS, prev + 1));
                return true;
            }
            return false;
        }

        if (isResponsiveMode) {
            const maxFirstVisibleForRestore = Math.max(0, breadCrumbsData.length - 1);
            if (visibleFirstItemsCount < maxFirstVisibleForRestore) {
                setVisibleFirstItemsCount((prev) => Math.min(maxFirstVisibleForRestore, prev + 1));
                return true;
            }
            return false;
        }

        return false;
    }, [breadCrumbsData, isCountMode, isResponsiveMode, visibleFirstItemsCount, showPreLastItem]);

    // Handle overflow: for any itemsCount > 1, keep hiding items while overflowing.
    useEffect(() => {
        if (!breadCrumbsData || itemsCount <= 1) return;
        if (!isOverflowing) return;

        hideOneItem();
    }, [isOverflowing, breadCrumbsData, itemsCount, hideOneItem]);

    // Handle resize out: restore items when container grows and not overflowing
    useEffect(() => {
        if (!breadCrumbsData) return;
        if (itemsCount <= 1) return;

        const currentWidth = containerSizes.width;
        const isGrowing = currentWidth > prevContainerWidth.current;
        prevContainerWidth.current = currentWidth;

        // Only try to restore when container is growing and not overflowing
        let hasHiddenItems = false;

        if (isCountMode) {
            hasHiddenItems = visibleFirstItemsCount < FIRST_VISIBLE_ITEMS || !showPreLastItem;
        } else if (isResponsiveMode) {
            const maxFirstVisibleLocal = Math.max(0, itemsCount - 1);
            hasHiddenItems = visibleFirstItemsCount < maxFirstVisibleLocal;
        }

        if (isGrowing && !isOverflowing && hasHiddenItems) {
            restoreOneItem();
        }
    }, [
        containerSizes.width,
        isOverflowing,
        breadCrumbsData,
        visibleFirstItemsCount,
        showPreLastItem,
        restoreOneItem,
        isCountMode,
        isResponsiveMode,
        itemsCount,
        prevContainerWidth.current
    ]);

    // Calculate visible items and menu items based on responsive state
    const { visibleFirstItems, visibleLastItems, menuItems } = useMemo(() => {
        if (!breadCrumbsData || itemsCount === 0) {
            return { visibleFirstItems: [], visibleLastItems: [], menuItems: [] };
        }

        if (!shouldShowEllipsis) {
            return { visibleFirstItems: breadCrumbsData, visibleLastItems: [], menuItems: [] };
        }

        const total = itemsCount;
        const lastItem = breadCrumbsData[total - 1];

        if (isCountMode) {
            // 7+ items: original centre-wrapping behaviour
            const firstVisible = breadCrumbsData.slice(0, visibleFirstItemsCount);
            const preLastItem = showPreLastItem && total > 1 ? breadCrumbsData[total - 2] : null;

            const lastVisible = preLastItem ? [preLastItem, lastItem] : [lastItem];

            const hiddenFirstItems =
                visibleFirstItemsCount < FIRST_VISIBLE_ITEMS
                    ? breadCrumbsData.slice(visibleFirstItemsCount, FIRST_VISIBLE_ITEMS)
                    : [];

            const menuStart = Math.max(visibleFirstItemsCount, FIRST_VISIBLE_ITEMS);
            const menuEnd = total - 2;
            const middleItems = menuStart < menuEnd ? breadCrumbsData.slice(menuStart, menuEnd) : [];

            const hiddenPreLastItem = !showPreLastItem && total > 1 ? [breadCrumbsData[total - 2]] : [];

            const allMenuItems = [...hiddenFirstItems, ...middleItems, ...hiddenPreLastItem];

            return {
                visibleFirstItems: firstVisible,
                visibleLastItems: lastVisible,
                menuItems: allMenuItems
            };
        }

        if (isResponsiveMode) {
            // 2–6 items: collapse from the start, always keeping the last item visible
            const maxFirstVisibleResponsive = Math.max(0, total - 1);
            const firstCount = Math.min(visibleFirstItemsCount, maxFirstVisibleResponsive);
            const firstVisible = breadCrumbsData.slice(0, firstCount);
            const lastVisible = [lastItem];

            // All items between the first group and the last item go into the menu
            const responsiveMenuItems = breadCrumbsData.slice(firstCount, total - 1);

            return {
                visibleFirstItems: firstVisible,
                visibleLastItems: lastVisible,
                menuItems: responsiveMenuItems
            };
        }

        return { visibleFirstItems: breadCrumbsData, visibleLastItems: [], menuItems: [] };
    }, [
        breadCrumbsData,
        itemsCount,
        shouldShowEllipsis,
        visibleFirstItemsCount,
        showPreLastItem,
        isCountMode,
        isResponsiveMode
    ]);

    const menuSelectHandler = (menuItem: IMenuItemProps) => {
        const selectedItem = menuItems.find((item) => {
            const itemId = item.path || item.title || "";
            return itemId === menuItem.id;
        });
        if (selectedItem && onClick) {
            onClick(selectedItem);
        }
    };

    const renderBreadcrumbItem = (item: IBreadcrumbItemProps, isLastItem: boolean) => {
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
        <div ref={containerRef} className={classNames("breadcrumb", className)}>
            <nav aria-label="breadcrumb navigation">
                <ul ref={listRef} className="breadcrumb__list">
                    {shouldShowEllipsis && menuItems.length > 0 ? (
                        <>
                            {/* First visible items */}
                            {visibleFirstItems.map((item) => {
                                return renderBreadcrumbItem(item, false);
                            })}
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
                                <LineSlash size={24} />
                            </li>
                            {visibleLastItems.map((item, index) => {
                                const isLastItem = index === visibleLastItems.length - 1;
                                return renderBreadcrumbItem(item, isLastItem);
                            })}
                        </>
                    ) : (
                        breadCrumbsData &&
                        breadCrumbsData.map((item, index) => {
                            const isLastItem = index === breadCrumbsData.length - 1;
                            return renderBreadcrumbItem(item, isLastItem);
                        })
                    )}
                </ul>
            </nav>
        </div>
    );
};

export { IBreadcrumbProps, Breadcrumb as default };
