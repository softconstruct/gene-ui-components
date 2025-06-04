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
    const [forceOpen, setForceOpen] = useState<boolean>(false);
    const [dataIsReordered, setDataIsReordered] = useState<boolean>(false);
    const [maxVisibleItems, setMaxVisibleItems] = useState<number>(0);
    const [activePathIndex, setActivePathIndex] = useState<number[] | null>(null);
    const [clonedNavigationData, setClonedNavigationData] = useState<INavigationData[]>([]);

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
        setClonedNavigationData(navigationData);
    }, [navigationData]);

    const navColRef = useRef<HTMLDivElement | null>(null);
    const [propsForPopover, setPropsForPopover] = useState({});
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const { height } = useWindowSize();

    const setDefaultNavData = () => {
        if (
            maxVisibleItems - 1 < clonedNavigationData.length &&
            currentDataIndex !== null &&
            currentDataIndex < maxVisibleItems - 1 &&
            dataIsReordered
        ) {
            setClonedNavigationData(navigationData);
            setDataIsReordered(false);
        }
    };

    useEffect(() => {
        if (navColRef.current) {
            const { scrollWidth, offsetWidth } = navColRef.current;
            if (scrollWidth > offsetWidth) {
                const containerHeight = navColRef.current.offsetHeight;
                const ELEMENT_HEIGHT = 68;
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
            const newData = [...navigationData];
            const [activeItem] = newData.splice(currentDataIndex, 1);
            newData.splice(lastVisibleItemIndex, 0, activeItem);
            setCurrentDataIndex(lastVisibleItemIndex);
            setClonedNavigationData(newData);
            setDataIsReordered(true);
        } else if (
            activePathIndex &&
            activePathIndex[0] > lastVisibleItemIndex &&
            (currentDataIndex === null || currentDataIndex !== lastVisibleItemIndex)
        ) {
            const newData = [...navigationData];
            const [activeItem] = newData.splice(activePathIndex[0], 1);

            newData.splice(lastVisibleItemIndex, 0, activeItem);
            setClonedNavigationData(newData);
            setDataIsReordered(true);
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
        if (hasDataAndChildren(clonedNavigationData, index)) {
            openFromInside();
        }
        setHoverDataIndex(null);
        if (path && onClick) {
            onClick(path);
        }

        setDefaultNavData();
    };

    const onItemClickHandler = (path?: string) => {
        if (path && onClick) {
            onClick(path);
            if (hoverDataIndex !== null) {
                setHoverDataIndex(null);
                setCurrentDataIndex(hoverDataIndex);
                openFromInside();
            }
            setDefaultNavData();
        }
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            <div className="navigation__col">
                <div className="navigation__col_wrapper">
                    <div className="navigation__colItemsWrapper" ref={navColRef}>
                        {clonedNavigationData?.map(({ Icon, title, path }, index) => {
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
                                    {hoverDataIndex !== null &&
                                        hasDataAndChildren(clonedNavigationData, hoverDataIndex) && (
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
                    {clonedNavigationData.length > maxVisibleItems && (
                        <NavigationColItem Icon={ThreeDotsHorizontal} title="more" isVisible />
                    )}
                    <Button
                        onClick={() => {}}
                        Icon={Magnifier}
                        size="large"
                        appearance="secondary"
                        className="navigation__addButton"
                    />
                </div>
                <Divider className="navigation__divider" direction="vertical" />
            </div>
            {forceOpen && currentDataIndex !== null && hasDataAndChildren(clonedNavigationData, currentDataIndex) && (
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
                    <Divider className="navigation__divider" direction="vertical" />
                </div>
            )}
        </div>
    );
};

export { INavigationProps, Navigation as default };
