import React, { FC, useCallback, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import ItemList, { IItemListProps } from "./index";
import ItemListItem from "./ItemListItem";

const meta: Meta<IItemListProps> = {
    title: "Molecules/ItemList",
    component: ItemList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        showMore: args({ control: "boolean", ...propCategory.appearance }),
        showMoreLabel: args({ control: "text", ...propCategory.content }),
        showMoreDisabled: args({ control: "boolean", ...propCategory.states }),
        showMoreLoading: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        emptyText: "No results",
        loadingText: "Loading Info",
        loading: false,
        showMore: false,
        showMoreLabel: "Show more"
    }
};

export default meta;

type Story = StoryObj<IItemListProps>;

const items = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
    "item6",
    "item7",
    "item8",
    "item9",
    "item10",
    "item11",
    "item12",
    "item13",
    "item14",
    "item15"
];

const PAGE_SIZE = 5;

const StoryComponent: FC<IItemListProps> = (props) => {
    return (
        <div style={{ height: "300px", width: "28rem" }}>
            <ItemList {...props}>
                {items.map((item) => (
                    <ItemListItem key={item} id={item}>
                        {item}
                    </ItemListItem>
                ))}
            </ItemList>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};

const WithFooterStoryComponent: FC<IItemListProps> = (props) => {
    const { showMoreDisabled, showMoreLoading } = props;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const visibleItems = items.slice(0, visibleCount);
    const allLoaded = visibleCount >= items.length;
    const isShowMoreDisabled = !!showMoreDisabled || allLoaded;
    const isShowMoreLoading = !!showMoreLoading || isLoadingMore;

    const handleShowMore = useCallback(() => {
        if (isShowMoreLoading || isShowMoreDisabled) return;
        setIsLoadingMore(true);

        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
            setIsLoadingMore(false);
        }, 1200);
    }, [isShowMoreDisabled, isShowMoreLoading]);

    return (
        <div style={{ height: "300px", width: "28rem" }}>
            <ItemList
                {...props}
                showMore
                onShowMore={handleShowMore}
                showMoreDisabled={isShowMoreDisabled}
                showMoreLoading={isShowMoreLoading}
            >
                {visibleItems.map((item) => (
                    <ItemListItem key={item} id={item}>
                        {item}
                    </ItemListItem>
                ))}
            </ItemList>
        </div>
    );
};

export const WithFooter: Story = {
    render: (props) => <WithFooterStoryComponent {...props} />,
    args: {
        showMoreLabel: "Show more"
    }
};

const NoResultStoryComponent: FC<IItemListProps> = (props) => {
    return (
        <div style={{ height: "300px", width: "28rem" }}>
            <ItemList {...props}>{[]}</ItemList>
        </div>
    );
};

export const NoResult: Story = {
    render: (props) => <NoResultStoryComponent {...props} />
};

const WithRenderStoryComponent: FC<IItemListProps> = (props) => {
    return (
        <div style={{ height: "300px", width: "28rem" }}>
            <ItemList {...props}>
                <ItemListItem id="home">Home</ItemListItem>
                <ItemListItem
                    id="profile"
                    render={(itemData) => (
                        <a
                            href={`/users/${itemData.id}`}
                            aria-label="Go to Profile"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        />
                    )}
                >
                    Go to Profile
                </ItemListItem>
                <ItemListItem
                    id="settings"
                    render={(itemData) => (
                        <a
                            href={`/settings/${itemData.id}`}
                            aria-label="Settings Page"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        />
                    )}
                >
                    Settings Page
                </ItemListItem>
                <ItemListItem id="disabled-item" disabled>
                    Disabled Item
                </ItemListItem>
            </ItemList>
        </div>
    );
};

export const WithRender: Story = {
    render: (props) => <WithRenderStoryComponent {...props} />
};

const VirtualizedStoryComponent: FC<IItemListProps> = (props) => {
    const virtualizedItems = useMemo(
        () =>
            Array.from({ length: 1200 }, (_, index) => ({
                id: `item-${index + 1}`,
                label: `item${index + 1}`
            })),
        []
    );

    return (
        <div style={{ height: "400px", width: "28rem" }}>
            <ItemList {...props}>
                {virtualizedItems.map((item) => (
                    <ItemListItem key={item.id} id={item.id}>
                        {item.label}
                    </ItemListItem>
                ))}
            </ItemList>
        </div>
    );
};

export const Virtualized: Story = {
    render: (props) => <VirtualizedStoryComponent {...props} />
};
