import React, { FC, useCallback, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";

// Components
import Loader from "@components/atoms/Loader";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import DataCard, { IDataCardProps } from "@components/molecules/DataCard";
import { IMenuItemProps } from "@components/molecules/Menu";

// Styles
import "./DataCardList.scss";

// Constants
const VIRTUALIZER_OVERSCAN = 2; // Number of items to render outside visible area
const REM_BASE = 10; // Base value for rem conversion (1rem = 10px)
const DEFAULT_ITEM_ESTIMATE = 0; // Fallback estimate in pixels used before first measurement
const DEFAULT_LOADER_HEIGHT = 0; // Fallback height for loading indicator in pixels

// Runtime measurement cache for per-item sizes to avoid hard-coded layout assumptions
const itemSizeCache = new Map<number, number>();

interface IDataCardListProps {
    /**
     * The data used to render the list of DataCard components.
     * Each item can optionally include individual actions and onActionClick handlers.
     */
    data: IDataCardProps[];
    /**
     * Function to load the next page of data when the user scrolls near the end of the list.
     * This function is called automatically when the user reaches the last visible item.
     */
    loadNextPage?: () => Promise<void>;
    /**
     * Indicates whether more data is available to load.
     * If `true`, the `loadNextPage` function will be triggered when the user reaches the end of the list.
     */
    hasNextPage?: boolean;
    /**
     * Shows a loading indicator at the bottom of the list.
     * Should be `true` while the next page of data is being loaded.
     */
    isNextPageLoading?: boolean;
    /**
     * Default actions to display on all DataCard components.
     * These actions will be applied to every card unless overridden by individual card data.
     * To pass unique actions for specific cards, include them in the individual card's data object.
     */
    actions?: IMenuItemProps[];
    /**
     * Custom text for the "Show More" button on each DataCard.
     * This text will be applied to all cards in the list.
     */
    showMoreText?: string;
    /**
     * Custom text for the "Actions" button on each DataCard.
     * This text will be applied to all cards in the list.
     */
    actionsText?: string;
    /**
     * Default callback function when an action is clicked in any DataCard.
     * This handler will be used for all cards unless overridden by individual card data.
     * To pass unique action handlers for specific cards, include them in the individual card's data object.
     */
    onActionClick?: (menuItem: IMenuItemProps) => void;
    /**
     * Additional CSS class for the parent container element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * DataCardList Component is a responsive alternative to a data table, designed specifically for smaller screens or mobile devices.
 * - Virtualized rendering for optimal performance with large datasets
 * - Infinite scroll capability for loading additional data as needed
 */
const DataCardList: FC<IDataCardListProps> = ({
    className,
    data,
    loadNextPage,
    hasNextPage,
    isNextPageLoading,
    actions,
    showMoreText,
    actionsText,
    onActionClick
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<ScrollbarRefType>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => scrollbarRef.current?.scrollbarRef?.scrollerElement || null,
        estimateSize: useCallback((index) => itemSizeCache.get(index) ?? DEFAULT_ITEM_ESTIMATE, []),
        overscan: VIRTUALIZER_OVERSCAN,
        measureElement: (element) => {
            if (!element) return 0;
            const { height } = element.getBoundingClientRect();
            // Cache the measured height for this item index
            const index = Number((element as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) {
                itemSizeCache.set(index, height);
            }
            return height;
        }
    });

    const items = virtualizer.getVirtualItems();

    // Get loader height dynamically
    const getLoaderHeight = useCallback(() => {
        if (loaderRef.current) {
            const { height } = loaderRef.current.getBoundingClientRect();
            return height > 0 ? height : DEFAULT_LOADER_HEIGHT;
        }
        return DEFAULT_LOADER_HEIGHT;
    }, []);

    useEffect(() => {
        const lastItem = items.at(-1);

        if (!lastItem) return;

        if (lastItem.index >= data.length - 1 && hasNextPage && !isNextPageLoading && loadNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage, data.length, isNextPageLoading, items]);

    return (
        <div className={classNames("dataCardList", className)} ref={containerRef}>
            <Scrollbar height="full" ref={scrollbarRef}>
                <div
                    className="dataCardList__container"
                    style={
                        {
                            "--virtual-container-height": `${(virtualizer.getTotalSize() + (isNextPageLoading ? getLoaderHeight() : 0)) / REM_BASE}rem`
                        } as React.CSSProperties
                    }
                >
                    {items.map((virtualItem) => (
                        <div
                            key={virtualItem.key}
                            className="dataCardList__item"
                            data-index={virtualItem.index}
                            ref={virtualizer.measureElement}
                            style={{
                                "--virtual-item-transform": `translateY(${virtualItem.start / REM_BASE}rem)`
                            }}
                        >
                            <DataCard
                                className="dataCardList__dataCard"
                                cardData={data[virtualItem.index].cardData}
                                actions={data[virtualItem.index].actions || actions}
                                showMoreText={showMoreText}
                                actionsText={actionsText}
                                onActionClick={data[virtualItem.index].onActionClick || onActionClick}
                            />
                        </div>
                    ))}
                    {isNextPageLoading && (
                        <div
                            ref={loaderRef}
                            className="dataCardList__loader"
                            style={{
                                "--virtual-loader-top": `${virtualizer.getTotalSize() / REM_BASE}rem`
                            }}
                        >
                            <Loader size="small" />
                        </div>
                    )}
                </div>
            </Scrollbar>
        </div>
    );
};

export { IDataCardListProps, DataCardList as default };
