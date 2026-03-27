import React, { FC, useCallback, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import TextField from "@components/molecules/TextField";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import AutoCompleteItem from "./AutoCompleteItem";
import AutoComplete, { IAutoCompleteProps } from "./index";

const meta: Meta<IAutoCompleteProps> = {
    title: "Molecules/AutoComplete",
    component: AutoComplete,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        setPropsForPopover: args({ control: "false", ...propCategory.functionality }),
        children: args({ control: "false", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyText: args({ control: "text", ...propCategory.content }),
        showMore: args({ control: "boolean", ...propCategory.appearance }),
        showMoreLabel: args({ control: "text", ...propCategory.content }),
        showMoreDisabled: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        position: args({
            control: "select",
            ...propCategory.appearance,
            options: [
                "bottom-center",
                "bottom-left",
                "bottom-right",
                "left-bottom",
                "left-center",
                "left-top",
                "right-bottom",
                "right-center",
                "right-top",
                "top-center",
                "top-left",
                "top-right",
                "auto"
            ]
        }),
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        onOpenChange: () => {},
        emptyText: "No results",
        loadingText: "Loading Info",
        loading: false,
        showMore: false,
        showMoreLabel: "Show more",
        size: "small"
    }
};

export default meta;

type Story = StoryObj<IAutoCompleteProps>;

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

const StoryComponent: FC<IAutoCompleteProps> = (props) => {
    const [propsForPopover, setPropsForPopover] = useState({});

    return (
        <div style={{ padding: "2rem", minHeight: "400px" }}>
            <div {...propsForPopover} style={{ display: "inline-block", width: "100%" }}>
                <TextField placeholder="Search..." />
            </div>
            <AutoComplete {...props} setPropsForPopover={setPropsForPopover}>
                {items.map((item) => (
                    <AutoCompleteItem key={item} id={item} onClick={() => console.log("Selected:", item)}>
                        {item}
                    </AutoCompleteItem>
                ))}
            </AutoComplete>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};

const WithFooterStoryComponent: FC<IAutoCompleteProps> = (props) => {
    const { showMoreDisabled } = props;
    const [propsForPopover, setPropsForPopover] = useState({});
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const visibleItems = items.slice(0, visibleCount);
    const allLoaded = visibleCount >= items.length;
    const isShowMoreDisabled = !!showMoreDisabled || allLoaded;

    const handleShowMore = useCallback(() => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
    }, []);

    return (
        <div style={{ padding: "2rem", minHeight: "400px" }}>
            <div {...propsForPopover} style={{ display: "inline-block", width: "100%" }}>
                <TextField placeholder="Search..." />
            </div>
            <AutoComplete
                {...props}
                setPropsForPopover={setPropsForPopover}
                showMore
                onShowMore={handleShowMore}
                showMoreDisabled={isShowMoreDisabled}
            >
                {visibleItems.map((item) => (
                    <AutoCompleteItem key={item} id={item}>
                        {item}
                    </AutoCompleteItem>
                ))}
            </AutoComplete>
        </div>
    );
};

export const WithFooter: Story = {
    render: (props) => <WithFooterStoryComponent {...props} />,
    args: {
        showMoreLabel: "Show more"
    }
};

const NoResultStoryComponent: FC<IAutoCompleteProps> = (props) => {
    const [propsForPopover, setPropsForPopover] = useState({});

    return (
        <div style={{ padding: "2rem", minHeight: "400px" }}>
            <div {...propsForPopover} style={{ display: "inline-block", width: "100%" }}>
                <TextField placeholder="Search..." />
            </div>
            <AutoComplete {...props} setPropsForPopover={setPropsForPopover}>
                {[]}
            </AutoComplete>
        </div>
    );
};

export const NoResult: Story = {
    render: (props) => <NoResultStoryComponent {...props} />
};

const WithRenderStoryComponent: FC<IAutoCompleteProps> = (props) => {
    const [propsForPopover, setPropsForPopover] = useState({});

    return (
        <div style={{ padding: "2rem", minHeight: "400px" }}>
            <div {...propsForPopover} style={{ display: "inline-block", width: "100%" }}>
                <TextField placeholder="Search pages..." />
            </div>
            <AutoComplete {...props} setPropsForPopover={setPropsForPopover}>
                <AutoCompleteItem id="home" onClick={() => console.log("Home clicked")}>
                    Home
                </AutoCompleteItem>
                <AutoCompleteItem
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
                </AutoCompleteItem>
                <AutoCompleteItem
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
                </AutoCompleteItem>
                <AutoCompleteItem id="disabled-item" disabled>
                    Disabled Item
                </AutoCompleteItem>
            </AutoComplete>
        </div>
    );
};

export const WithRender: Story = {
    render: (props) => <WithRenderStoryComponent {...props} />
};
