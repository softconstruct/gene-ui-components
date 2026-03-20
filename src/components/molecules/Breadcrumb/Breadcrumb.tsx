import React, { createContext, FC, ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import { IconProps, LineSlash, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import BreadcrumbItem, { IBreadcrumbItemProps } from "@components/molecules/Breadcrumb/BreadcrumbItem";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useContainerSize from "@hooks/useContainerSize";

// Styles
import "./Breadcrumb.scss";

import { BREADCRUMB_SEPARATOR_SIZE } from "./Breadcrumb.constants";
import { calculateVisibilityConfig, VisibilityConfig } from "./Breadcrumb.helpers";

type IBreadcrumbRender = (linkData: {
    path?: string;
    title?: string;
    isActive?: boolean;
    Icon?: FC<IconProps>;
}) => ReactNode;

type IBreadcrumbClickItem = Pick<IBreadcrumbItemProps, "title" | "path">;

interface IBreadcrumbProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom render function for breadcrumb links.<br />
     *
     * Example:<br />
     * ```tsx```
     * ```render={({ path, title, isActive }) => (```
     *   ``` <a href={path} aria-current={isActive ? "page" : undefined}>
     *     {title}
     *   </a>
     * )}```
     */
    render?: IBreadcrumbRender;
    /**
     * Called when a breadcrumb item is clicked.
     */
    onClick?: (item: IBreadcrumbClickItem) => void;
    /**
     * An array of breadcrumb items to display, in order from root to current page.
     * Each object conforms to the `IBreadcrumbItemProps` interface.
     * Memoize this prop to avoid unnecessary visibility recalculations when the breadcrumb trail changes.
     * @example
     * items={[
     *   { title: 'Home', path: '/' },
     *   { title: 'Products', path: '/products', Icon: Receipt },
     *   { title: 'Current Page' }
     * ]}
     */
    items: IBreadcrumbItemProps[];
    /**
     * If `true`, renders only icons (when provided) and hides text labels.
     * Useful for very compact layouts.
     */
    iconOnly?: boolean;
}

interface IBreadcrumbContextProps {
    iconOnly?: boolean;
    isLastItem?: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbClickItem) => void;
}

export const BreadcrumbContext = createContext<IBreadcrumbContextProps>({} as IBreadcrumbContextProps);

interface BreadcrumbItemWrapperProps {
    props: IBreadcrumbItemProps;
    iconOnly: boolean;
    isLastItem: boolean;
    render?: IBreadcrumbRender;
    onClick?: (item: IBreadcrumbClickItem) => void;
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
const Breadcrumb: FC<IBreadcrumbProps> = ({ className, items = [], iconOnly = false, render, onClick }) => {
    const [menuPropsForPopover, setMenuPropsForPopover] = useState<Record<string, unknown>>({});
    const measureListRef = useRef<HTMLUListElement>(null);

    const { containerRef, sizes } = useContainerSize<HTMLDivElement>({ debounceWait: 100 });
    const containerWidth = sizes.width;

    const itemsCount = items.length;

    const [visibilityConfig, setVisibilityConfig] = useState<VisibilityConfig>({
        fitAll: true,
        firstCount: 0,
        lastCount: 1
    });

    useLayoutEffect(() => {
        const config = calculateVisibilityConfig(containerRef.current, measureListRef.current, itemsCount);
        setVisibilityConfig(config);
    }, [containerWidth, itemsCount, items]);

    const { fitAll, firstCount, lastCount } = visibilityConfig;
    const shouldShowEllipsis = itemsCount > 1 && !fitAll;

    const { visibleFirstItems, visibleLastItems, menuItems } = useMemo(() => {
        if (!items || itemsCount === 0) {
            return { visibleFirstItems: [], visibleLastItems: [], menuItems: [] };
        }

        const total = itemsCount;
        const lastItem = items[total - 1];

        if (!shouldShowEllipsis) {
            const firstVisible = items.slice(0, total - 1);
            const lastVisible = [lastItem];
            return {
                visibleFirstItems: firstVisible,
                visibleLastItems: lastVisible,
                menuItems: []
            };
        }

        const visibleFirst = items.slice(0, firstCount);
        const visibleLast = items.slice(-lastCount);
        const menuItemsSlice = items.slice(firstCount, total - lastCount);

        return {
            visibleFirstItems: visibleFirst,
            visibleLastItems: visibleLast,
            menuItems: menuItemsSlice
        };
    }, [items, itemsCount, shouldShowEllipsis, firstCount, lastCount]);

    const menuSelectHandler = (menuItem: IMenuItemProps) => {
        const selectedItem =
            typeof menuItem.id === "number"
                ? menuItems[menuItem.id]
                : menuItems.find((item) => (item.path || item.title) === menuItem.id);
        if (selectedItem && onClick) {
            onClick({
                title: selectedItem.title,
                path: selectedItem.path
            });
        }
    };

    const renderBreadcrumbItem = (item: IBreadcrumbItemProps, isLastItem: boolean, breadcrumbIndex: number) => (
        <BreadcrumbItemWrapper
            key={breadcrumbIndex}
            props={item}
            iconOnly={iconOnly}
            isLastItem={isLastItem}
            render={render}
            onClick={onClick}
        />
    );

    const showEllipsisTrigger = shouldShowEllipsis && menuItems.length > 0;

    return (
        <div ref={containerRef} className={classNames("breadcrumb", className)}>
            {/* Hidden measurement DOM: all items + ellipsis for width calculation */}
            <div
                className="breadcrumb__measure"
                aria-hidden
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                    left: 0,
                    top: 0
                }}
            >
                <ul ref={measureListRef} className="breadcrumb__list">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        const pathKey = items
                            .slice(0, index + 1)
                            .map((i) => i.path ?? i.title)
                            .join("/");
                        return (
                            <BreadcrumbItemWrapper
                                key={`measure-${pathKey}`}
                                props={item}
                                iconOnly={iconOnly}
                                isLastItem={isLast}
                                render={render}
                                onClick={onClick}
                            />
                        );
                    })}
                    <li className="breadcrumb__item">
                        <Button Icon={ThreeDotsHorizontal} layout="text" appearance="secondary" size="medium" />
                        <LineSlash size={BREADCRUMB_SEPARATOR_SIZE} />
                    </li>
                </ul>
            </div>
            <nav aria-label="breadcrumb navigation">
                <ul className="breadcrumb__list">
                    {visibleFirstItems.map((item, index) => renderBreadcrumbItem(item, false, index))}
                    <li
                        className={classNames("breadcrumb__item", {
                            breadcrumb__item_hidden: !showEllipsisTrigger
                        })}
                    >
                        <Tooltip text="More items" isVisible={iconOnly}>
                            <Button
                                Icon={ThreeDotsHorizontal}
                                layout="text"
                                appearance="secondary"
                                size="medium"
                                {...menuPropsForPopover}
                                aria-label="More breadcrumb items"
                            />
                        </Tooltip>
                        <Menu
                            onChange={menuSelectHandler}
                            setPropsForPopover={setMenuPropsForPopover}
                            position="bottom-right"
                        >
                            {menuItems.map((item, index) => {
                                const itemId = (item.path || item.title) as string;
                                const key = `${itemId}-${index}`;
                                const linkData = {
                                    path: item.path,
                                    title: item.title,
                                    isActive: false,
                                    Icon: item.Icon
                                };
                                return (
                                    <MenuItem
                                        key={key}
                                        id={index}
                                        IconBefore={item.Icon}
                                        render={render ? () => render(linkData) : undefined}
                                    >
                                        {item.title}
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                        <LineSlash size={BREADCRUMB_SEPARATOR_SIZE} />
                    </li>

                    {/* Last visible items */}
                    {visibleLastItems.map((item, index) => {
                        const isLastItem = index === visibleLastItems.length - 1;
                        const breadcrumbIndex = itemsCount - visibleLastItems.length + index;
                        return renderBreadcrumbItem(item, isLastItem, breadcrumbIndex);
                    })}
                </ul>
            </nav>
        </div>
    );
};

export { IBreadcrumbProps, IBreadcrumbClickItem, Breadcrumb as default };
