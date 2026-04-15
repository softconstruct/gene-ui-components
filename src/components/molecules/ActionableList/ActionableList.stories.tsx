import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Data
import { ACTIONABLE_LIST_ITEMS } from "../../../../stories/data/__actionableList";
// Components
import ActionableList, { IActionableListProps } from "./index";

const AsyncLoadingStory: React.FC<IActionableListProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<IActionableListProps["items"]>([]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setItems(ACTIONABLE_LIST_ITEMS);
            setLoading(false);
        }, 2000);

        return () => window.clearTimeout(timer);
    }, []);

    return <ActionableList {...props} loading={loading} items={items} />;
};

const meta: Meta<IActionableListProps> = {
    title: "Molecules/ActionableList",
    component: ActionableList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        items: args({ control: "false", ...propCategory.content }),
        texts: args({ control: "object", ...propCategory.content }),
        withCheckbox: args({ control: "boolean", ...propCategory.appearance }),
        draggable: args({ control: "boolean", ...propCategory.appearance }),
        loading: args({ control: "boolean", ...propCategory.states }),
        onItemsChange: args({ control: "false", action: "onItemsChange", ...propCategory.action }),
        onItemCheck: args({ control: "false", action: "onItemCheck", ...propCategory.action }),
        onSelectAllChange: args({ control: "false", action: "onSelectAllChange", ...propCategory.action }),
        onSearch: args({ control: "false", action: "onSearch", ...propCategory.action })
    },
    args: {
        items: ACTIONABLE_LIST_ITEMS,
        withCheckbox: true,
        draggable: true,
        loading: false,
        texts: {
            searchLabel: "Label",
            searchPlaceholder: "Search",
            bulkSelectedItemsLabel: "Selected items",
            filteredItemsLabel: "Filtered items",
            totalItemsLabel: "Total items",
            selectedItemsLabel: "Selected",
            loadingTitle: "Loading Info",
            noDataTitle: "No Data Available",
            noDataDescription: "No data is available for display at this moment.",
            noResultsTitle: "No Results Found",
            noResultsDescription: "No results were found matching your criteria.",
            expandButtonAriaLabel: "Toggle nested items"
        }
    }
};

export default meta;

type Story = StoryObj<IActionableListProps>;

export const Default: Story = {
    render: (props) => <ActionableList {...props} items={ACTIONABLE_LIST_ITEMS} />
};

export const AsyncLoading: Story = {
    args: {
        withCheckbox: false,
        draggable: false
    },
    render: (props) => <AsyncLoadingStory {...props} />
};

export const EmptyStates: Story = {
    args: {
        withCheckbox: false,
        draggable: false,
        items: []
    },
    render: (props) => <ActionableList {...props} />
};
