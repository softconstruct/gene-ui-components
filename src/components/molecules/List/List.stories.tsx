import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Magnifier, RecycleBin, ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import List, { IListItemData, IListProps } from "@components/molecules/List";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { listData } from "../../../../stories/data/__list";

const meta: Meta<IListProps> = {
    title: "Molecules/List",
    component: List,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        items: args({ control: "false", ...propCategory.content }),
        onItemClick: args({ control: "false", ...propCategory.action }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        showMore: args({ control: "boolean", ...propCategory.appearance }),
        showMoreLabel: args({ control: "text", ...propCategory.content }),
        showMoreDisabled: args({ control: "boolean", ...propCategory.states }),
        showMoreLoading: args({ control: "boolean", ...propCategory.states }),
        virtualized: args({ control: "boolean", ...propCategory.functionality }),
        size: args({ control: "select", ...propCategory.appearance }),
        onShowMore: args({ control: "false", ...propCategory.action })
    },
    args: {
        emptyText: "No results",
        loadingText: "Loading Info",
        loading: false,
        showMore: false,
        showMoreLabel: "Show more",
        virtualized: false,
        size: "medium"
    }
};

export default meta;

type Story = StoryObj<IListProps>;

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

const WithFooterStoryComponent: FC<IListProps> = (props) => {
    const { showMoreDisabled, showMoreLoading } = props;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const visibleItems = items.slice(0, visibleCount);
    const allLoaded = visibleCount >= items.length;
    const isShowMoreDisabled = !!showMoreDisabled || allLoaded;
    const isShowMoreLoading = !!showMoreLoading || isLoadingMore;
    const visibleItemsData = useMemo<IListItemData[]>(
        () =>
            visibleItems.map((item) => ({
                id: item,
                label: item
            })),
        [visibleItems]
    );

    const handleShowMore = useCallback(() => {
        if (isShowMoreLoading || isShowMoreDisabled) return;
        setIsLoadingMore(true);

        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
            setIsLoadingMore(false);
        }, 1200);
    }, [isShowMoreDisabled, isShowMoreLoading]);

    return (
        <List
            {...props}
            items={visibleItemsData}
            showMore
            onShowMore={handleShowMore}
            showMoreDisabled={isShowMoreDisabled}
            showMoreLoading={isShowMoreLoading}
        />
    );
};

export const Default: Story = {
    render: (props) => <WithFooterStoryComponent {...props} />,
    argTypes: {
        showMore: args({ control: "false", ...propCategory.appearance }),
        showMoreLoading: args({ control: "false", ...propCategory.states }),
        showMoreDisabled: args({ control: "false", ...propCategory.states })
    },
    args: {
        showMoreLabel: "Show more"
    }
};

const WithRenderStoryComponent: FC<IListProps> = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timeoutId);
    }, []);

    const renderedItems = useMemo<IListItemData[]>(
        () =>
            listData.map((item) => ({
                id: item.id,
                disabled: item.disabled,
                render: () => (
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
                )
            })),
        []
    );

    return <List {...props} items={renderedItems} loading={loading} loadingText="Loading data..." />;
};

export const WithRender: Story = {
    render: (props) => <WithRenderStoryComponent {...props} />
};

export const NoResult: Story = {
    render: (props) => <List {...props} items={[]} />,
    args: {
        emptyText: "No results"
    }
};

const VirtualizedStoryComponent: FC<IListProps> = (props) => {
    const virtualizedItems = useMemo(
        () =>
            Array.from({ length: 200 }, (_, index) => ({
                id: `item-${index + 1}`,
                label: `item${index + 1}`
            })),
        []
    );
    const virtualizedChildren = useMemo(
        () =>
            virtualizedItems.map(({ id, label }) => ({
                id,
                label
            })),
        [virtualizedItems]
    );

    return <List {...props} items={virtualizedChildren} onItemClick={() => {}} />;
};

export const Virtualized: Story = {
    render: (props) => <VirtualizedStoryComponent {...props} />,
    args: {
        virtualized: true
    },
    parameters: {
        docs: {
            disable: true
        }
    }
};
