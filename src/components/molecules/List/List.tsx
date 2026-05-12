import React, { FC, MouseEventHandler, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";

// Components
import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Skeleton from "@components/atoms/Skeleton";
import Empty from "@components/molecules/Empty";
import Item from "@components/molecules/List/Item/Item";

// Styles
import "./List.scss";

interface IListItemData {
    id: number | string;
    label?: ReactNode;
    disabled?: boolean;
    onClick?: (item: IListItemData) => void;
    render?: (item: IListItemData) => ReactNode;
}

interface IListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The items to display in the list.
     */
    items: IListItemData[];
    /**
     * Enables virtualized rendering for large lists.
     */
    virtualized?: boolean;
    /**
     * Indicates whether the list is in a loading state.
     * If true, a loading indicator is displayed instead of the items.
     */
    loading?: boolean;
    /**
     * The text to display alongside the loader when loading is true.
     */
    loadingText?: string;
    /**
     * Text to display when there are no items to show (no results).
     */
    emptyText?: string;
    /**
     * When true, shows the footer with the "Show more" button.
     */
    showMore?: boolean;
    /**
     * Callback when the "Show more" button is clicked.
     */
    onShowMore?: () => void;
    /**
     * Text for the "Show more" button.
     */
    showMoreLabel?: string;
    /**
     * Disables the "Show more" button.
     * Useful when there are no more items to load.
     */
    showMoreDisabled?: boolean;
    /**
     * Shows loading state for the "Show more" button.
     * Useful while waiting for the next batch of server data.
     */
    showMoreLoading?: boolean;
    /**
     * Size of the list.
     * Possible values: `small | medium | large`
     */
    size?: "small" | "medium" | "large";
}

const ESTIMATED_ROW_HEIGHT_PX = 32;

const getItemOnClickHandler = (item: IListItemData): MouseEventHandler<HTMLButtonElement> | undefined => {
    return () => item?.onClick?.(item);
};

/**
 * List is a reusable list container that renders virtualized items with loading, empty, and "show more" states.
 * It is designed to fill its parent dimensions and can be composed inside any layout, popover, or panel.
 */
const List: FC<IListProps> = ({
    className,
    items,
    virtualized = false,
    loading,
    loadingText,
    emptyText,
    showMore,
    onShowMore,
    size,
    showMoreLabel,
    showMoreDisabled = false,
    showMoreLoading = false
}) => {
    const hasChildren = useMemo(() => items.length > 0, [items.length]);
    const scrollbarRef = useRef<ScrollbarRefType | null>(null);
    const itemsArray = useMemo(() => items, [items]);
    const [skeletonRowHeight, setSkeletonRowHeight] = useState(ESTIMATED_ROW_HEIGHT_PX);
    const shouldRenderShowMoreSkeleton = showMore && showMoreLoading && hasChildren;
    const totalVirtualCount = itemsArray.length + (shouldRenderShowMoreSkeleton ? 1 : 0);

    const virtualizer = useVirtualizer({
        count: hasChildren ? totalVirtualCount : 0,
        getScrollElement: () => scrollbarRef.current?.scrollbarRef?.scrollerElement ?? null,
        estimateSize: () => ESTIMATED_ROW_HEIGHT_PX,
        overscan: 4
    });
    const virtualItems = virtualizer.getVirtualItems();
    const [firstVirtualItem] = virtualItems;
    const lastVirtualItem = virtualItems.at(-1);
    const topSpacerHeight = firstVirtualItem?.start ?? 0;
    const bottomSpacerHeight = Math.max(0, virtualizer.getTotalSize() - (lastVirtualItem?.end ?? 0));

    useLayoutEffect(() => {
        if (loading || !hasChildren) return;

        const scrollerElement = scrollbarRef.current?.scrollbarRef?.scrollerElement;
        if (!scrollerElement) return;

        const rows = scrollerElement.querySelectorAll<HTMLLIElement>(".item");
        const lastRenderedRow = rows[rows.length - 1];
        if (!lastRenderedRow) return;

        const nextHeight = Math.round(lastRenderedRow.getBoundingClientRect().height);
        if (nextHeight > 0) {
            setSkeletonRowHeight((prevHeight) => (prevHeight === nextHeight ? prevHeight : nextHeight));
        }
    }, [itemsArray, virtualized, size, loading, hasChildren]);

    useEffect(() => {
        if (!shouldRenderShowMoreSkeleton) return;

        const scrollerElement = scrollbarRef.current?.scrollbarRef?.scrollerElement;
        if (!scrollerElement) return;

        scrollerElement.scrollTo({ top: scrollerElement.scrollHeight, behavior: "smooth" });
    }, [shouldRenderShowMoreSkeleton]);

    if (loading) {
        return (
            <div className={classNames("list", className)}>
                <div className="list__state list__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            </div>
        );
    }

    if (!hasChildren) {
        return (
            <div className={classNames("list", className)}>
                <div className="list__state list__empty">
                    <Empty description={emptyText} appearance="noResult" size="small" />
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("list", className)}>
            <div className="list__body">
                <Scrollbar ref={scrollbarRef}>
                    {virtualized ? (
                        <ul className="list__content list__virtualContainer">
                            {topSpacerHeight > 0 && (
                                <li
                                    className="list__virtualSpacer"
                                    aria-hidden="true"
                                    style={{ height: topSpacerHeight }}
                                />
                            )}
                            {virtualItems.map((row) => {
                                if (shouldRenderShowMoreSkeleton && row.index === itemsArray.length) {
                                    return (
                                        <li
                                            key="list-showMore-skeleton-row"
                                            className="list__skeletonRow"
                                            aria-hidden="true"
                                        >
                                            <Skeleton
                                                className="list__skeletonItem"
                                                height={skeletonRowHeight}
                                                rounded="rounded4X"
                                            />
                                        </li>
                                    );
                                }

                                const item = itemsArray[row.index];
                                return (
                                    item && (
                                        <Item
                                            key={item.id ?? `list-item-${row.index}`}
                                            ref={virtualizer.measureElement}
                                            virtualIndex={row.index}
                                            id={item.id}
                                            disabled={item.disabled}
                                            size={size}
                                            onClick={getItemOnClickHandler(item)}
                                        >
                                            {item.render ? item.render(item) : item.label}
                                        </Item>
                                    )
                                );
                            })}
                            {bottomSpacerHeight > 0 && (
                                <li
                                    className="list__virtualSpacer"
                                    aria-hidden="true"
                                    style={{ height: bottomSpacerHeight }}
                                />
                            )}
                        </ul>
                    ) : (
                        <ul className="list__content">
                            {itemsArray.map((item, index) => (
                                <Item
                                    key={item.id ?? `list-item-${index}`}
                                    id={item.id}
                                    disabled={item.disabled}
                                    size={size}
                                    onClick={getItemOnClickHandler(item)}
                                >
                                    {item.render ? item.render(item) : item.label}
                                </Item>
                            ))}
                            {shouldRenderShowMoreSkeleton && (
                                <li className="list__skeletonRow" aria-hidden="true">
                                    <Skeleton
                                        className="list__skeletonItem"
                                        height={skeletonRowHeight}
                                        rounded="rounded4X"
                                    />
                                </li>
                            )}
                        </ul>
                    )}
                </Scrollbar>
            </div>
            {showMore && (
                <div className="list__footer">
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        onClick={onShowMore}
                        loading={showMoreLoading}
                        disabled={showMoreDisabled || showMoreLoading}
                    >
                        {showMoreLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

export { IListItemData, IListProps, List as default };
