import React, { FC, Fragment, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Plus, ThreeDotsHorizontal, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Popover, { IPopoverRef } from "@components/atoms/Popover/Popover";
import PopoverBody from "@components/atoms/Popover/PopoverBody";
import Scrollbar from "@components/atoms/Scrollbar";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import NavigationItem from "@components/molecules/Navigation/NavigationItem";
import NavigationColItem from "@components/molecules/Navigation/NavigattionColItem";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import { useWindowSize } from "@hooks/index";

// Styles
import "./Navigation.scss";

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
}> = ({ data, depth = 0, onClick, activePathIndex }) => {
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
                >
                    {item.children && (
                        <NavMenuContent
                            data={item}
                            depth={depth + 1}
                            onClick={onClick}
                            activePathIndex={activePathIndex?.slice(1)}
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
    navigationData = [],
    activePath,
    onClick,
    navigationCreateData,
    onNavigationCreateDataClick,
    moreMenuTitle = "More"
}) => {
    const [currentDataIndex, setCurrentDataIndex] = useState<number | null>(null);
    const [hoverDataIndex, setHoverDataIndex] = useState<number | null>(null);
    const [forceOpen, setForceOpen] = useState<boolean>(false);
    const [maxVisibleItems, setMaxVisibleItems] = useState<number>(0);
    const [activePathIndex, setActivePathIndex] = useState<number[] | null>(null);
    const [moreMenuDataActiveIndex, setMoreMenuDataActiveIndex] = useState<number>(-1);
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
        setForceOpen(!forceOpen);
    }, [open]);

    useEffect(() => {
        setForceOpen(!!open);
    }, []);

    useEffect(() => {
        if (forceOpen && currentDataIndex !== null) {
            setHoverDataIndex(null);
        }
        if (activePathIndex && currentDataIndex === null) {
            setCurrentDataIndex(activePathIndex[0]);
        }
    }, [forceOpen, hoverDataIndex, currentDataIndex, activePathIndex]);

    useEffect(() => {
        setClonedNavigationData(navigationData);
    }, [navigationData]);

    useEffect(() => {
        const menuSliceData = clonedNavigationData.slice(maxVisibleItems);
        setMenuData(menuSliceData);
    }, [maxVisibleItems, clonedNavigationData]);

    useEffect(() => {
        if (navColRef.current) {
            const { scrollWidth, offsetWidth } = navColRef.current;
            if (scrollWidth > offsetWidth) {
                const containerHeight = navColRef.current.offsetHeight;
                const ELEMENT_HEIGHT = 62;
                const maxVisibleItemsWithGap = Math.floor(containerHeight / ELEMENT_HEIGHT);
                setMaxVisibleItems(maxVisibleItemsWithGap);
            } else {
                setMaxVisibleItems(clonedNavigationData.length);
            }
        }
    }, [navColRef.current, clonedNavigationData, height]);

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
        setActivePathIndex(findPath(clonedNavigationData || [], activePath || ""));
    }, [activePath, clonedNavigationData]);

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

    const onMoreMenuItemsClickHandler = (item: IMenuItemProps) => {
        const foundedItem = navigationData.find((data) => {
            return !Array.isArray(item.children) && item.children === data.title;
        });
        const index = maxVisibleItems + +item.id;
        setCurrentDataIndex(index);
        setForceOpen(hasDataAndChildren(clonedNavigationData, index));
        setHoverDataIndex(null);
        if (foundedItem?.path && onClick) {
            onClick(foundedItem.path);
        }
        setActivePathIndex([maxVisibleItems - 1]);
    };

    const onNavigationCreateDataClickHandler = (item: INavigationCreateData) => onNavigationCreateDataClick?.(item);

    useEffect(() => {
        if (!(clonedNavigationData.length > maxVisibleItems)) return;
        const index = activePathIndex?.[0];
        if (typeof index === "number" && index >= maxVisibleItems) {
            setMoreMenuDataActiveIndex(maxVisibleItems - index);
        } else {
            setMoreMenuDataActiveIndex(-1);
        }
    }, [maxVisibleItems, activePathIndex]);

    const onCreateMenuClickHandler = (isOpen: boolean) => {
        setIsCreateMenuOpen(isOpen);
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            {isMobileBreakpoint ? (
                // todo create navigation mobile
                <div>Mobile Navigation</div>
            ) : (
                <>
                    <nav className="navigation__list">
                        <div className="navigation__listWrapper">
                            <div className="navigation__listItems" ref={navColRef}>
                                {clonedNavigationData?.map((item, index) => {
                                    return (
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
                                                    <PopoverBody withPadding={false}>
                                                        <div className="navigation__menu_wrapper">
                                                            <NavMenuContent
                                                                data={clonedNavigationData[hoverDataIndex]}
                                                                onClick={onItemClickHandler}
                                                                activePathIndex={
                                                                    activePathIndex &&
                                                                    hoverDataIndex === activePathIndex[0]
                                                                        ? activePathIndex.slice(1)
                                                                        : null
                                                                }
                                                            />
                                                        </div>
                                                    </PopoverBody>
                                                </Popover>
                                            )}
                                        </Fragment>
                                    );
                                })}
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
                                        {menuData.map(({ Icon, title, disabled }, index) => {
                                            return (
                                                <MenuItem
                                                    id={index}
                                                    IconBefore={Icon}
                                                    selected={index === moreMenuDataActiveIndex}
                                                    disabled={disabled}
                                                >
                                                    {title}
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
                                        {navigationCreateData.map((props: IMenuItemProps) => {
                                            const { title, ...rest } = props;
                                            return <MenuItem {...rest}>{title}</MenuItem>;
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
