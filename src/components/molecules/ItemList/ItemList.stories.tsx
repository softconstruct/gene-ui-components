import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Magnifier, RecycleBin, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ItemList, { IItemListProps } from "@components/molecules/ItemList";
import ItemListItem from "@components/molecules/ItemList/ItemListItem";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { itemListData } from "../../../../stories/data/__itemList";

const meta: Meta<IItemListProps> = {
    title: "Molecules/ItemList",
    component: ItemList,
    subcomponents: {
        ItemListItem: ItemListItem as React.ComponentType<unknown>
    },

    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        showMore: args({ control: "boolean", ...propCategory.appearance }),
        showMoreLabel: args({ control: "text", ...propCategory.content }),
        showMoreDisabled: args({ control: "boolean", ...propCategory.states }),
        showMoreLoading: args({ control: "boolean", ...propCategory.states }),
        onShowMore: args({ control: "false", ...propCategory.action })
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
        <ItemList
            {...props}
            showMore
            onShowMore={handleShowMore}
            showMoreDisabled={isShowMoreDisabled}
            showMoreLoading={isShowMoreLoading}
        >
            {visibleItems.map((item) => (
                <ItemListItem key={item} id={item} onClick={() => {}}>
                    {item}
                </ItemListItem>
            ))}
        </ItemList>
    );
};

export const Default: Story = {
    render: (props) => <WithFooterStoryComponent {...props} />,
    args: {
        showMoreLabel: "Show more"
    }
};

const WithRenderStoryComponent: FC<IItemListProps> = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <ItemList {...props} loading={loading} loadingText="Loading data...">
            {itemListData.map((item) => (
                <ItemListItem key={item.id} id={item.id} disabled={item.disabled}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            width: "100%",
                            paddingBlock: "0.4rem"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                minWidth: 0,
                                flex: 1
                            }}
                        >
                            <Globe size={20} />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: 0,
                                    flex: 1
                                }}
                            >
                                <Text className="ellipsis-text" as="span" variant="bodyMediumMedium">
                                    {item.title}
                                </Text>
                                <Text className="ellipsis-text" as="span" variant="captionMediumRegular">
                                    {`${item.helper} \u2022 Updated: ${item.updated}`}
                                </Text>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "auto" }}>
                            <Button Icon={Magnifier} appearance="secondary" layout="text" size="smallNudge" />
                            <Button Icon={RecycleBin} appearance="secondary" layout="text" size="smallNudge" />
                            <Button Icon={ThreeDotsHorizontal} appearance="secondary" layout="text" size="smallNudge" />
                        </div>
                    </div>
                </ItemListItem>
            ))}
        </ItemList>
    );
};

export const WithRender: Story = {
    render: (props) => <WithRenderStoryComponent {...props} />
};

export const NoResult: Story = {
    render: (props) => <ItemList {...props}>{[]}</ItemList>,
    args: {
        emptyText: "No results"
    }
};

const VirtualizedStoryComponent: FC<IItemListProps> = (props) => {
    const virtualizedItems = useMemo(
        () =>
            Array.from({ length: 500 }, (_, index) => ({
                id: `item-${index + 1}`,
                label: `item${index + 1}`
            })),
        []
    );
    const virtualizedChildren = useMemo(
        () =>
            virtualizedItems.map((item) => (
                <ItemListItem key={item.id} id={item.id}>
                    {item.label}
                </ItemListItem>
            )),
        [virtualizedItems]
    );

    return <ItemList {...props}>{virtualizedChildren}</ItemList>;
};

export const Virtualized: Story = {
    render: (props) => <VirtualizedStoryComponent {...props} />
};
