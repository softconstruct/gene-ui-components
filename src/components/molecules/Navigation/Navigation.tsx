import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Magnifier, ThreeDotsHorizontal } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Popover, { IPopoverRef } from "@components/atoms/Popover/Popover";
import PopoverBody from "@components/atoms/Popover/PopoverBody";
import Scrollbar from "@components/atoms/Scrollbar";
import NavigationItem from "@components/molecules/Navigation/NavigationItem";
import NavigationColItem from "@components/molecules/Navigation/NavigattionColItem";

import { useClickOutside } from "@hooks/index";

// Styles
import "./Navigation.scss";

import { Divider } from "../../../index";

interface INavigationChildrenProps {
    title: string;
    Icon?: FC;
    path?: string;
    children?: INavigationChildrenProps[];
}

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    open?: boolean;
    navigationData?: INavigationChildrenProps[];
    activePath?: string | null;
    onClick?: (path: string) => void;
}

export const findPath = (
    navigationData: INavigationChildrenProps[],
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

const NavMenuContent: FC<{
    data: INavigationChildrenProps;
    depth?: number;
    onClick: (path: string) => void;
    activePathIndex?: number[] | null;
}> = ({ data, depth = 0, onClick, activePathIndex }) => {
    return data.children?.map((item, index) => {
        return (
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
        );
    });
};

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({ className, open, navigationData, activePath, onClick }) => {
    const [currentDataIndex, setCurrentDataIndex] = useState<number | null>(null);
    const [hoverDataIndex, setHoverDataIndex] = useState<number | null>(null);
    const [isNavigationOpen, setIsNavigationOpen] = useState<boolean | null>(null);
    const [activePathIndex, setActivePathIndex] = useState<number[] | null>(null);
    const [propsForPopover, setPropsForPopover] = useState({});
    const popoverRef = useRef<{ current: IPopoverRef }>({
        current: {
            floatingElement: { current: null },
            referenceElement: { current: null }
        }
    });

    useEffect(() => {
        setIsNavigationOpen((prev) => {
            // if ((open && prev) || (prev && !open) || prev) {
            //     return false;
            // }
            // if (open) {
            //     return true;
            // }
            // return open || prev !== null;

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

    useClickOutside(
        (e) => {
            if (isNavigationOpen) return;
            const el = popoverRef.current?.floatingElement?.current;
            if (el instanceof HTMLElement && !el.contains(e.target as Node)) {
                setHoverDataIndex(null);
            }
        },
        [popoverRef?.current?.floatingElement, popoverRef?.current?.referenceElement]
    );

    const onNavigationColItemClick = (index: number, path?: string) => {
        setCurrentDataIndex(index);
        if (navigationData && navigationData[index]?.children?.length > 0) {
            setIsNavigationOpen(true);
        }
        setHoverDataIndex(null);
        if (path && onClick) {
            onClick(path);
        }
    };

    useEffect(() => {
        setActivePathIndex(findPath(navigationData || [], activePath || ""));
    }, [activePath]);

    const onMouseEnterHandler = (index: number) => {
        if (isNavigationOpen) return;
        setHoverDataIndex(index);
    };
    const onItemClickHandler = (path?: string) => {
        if (path && onClick) {
            onClick(path);
            if (hoverDataIndex !== null) {
                setHoverDataIndex(null);
            }
        }
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            <div className="navigation__col">
                <div className="navigation__col_wrapper">
                    {navigationData?.map(({ Icon, title, path }, index) => {
                        return (
                            <>
                                <NavigationColItem
                                    Icon={Icon}
                                    title={title}
                                    onClick={onNavigationColItemClick}
                                    index={index}
                                    path={path}
                                    opened={currentDataIndex === index}
                                    active={index === activePathIndex?.[0]}
                                    onMouseEnter={onMouseEnterHandler}
                                    {...(hoverDataIndex === index ? { propsForPopover } : {})}
                                />
                                {navigationData &&
                                    hoverDataIndex !== null &&
                                    navigationData[hoverDataIndex].children?.length > 0 && (
                                        <Popover
                                            setProps={setPropsForPopover}
                                            size="small"
                                            position="right-top"
                                            withArrow
                                            margin={20}
                                            disableReposition
                                            ref={popoverRef}
                                            open={hoverDataIndex === index && !isNavigationOpen}
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
                            </>
                        );
                    })}
                    <NavigationColItem Icon={ThreeDotsHorizontal} title="more" />
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
            {isNavigationOpen &&
                navigationData &&
                currentDataIndex !== null &&
                navigationData[currentDataIndex].children?.length > 0 && (
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
