import React, { FC, Fragment, ReactNode, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Plus, ThreeDotsHorizontal, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Popover, { IPopoverRef } from "@components/atoms/Popover/Popover";
import PopoverBody from "@components/atoms/Popover/PopoverBody";
import Scrollbar from "@components/atoms/Scrollbar";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import NavigationItem from "@components/molecules/Navigation/NavigationItem";
import NavigationMenuHeader from "@components/molecules/Navigation/NavigationMenuHeader";
import NavigationMobile from "@components/molecules/Navigation/NavigationMobile/NavigationMobile";
import NavigationColItem from "@components/molecules/Navigation/NavigattionColItem";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import { useWindowSize } from "@hooks/index";

// Styles
import "./Navigation.scss";

const ELEMENT_HEIGHT = 62;
const ELEMENT_HEIGHT_COMPACT = 48;

export interface INavigationData {
    title: string;
    Icon?: FC;
    path?: string;
    children?: INavigationData[];
    disabled?: boolean;
}

export type INavigationCreateData = Omit<IMenuItemProps, "children">;

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controls whether the navigation is forced open.
     */
    open?: boolean;
    /**
     * Callback when the navigation open state changes. Used for mobile navigation control.
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Array of navigation items data.
     */
    navigationData?: INavigationData[];
    /**
     * Data for items shown in the create/add menu.
     */
    navigationCreateData?: INavigationCreateData[];
    /**
     * Currently active navigation path.
     */
    activePath?: string | null;
    /**
     * Called when a navigation item is clicked.
     */
    onClick?: (path: string) => void;
    /**
     * Called when a create menu item is clicked.
     */
    onNavigationCreateDataClick?: (item: INavigationCreateData) => void;
    /**
     * Optional custom title for the "More" menu.
     */
    moreMenuTitle?: string;
    /**
     * Custom render function for navigation links.
     */
    render?: (linkData: {
        path?: string;
        title?: string;
        isActive?: boolean;
        hasChildren?: boolean;
        isDisabled?: boolean;
        Icon?: FC;
    }) => ReactNode;
    /**
     * Hides item titles, showing only icons with tooltips for a compact layout.
     */
    compact?: boolean;
    /**
     * Text for the mobile create button. If not provided, only the Plus icon will be shown.
     */
    createButtonText?: string;
}

export const findPath = (
    navigationData: INavigationData[],
    targetPath: string,
    currentPath: number[] = []
): number[] | null => {
    for (let i = 0; i < navigationData.length; i++) {
        const item = navigationData[i];

        if (item.path === targetPath) {
            return [...currentPath, i];
        }

        if (item.children) {
            const result = findPath(item.children, targetPath, [...currentPath, i]);
            if (result) {
                return result;
            }
        }
    }

    return null;
};

const hasDataAndChildren = (data: INavigationData[] | undefined, index: number | null): boolean => {
    return !!(data && index !== null && data[index]?.children && data[index].children?.length > 0);
};

const NavMenuContent: FC<{
    data?: INavigationData | null;
    depth?: number;
    onClick: (path: string) => void;
    activePathIndex?: number[] | null;
    render?: INavigationProps["render"];
}> = ({ data, depth = 0, onClick, activePathIndex, render }) => {
    if (!data) return null;
    return data.children?.map((item, index) => {
        const itemKey = `${item.title}-${item.path}`;
        return (
            <Fragment key={itemKey}>
                <NavigationItem
                    title={item.title}
                    path={item.path}
                    depth={depth}
                    Icon={item.Icon}
                    onClick={onClick}
                    disabled={item.disabled}
                    selected={index === activePathIndex?.[0]}
                    render={render}
                >
                    {item.children && (
                        <NavMenuContent
                            data={item}
                            depth={depth + 1}
                            onClick={onClick}
                            activePathIndex={activePathIndex?.slice(1)}
                            render={render}
                        />
                    )}
                </NavigationItem>
            </Fragment>
        );
    });
};

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({
    className,
    open,
    onOpenChange,
    navigationData = [],
    activePath,
    onClick,
    navigationCreateData,
    onNavigationCreateDataClick,
    moreMenuTitle = "More",
    render,
    compact = false,
    createButtonText
}) => {
    const [currentDataIndex, setCurrentDataIndex] = useState<number | null>(null);
    const [hoverDataIndex, setHoverDataIndex] = useState<number | null>(null);
    const [forceOpen, setForceOpen] = useState<boolean>(false);
    const [maxVisibleItems, setMaxVisibleItems] = useState<number>(0);
    const [activePathIndex, setActivePathIndex] = useState<number[] | null>(null);
    const [clonedNavigationData, setClonedNavigationData] = useState<INavigationData[]>([]);
    const navColRef = useRef<HTMLDivElement | null>(null);
    const [propsForPopover, setPropsForPopover] = useState({});
    const [propsForCreatePopover, setPropsForCreatePopover] = useState({});
    const [menuData, setMenuData] = useState<INavigationData[]>([]);
    const [menuPropsForPopover, setMenuPropsForPopover] = useState({});
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;
    const { height } = useWindowSize();

    const openFromInside = () => {
        setForceOpen(true);
    };

    useEffect(() => {
        if (!isMobileBreakpoint) {
            setForceOpen(!forceOpen);
        }
    }, [open]);

    useEffect(() => {
        if (!isMobileBreakpoint) {
            setForceOpen(!!open);
        }
    }, []);

    useEffect(() => {
        if (!isMobileBreakpoint) {
            setForceOpen(false);
            setCurrentDataIndex(null);
            setHoverDataIndex(null);
        }
    }, [isMobileBreakpoint]);

    useEffect(() => {
        if (forceOpen && currentDataIndex !== null) {
            setHoverDataIndex(null);
        }
        if (activePathIndex && currentDataIndex === null) {
            setCurrentDataIndex(activePathIndex[0]);
        }
    }, [forceOpen, hoverDataIndex, currentDataIndex, activePathIndex]);

    useEffect(() => {
        setClonedNavigationData(Array.isArray(navigationData) ? navigationData : []);
    }, [navigationData]);

    useEffect(() => {
        const menuSliceData = clonedNavigationData.slice(maxVisibleItems);
        setMenuData(menuSliceData);
    }, [maxVisibleItems, clonedNavigationData]);

    useEffect(() => {
        const navColRefCurrent = navColRef.current;
        if (navColRefCurrent) {
            const { scrollWidth, offsetWidth } = navColRefCurrent;
            if (scrollWidth > offsetWidth) {
                const containerHeight = navColRefCurrent.offsetHeight;

                const maxVisibleItemsWithGap = Math.floor(
                    containerHeight / (compact ? ELEMENT_HEIGHT_COMPACT : ELEMENT_HEIGHT)
                );
                setMaxVisibleItems(maxVisibleItemsWithGap);
            } else {
                setMaxVisibleItems(clonedNavigationData.length);
            }
        }
    }, [navColRef, clonedNavigationData, height, compact]);

    useEffect(() => {
        const lastVisibleItemIndex = maxVisibleItems - 1;
        if (lastVisibleItemIndex === -1) return;
        if (currentDataIndex !== null && currentDataIndex > lastVisibleItemIndex) {
            const newData = [...clonedNavigationData];
            const [activeItem] = newData.splice(currentDataIndex, 1);
            newData.splice(lastVisibleItemIndex, 0, activeItem);
            setCurrentDataIndex(lastVisibleItemIndex);
            setClonedNavigationData(newData);
        } else if (
            activePathIndex &&
            activePathIndex[0] > lastVisibleItemIndex &&
            (currentDataIndex === null || currentDataIndex !== lastVisibleItemIndex)
        ) {
            const newData = [...navigationData];
            const [activeItem] = newData.splice(activePathIndex[0], 1);

            newData.splice(lastVisibleItemIndex, 0, activeItem);
            setClonedNavigationData(newData);
        }
    }, [maxVisibleItems, currentDataIndex, activePathIndex, height, navigationData]);

    useEffect(() => {
        // For mobile, calculate from original navigationData since mobile doesn't use clonedNavigationData
        const dataSource = isMobileBreakpoint ? navigationData : clonedNavigationData;
        setActivePathIndex(findPath(dataSource || [], activePath || ""));
    }, [activePath, clonedNavigationData, navigationData, isMobileBreakpoint]);

    const onMouseEnterHandler = (index: number) => {
        if (forceOpen) return;
        if (hasDataAndChildren(clonedNavigationData, index)) {
            setHoverDataIndex(index);
        } else {
            setHoverDataIndex(null);
        }
    };
    const onNavigationColItemClick = (index: number, path?: string) => {
        setCurrentDataIndex(index);
        setForceOpen(hasDataAndChildren(clonedNavigationData, index));
        setHoverDataIndex(null);

        if (path && onClick) {
            onClick(path);
        }
    };

    const onItemClickHandler = (path?: string) => {
        if (path && onClick) {
            onClick(path);
            if (hoverDataIndex !== null) {
                setHoverDataIndex(null);
                setCurrentDataIndex(hoverDataIndex);
                openFromInside();
            }
        }
    };

    const onMoreMenuItemsClickHandler = (menuItemProps: IMenuItemProps) => {
        const indexInMenuData = Number(menuItemProps.id);
        const originalIndex = maxVisibleItems + indexInMenuData;
        const clickedItem = clonedNavigationData[originalIndex];

        if (!clickedItem) return;

        setCurrentDataIndex(originalIndex);
        setForceOpen(hasDataAndChildren(clonedNavigationData, originalIndex));
        setHoverDataIndex(null);

        if (clickedItem.path && onClick) {
            onClick(clickedItem.path);
        }
    };

    const onNavigationCreateDataClickHandler = (item: INavigationCreateData) => onNavigationCreateDataClick?.(item);

    const onCreateMenuClickHandler = (isOpen: boolean) => {
        setIsCreateMenuOpen(isOpen);
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            {isMobileBreakpoint ? (
                <NavigationMobile
                    open={!!open}
                    onClose={() => onOpenChange?.(false)}
                    navigationData={navigationData}
                    navigationCreateData={navigationCreateData}
                    onClick={onClick}
                    onNavigationCreateDataClick={onNavigationCreateDataClick}
                    render={render}
                    activePathIndex={activePathIndex}
                    createButtonText={createButtonText}
                />
            ) : (
                <>
                    <nav className="navigation__list">
                        <div className="navigation__listWrapper">
                            <div className="navigation__listItems" ref={navColRef}>
                                {clonedNavigationData?.map((item, index) => (
                                    <Fragment key={`${item.title}-${item.path}`}>
                                        <NavigationColItem
                                            isVisible={index < maxVisibleItems}
                                            Icon={item.Icon}
                                            title={item.title}
                                            onClick={onNavigationColItemClick}
                                            index={index}
                                            path={item.path}
                                            opened={forceOpen}
                                            currentSelected={currentDataIndex === index}
                                            selected={index === activePathIndex?.[0]}
                                            onMouseEnter={onMouseEnterHandler}
                                            disabled={item.disabled}
                                            propsForPopover={hoverDataIndex === index ? propsForPopover : {}}
                                            hasChildren={item.children && item.children.length > 0}
                                            render={render}
                                            compact={compact}
                                        />
                                        {hoverDataIndex !== null && item.children && item.children.length > 0 && (
                                            <Popover
                                                setProps={setPropsForPopover}
                                                size="small"
                                                position="right-top"
                                                withArrow
                                                trigger="hover"
                                                margin={20}
                                                disableReposition={false}
                                                ref={popoverRef}
                                            >
                                                <PopoverBody
                                                    withPadding={false}
                                                    withScrollbar={false}
                                                    className="navigation__content"
                                                >
                                                    <NavigationMenuHeader
                                                        title={clonedNavigationData[hoverDataIndex].title}
                                                    />
                                                    <Scrollbar>
                                                        <div className="navigation__items">
                                                            <NavMenuContent
                                                                data={clonedNavigationData[hoverDataIndex]}
                                                                onClick={onItemClickHandler}
                                                                activePathIndex={
                                                                    activePathIndex &&
                                                                    hoverDataIndex === activePathIndex[0]
                                                                        ? activePathIndex.slice(1)
                                                                        : null
                                                                }
                                                                render={render}
                                                            />
                                                        </div>
                                                    </Scrollbar>
                                                </PopoverBody>
                                            </Popover>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                            {clonedNavigationData.length > maxVisibleItems && (
                                <>
                                    <NavigationColItem
                                        Icon={ThreeDotsHorizontal}
                                        title={moreMenuTitle}
                                        isVisible
                                        propsForPopover={menuPropsForPopover}
                                    />
                                    <Menu
                                        position="right-bottom"
                                        onChange={onMoreMenuItemsClickHandler}
                                        setPropsForPopover={setMenuPropsForPopover}
                                    >
                                        {menuData.map((item, index) => {
                                            const isParentItem = !!item.children && item.children.length > 0;

                                            const menuItemRender =
                                                render && item.path && !isParentItem
                                                    ? (menuLinkData: { id: string | number; title?: string }) =>
                                                          render({
                                                              path: item.path,
                                                              title: menuLinkData.title,
                                                              isActive: activePath === item.path,
                                                              hasChildren: isParentItem,
                                                              isDisabled: item.disabled,
                                                              Icon: item.Icon
                                                          })
                                                    : undefined;

                                            return (
                                                <MenuItem
                                                    key={`menuitem-${item.title}-${item.path || index}`}
                                                    id={index}
                                                    IconBefore={item.Icon}
                                                    selected={activePath === item.path}
                                                    disabled={item.disabled}
                                                    render={menuItemRender}
                                                >
                                                    {item.title}
                                                </MenuItem>
                                            );
                                        })}
                                    </Menu>
                                </>
                            )}
                            {navigationCreateData && (
                                <>
                                    <Button
                                        onClick={() => {}}
                                        Icon={isCreateMenuOpen ? X : Plus}
                                        size="large"
                                        appearance="secondary"
                                        className="navigation__addButton"
                                        {...propsForCreatePopover}
                                    />
                                    <Menu
                                        position="right-bottom"
                                        onChange={onNavigationCreateDataClickHandler}
                                        setPropsForPopover={setPropsForCreatePopover}
                                        onOpenChange={onCreateMenuClickHandler}
                                    >
                                        {navigationCreateData.map((props: IMenuItemProps, index) => {
                                            const { title, ...rest } = props;
                                            return (
                                                <MenuItem {...rest} key={`create-${title}-${props.id || index}`}>
                                                    {title}
                                                </MenuItem>
                                            );
                                        })}
                                    </Menu>
                                </>
                            )}
                        </div>
                    </nav>
                    {forceOpen &&
                        currentDataIndex !== null &&
                        hasDataAndChildren(clonedNavigationData, currentDataIndex) && (
                            <div className="navigation__menu">
                                <NavigationMenuHeader title={clonedNavigationData[currentDataIndex]?.title} />
                                <Scrollbar>
                                    <div className="navigation__menu_wrapper">
                                        <NavMenuContent
                                            data={clonedNavigationData[currentDataIndex]}
                                            onClick={onItemClickHandler}
                                            activePathIndex={
                                                activePathIndex && currentDataIndex === activePathIndex[0]
                                                    ? activePathIndex.slice(1)
                                                    : null
                                            }
                                            render={render}
                                        />
                                    </div>
                                </Scrollbar>
                            </div>
                        )}
                </>
            )}
        </div>
    );
};

export { INavigationProps, Navigation as default };
