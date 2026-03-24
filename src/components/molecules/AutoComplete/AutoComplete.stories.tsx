import React, { FC, useState } from "react";
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
        loadingText: "Loading...",
        loading: false,
        showMore: false,
        showMoreLabel: "Show more",
        size: "small"
    }
};

export default meta;

type Story = StoryObj<IAutoCompleteProps>;

const items = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
    "Kiwi",
    "Lemon",
    "Mango",
    "Nectarine",
    "Orange",
    "Papaya",
    "Quince"
];

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

export const WithFooter: Story = {
    render: (props) => <StoryComponent {...props} />,
    args: {
        showMore: true,
        showMoreLabel: "Show more",
        onShowMore: () => console.log("Show more clicked")
    }
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
                        // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
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
                        // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
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
