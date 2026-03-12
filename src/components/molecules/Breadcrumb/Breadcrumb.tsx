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

const MAX_VISIBLE_BREADCRUMB_ITEMS = 6;

type VisibilityConfig = {
    fitAll: boolean;
    firstCount: number;
    lastCount: number;
};

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
     * Custom render function for breadcrumb links.<br />
     *
     * Example:
     * ```tsx
     * render={({ path, title, isActive }) => (
     *   <a href={path} aria-current={isActive ? "page" : undefined}>
     *     {title}
     *   </a>
     * )}
     * ```
     */
    render?: IBreadcrumbRender;
    /**
     * Called when a breadcrumb item is clicked.
     */
    onClick?: (item: IBreadcrumbItemProps) => void;
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
const Breadcrumb: FC<IBreadcrumbProps> = ({ className, items = [], iconOnly = false, render, onClick }) => {
    const [menuPropsForPopover, setMenuPropsForPopover] = useState<Record<string, unknown>>({});
    const listRef = useRef<HTMLUListElement>(null);
    const measureListRef = useRef<HTMLUListElement>(null);

    const { containerRef, sizes } = useContainerSize<HTMLDivElement>({ debounceWait: 100 });
    const containerWidth = sizes.width;

    const itemsCount = items?.length || 0;

    const [visibilityConfig, setVisibilityConfig] = useState<VisibilityConfig>({
        fitAll: true,
        firstCount: 0,
        lastCount: 1
    });

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measureList = measureListRef.current;
        if (!container || !measureList || itemsCount <= 1) {
            setVisibilityConfig({ fitAll: true, firstCount: 0, lastCount: 1 });
            return;
        }

        const availableWidth = container.clientWidth;
        const listStyles = getComputedStyle(measureList);
        const gap = parseFloat(listStyles.gap) || 0;

        const lis = measureList.querySelectorAll<HTMLLIElement>("li");
        if (lis.length < itemsCount + 1) {
            return;
        }

        const itemWidths: number[] = [];
        for (let i = 0; i < itemsCount; i++) {
            itemWidths.push(lis[i].offsetWidth);
        }
        const ellipsisWidth = lis[itemsCount].offsetWidth;

        const totalItemsWidth = itemWidths.reduce((a, b) => a + b, 0);
        const totalWithGaps = totalItemsWidth + gap * (itemsCount - 1);

        const mustTruncate = itemsCount > MAX_VISIBLE_BREADCRUMB_ITEMS || totalWithGaps > availableWidth;

        if (!mustTruncate) {
            setVisibilityConfig({ fitAll: true, firstCount: 0, lastCount: 1 });
            return;
        }

        let bestFirst = 0;
        let bestLast = 1;
        const overflowMax = itemsCount > MAX_VISIBLE_BREADCRUMB_ITEMS;
        const maxTotal = overflowMax ? 4 : Math.min(MAX_VISIBLE_BREADCRUMB_ITEMS, itemsCount - 1);

        const totals = Array.from({ length: maxTotal }, (_, i) => maxTotal - i);
        totals.some((total) => {
            const center = Math.ceil(total / 2);
            const lastOrder = [
                ...Array.from({ length: center }, (_, i) => center - i),
                ...Array.from({ length: total - center }, (_, i) => center + 1 + i)
            ];
            const found = lastOrder.some((last) => {
                const first = total - last;
                if (first + last >= itemsCount) return false;
                if (first > 2 || last > 2) return false;

                const sumFirst = itemWidths.slice(0, first).reduce((a, b) => a + b, 0);
                const sumLast = itemWidths.slice(-last).reduce((a, b) => a + b, 0);
                const width = sumFirst + ellipsisWidth + sumLast + gap * (first + last);
                if (width <= availableWidth) {
                    bestFirst = first;
                    bestLast = last;
                    return true;
                }
                return false;
            });
            return found;
        });

        setVisibilityConfig({ fitAll: false, firstCount: bestFirst, lastCount: bestLast });
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
        const selectedItem = menuItems.find((item) => {
            const itemId = item.path || item.title || "";
            return itemId === menuItem.id;
        });
        if (selectedItem && onClick) {
            onClick(selectedItem);
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
                <ul ref={listRef} className="breadcrumb__list">
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
                                return (
                                    <MenuItem key={key} id={itemId} IconBefore={item.Icon}>
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

export { IBreadcrumbProps, Breadcrumb as default };
