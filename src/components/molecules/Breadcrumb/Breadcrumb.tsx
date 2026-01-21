import React, { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { ChevronRight, IconProps, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import BreadcrumbItem, { IBreadcrumbItemProps } from "@components/molecules/Breadcrumb/BreadCrumbItem";
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

    const shouldShowEllipsis = breadCrumbsData && breadCrumbsData.length > MAX_VISIBLE_BREADCRUMB_ITEMS;

    const isOverflowing = useEllipsisDetection(listRef, [breadCrumbsData, visibleFirstItemsCount, showPreLastItem]);
    const { containerRef, sizes: containerSizes } = useContainerSize<HTMLDivElement>();

    // Reset state when breadCrumbsData changes
    useEffect(() => {
        setVisibleFirstItemsCount(FIRST_VISIBLE_ITEMS);
        setShowPreLastItem(true);
        isProcessingRef.current = false;
        prevIsOverflowingRef.current = false;
    }, [breadCrumbsData]);

    // Hide one item when overflowing
    const hideOneItem = useCallback(() => {
        if (visibleFirstItemsCount > 0) {
            setVisibleFirstItemsCount((prev) => Math.max(0, prev - 1));
            return true;
        }
        if (showPreLastItem && breadCrumbsData && breadCrumbsData.length > 1) {
            setShowPreLastItem(false);
            return true;
        }
        return false;
    }, [visibleFirstItemsCount, showPreLastItem, breadCrumbsData]);

    // Restore one item when space available
    const restoreOneItem = useCallback(() => {
        if (!showPreLastItem && breadCrumbsData && breadCrumbsData.length > 1) {
            setShowPreLastItem(true);
            return true;
        }
        if (visibleFirstItemsCount < FIRST_VISIBLE_ITEMS) {
            setVisibleFirstItemsCount((prev) => Math.min(FIRST_VISIBLE_ITEMS, prev + 1));
            return true;
        }
        return false;
    }, [visibleFirstItemsCount, showPreLastItem, breadCrumbsData]);

    // Handle overflow: only act when isOverflowing CHANGES
    useEffect(() => {
        if (!shouldShowEllipsis || !breadCrumbsData) return;

        const wasOverflowing = prevIsOverflowingRef.current;
        const overflowChanged = wasOverflowing !== isOverflowing;
        prevIsOverflowingRef.current = isOverflowing;

        // If we were processing and overflow status changed, we can process again
        if (isProcessingRef.current && overflowChanged) {
            isProcessingRef.current = false;
        }

        // If still processing (waiting for recalculation), do nothing
        if (isProcessingRef.current) {
            return;
        }

        // If overflowing and overflow just detected (or still overflowing after processing completed)
        if (isOverflowing) {
            const didHide = hideOneItem();
            if (didHide) {
                isProcessingRef.current = true; // Wait for next signal
            }
        }
    }, [isOverflowing, shouldShowEllipsis, breadCrumbsData, hideOneItem]);

    // Handle resize out: restore items when container grows and not overflowing
    useEffect(() => {
        if (!shouldShowEllipsis || !breadCrumbsData) return;

        const currentWidth = containerSizes.width;
        const isGrowing = currentWidth > prevContainerWidth.current;
        prevContainerWidth.current = currentWidth;

        // Only try to restore when container is growing and not overflowing
        const hasHiddenItems = visibleFirstItemsCount < FIRST_VISIBLE_ITEMS || !showPreLastItem;

        if (isGrowing && !isOverflowing && hasHiddenItems) {
            const didRestore = restoreOneItem();
            if (didRestore) {
                isProcessingRef.current = true; // Wait for next signal
            }
        }
    }, [
        containerSizes.width,
        isOverflowing,
        shouldShowEllipsis,
        breadCrumbsData,
        visibleFirstItemsCount,
        showPreLastItem,
        restoreOneItem,
        prevContainerWidth.current
    ]);

    // Calculate visible items and menu items based on responsive state
    const { visibleFirstItems, visibleLastItems, menuItems } = useMemo(() => {
        if (!breadCrumbsData || breadCrumbsData.length === 0) {
            return { visibleFirstItems: [], visibleLastItems: [], menuItems: [] };
        }

        if (!shouldShowEllipsis) {
            return { visibleFirstItems: breadCrumbsData, visibleLastItems: [], menuItems: [] };
        }

        const lastItem = breadCrumbsData[breadCrumbsData.length - 1];
        const firstVisible = breadCrumbsData.slice(0, visibleFirstItemsCount);
        const preLastItem =
            showPreLastItem && breadCrumbsData.length > 1 ? breadCrumbsData[breadCrumbsData.length - 2] : null;

        const lastVisible = preLastItem ? [preLastItem, lastItem] : [lastItem];

        // Calculate menu items: everything that's NOT visible
        // First items that were moved to menu (items that should be visible but aren't)
        const hiddenFirstItems =
            visibleFirstItemsCount < FIRST_VISIBLE_ITEMS
                ? breadCrumbsData.slice(visibleFirstItemsCount, FIRST_VISIBLE_ITEMS)
                : [];

        // Middle items between first visible and last visible
        // Always exclude last 2 items (pre-last and last) from middle section
        const menuStart = Math.max(visibleFirstItemsCount, FIRST_VISIBLE_ITEMS);
        const menuEnd = breadCrumbsData.length - 2; // Exclude pre-last and last
        const middleItems = menuStart < menuEnd ? breadCrumbsData.slice(menuStart, menuEnd) : [];

        // Pre-last item if it's hidden
        const hiddenPreLastItem =
            !showPreLastItem && breadCrumbsData.length > 1 ? [breadCrumbsData[breadCrumbsData.length - 2]] : [];

        const allMenuItems = [...hiddenFirstItems, ...middleItems, ...hiddenPreLastItem];

        return {
            visibleFirstItems: firstVisible,
            visibleLastItems: lastVisible,
            menuItems: allMenuItems
        };
    }, [breadCrumbsData, shouldShowEllipsis, visibleFirstItemsCount, showPreLastItem]);

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
                                const originalIndex = breadCrumbsData.findIndex(
                                    (bItem) => bItem.path === item.path && bItem.title === item.title
                                );
                                return renderBreadcrumbItem(item, originalIndex, false);
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
                                <ChevronRight size={24} />
                            </li>
                            {/* Last visible items (pre-last and last, or just last) */}
                            {visibleLastItems.map((item) => {
                                const originalIndex = breadCrumbsData.findIndex(
                                    (bItem) => bItem.path === item.path && bItem.title === item.title
                                );
                                const isLastItem = originalIndex === breadCrumbsData.length - 1;
                                return renderBreadcrumbItem(item, originalIndex, isLastItem);
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
