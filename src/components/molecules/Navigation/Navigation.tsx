import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Magnifier, ThreeDotsHorizontal } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Popover, { IPopoverRef } from "@components/atoms/Popover/Popover";
import PopoverBody from "@components/atoms/Popover/PopoverBody";
import Scrollbar from "@components/atoms/Scrollbar";
import NavigationItem from "@components/molecules/Navigation/NavigationItem";
import NavigationColItem from "@components/molecules/Navigation/NavigattionColItem";

import { useWindowSize } from "@hooks/index";

// Styles
import "./Navigation.scss";

import { Divider } from "../../../index";

interface INavigationData {
    title: string;
    Icon?: FC;
    path?: string;
    children?: INavigationData[];
}

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    open?: boolean;
    navigationData?: INavigationData[];
    activePath?: string | null;
    onClick?: (path: string) => void;
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
            <span key={itemKey}>
                <NavigationItem
                    title={item.title}
                    path={item.path}
                    depth={depth}
                    Icon={item.Icon}
                    onClick={onClick}
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
            </span>
        );
    });
};

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({ className, open, navigationData = [], activePath, onClick }) => {
    const [currentDataIndex, setCurrentDataIndex] = useState<number | null>(null);
    const [hoverDataIndex, setHoverDataIndex] = useState<number | null>(null);
    const [isNavigationOpen, setIsNavigationOpen] = useState<boolean | null>(null);
    const [maxVisibleItems, setMaxVisibleItems] = useState<number>(0);
    const [activePathIndex, setActivePathIndex] = useState<number[] | null>(null);
    // const [clonedNavigationData, setClonedNavigationData] = useState<INavigationData[] | null>(
    //     navigationData ? [...navigationData] : null
    // );

    const navColRef = useRef<HTMLDivElement | null>(null);
    const [propsForPopover, setPropsForPopover] = useState({});
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const { height } = useWindowSize();

    useEffect(() => {
        setIsNavigationOpen((prev) => {
            if (open && prev) {
                return false;
            }
            if (open) {
                return true;
            }

            if (prev && !open) {
                return false;
            }

            if (prev) {
                return false;
            }

            return prev !== null;
        });
    }, [open]);

    useEffect(() => {
        if (navColRef.current) {
            const { scrollWidth, offsetWidth } = navColRef.current;
            if (scrollWidth > offsetWidth) {
                const containerHeight = navColRef.current.offsetHeight;
                const ELEMENT_HEIGHT = 68;
                const maxVisibleItemsWithGap = Math.floor(containerHeight / ELEMENT_HEIGHT);
                setMaxVisibleItems(maxVisibleItemsWithGap);
                // console.log(maxVisibleItems, navigationData?.length, 1111);
                // console.log(currentDataIndex);
            }
        }
    }, [navColRef.current, navigationData, height]);

    useEffect(() => {
        setActivePathIndex(findPath(navigationData || [], activePath || ""));
    }, [activePath, navigationData]);

    const onMouseEnterHandler = (index: number) => {
        if (isNavigationOpen) return;
        if (hasDataAndChildren(navigationData, index)) {
            setHoverDataIndex(index);
        } else {
            setHoverDataIndex(null);
        }
    };
    const onNavigationColItemClick = (index: number, path?: string) => {
        setCurrentDataIndex(index);
        if (hasDataAndChildren(navigationData, index)) {
            setIsNavigationOpen(true);
        }
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
                setIsNavigationOpen(true);
            }
        }
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            <div className="navigation__col">
                <div className="navigation__col_wrapper">
                    <div className="navigation__colItemsWrapper" ref={navColRef}>
                        {navigationData?.map(({ Icon, title, path }, index) => {
                            return (
                                <span key={`${title}-${path}`}>
                                    <NavigationColItem
                                        isVisible={index < maxVisibleItems}
                                        Icon={Icon}
                                        title={title}
                                        onClick={onNavigationColItemClick}
                                        index={index}
                                        path={path}
                                        opened={currentDataIndex === index}
                                        selected={index === activePathIndex?.[0]}
                                        onMouseEnter={onMouseEnterHandler}
                                        propsForPopover={hoverDataIndex === index ? propsForPopover : {}}
                                    />
                                    {hoverDataIndex !== null && hasDataAndChildren(navigationData, hoverDataIndex) && (
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
                                                        data={navigationData[hoverDataIndex]}
                                                        onClick={onItemClickHandler}
                                                        activePathIndex={
                                                            activePathIndex && hoverDataIndex === activePathIndex[0]
                                                                ? activePathIndex.slice(1)
                                                                : null
                                                        }
                                                    />
                                                </div>
                                            </PopoverBody>
                                        </Popover>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                    <NavigationColItem Icon={ThreeDotsHorizontal} title="more" isVisible />
                    <Button
                        onClick={() => {}}
                        Icon={Magnifier}
                        size="large"
                        appearance="secondary"
                        className="navigation__addButton"
                    />
                </div>
                <Divider className="navigation__divider" vertical />
            </div>
            {isNavigationOpen && currentDataIndex !== null && hasDataAndChildren(navigationData, currentDataIndex) && (
                <div className="navigation__menu">
                    <Scrollbar>
                        <div className="navigation__menu_wrapper">
                            <NavMenuContent
                                data={navigationData[currentDataIndex]}
                                onClick={onItemClickHandler}
                                activePathIndex={
                                    activePathIndex && currentDataIndex === activePathIndex[0]
                                        ? activePathIndex.slice(1)
                                        : null
                                }
                            />
                        </div>
                    </Scrollbar>
                    <Divider className="navigation__divider" vertical />
                </div>
            )}
        </div>
    );
};

export { INavigationProps, Navigation as default };
