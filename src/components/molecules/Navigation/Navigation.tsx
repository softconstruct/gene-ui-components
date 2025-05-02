import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { IconProps, Magnifier, ThreeDotsHorizontal } from "@geneui/icons";

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
    children?: INavigationChildrenProps[];
}

interface INavigationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    open?: boolean;
    navigationData?: {
        title: string;
        Icon: FC<IconProps>;
        children?: INavigationChildrenProps[];
    }[];
}

const NavMenuContent: FC<{ data: INavigationChildrenProps; depth?: number }> = ({ data, depth = 0 }) => {
    return data.children?.map((item) => {
        return (
            <NavigationItem title={item.title} depth={depth} Icon={item.Icon}>
                {item.children && <NavMenuContent data={item} depth={depth + 1} />}
            </NavigationItem>
        );
    });
};

/**
 * Navigation is a vertical component that appears on the left side of a user interface. It provides users with quick access to key features.
 */
const Navigation: FC<INavigationProps> = ({ className, open, navigationData }) => {
    const [currentDataIndex, setCurrentDataIndex] = useState<number | null>(null);
    const [hoverDataIndex, setHoverDataIndex] = useState<number | null>(null);
    const [isNavigationOpen, setIsNavigationOpen] = useState<boolean | null>(null);
    // const [mouseOver, setMouseOver] = useState(false);
    const [propsForPopover, setPropsForPopover] = useState({});
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useEffect(() => {
        setIsNavigationOpen((prev) => {
            if ((open && prev) || (prev && !open) || prev) {
                return false;
            }
            if (open) {
                return true;
            }
            return open || prev !== null;
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

    const onNavigationColItemClick = (index: number) => {
        setCurrentDataIndex(index);
        setIsNavigationOpen(true);
        setHoverDataIndex(null);
    };

    const onMouseEnterHandler = (index: number) => {
        if (isNavigationOpen) return;
        setHoverDataIndex(index);
    };
    const onMouseLeaveHandler = () => {
        // setHoverDataIndex(null);
    };

    return (
        <div className={classNames("navigation", className)} role="navigation">
            <div className="navigation__col">
                <div className="navigation__col_wrapper">
                    {navigationData?.map(({ Icon, title }, index) => {
                        return (
                            <>
                                <NavigationColItem
                                    Icon={Icon}
                                    title={title}
                                    onClick={onNavigationColItemClick}
                                    index={index}
                                    opened={currentDataIndex === index}
                                    active={index === 4}
                                    onMouseEnter={onMouseEnterHandler}
                                    onMouseLeave={onMouseLeaveHandler}
                                    {...(hoverDataIndex === index ? { propsForPopover } : {})}
                                />
                                <Popover
                                    setProps={setPropsForPopover}
                                    size="small"
                                    position="right-top"
                                    withArrow
                                    margin={20}
                                    disableReposition
                                    ref={popoverRef}
                                    // defaultOpen={index === hoverDataIndex}
                                    open={hoverDataIndex === index && !isNavigationOpen}
                                >
                                    <PopoverBody withPadding={false}>
                                        <div className="navigation__menu_wrapper">
                                            {navigationData && hoverDataIndex !== null && (
                                                <NavMenuContent data={navigationData[hoverDataIndex]} />
                                            )}
                                        </div>
                                    </PopoverBody>
                                </Popover>
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
            {isNavigationOpen && (
                <div className="navigation__menu">
                    <Scrollbar>
                        <div className="navigation__menu_wrapper">
                            {navigationData && currentDataIndex !== null && (
                                <NavMenuContent data={navigationData[currentDataIndex]} />
                            )}
                        </div>
                    </Scrollbar>
                    <Divider className="navigation__divider" vertical />
                </div>
            )}
        </div>
    );
};

export { INavigationProps, Navigation as default };
