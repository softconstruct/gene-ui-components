import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ActionableListItem, { IActionableListItemProps } from "./ActionableListItem/ActionableListItem";

const meta: Meta<IActionableListItemProps> = {
    title: "Molecules/ActionableList/ActionableListItem",
    component: ActionableListItem,
    parameters: {
        layout: "padded"
    },
    argTypes: {
        id: args({ ...propCategory.content }),
        title: args({ ...propCategory.content }),
        level: args({ control: "number", ...propCategory.appearance }),
        infoText: args({ ...propCategory.content }),
        isExpandable: args({ control: "boolean", ...propCategory.appearance }),
        isExpanded: args({ control: "boolean", ...propCategory.appearance }),
        withCheckbox: args({ control: "boolean", ...propCategory.appearance }),
        selectedCount: args({ control: "number", ...propCategory.appearance }),
        totalCount: args({ control: "number", ...propCategory.appearance }),
        selectedLabel: args({ ...propCategory.content }),
        isDraggable: args({ control: "boolean", ...propCategory.appearance }),
        expandAriaLabel: args({ ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance }),
        onToggleExpand: args({ control: "false", action: "onToggleExpand", ...propCategory.action }),
        onToggleCheck: args({ control: "false", action: "onToggleCheck", ...propCategory.action }),
        onDropReorder: args({ control: "false", action: "onDropReorder", ...propCategory.action })
    },
    args: {
        id: "item-default",
        title: "North America Launch Plan",
        level: 1,
        infoText: "Additional context for this row.",
        isExpandable: true,
        isExpanded: true,
        withCheckbox: true,
        selectedCount: 2,
        totalCount: 4,
        selectedLabel: "Selected",
        isDraggable: true,
        expandAriaLabel: "Toggle nested items"
    }
};

export default meta;

type Story = StoryObj<IActionableListItemProps>;

export const Playground: Story = {
    render: (props) => <ActionableListItem {...props} />
};

export const ExpandableCollapsed: Story = {
    args: {
        id: "item-collapsed",
        title: "Program with children (collapsed)",
        isExpandable: true,
        isExpanded: false,
        selectedCount: 0,
        totalCount: 3
    },
    render: (props) => <ActionableListItem {...props} />
};

export const LeafRow: Story = {
    args: {
        id: "item-leaf",
        title: "Pricing and Contracts",
        isExpandable: false,
        isExpanded: false,
        selectedCount: 1,
        totalCount: 1
    },
    render: (props) => <ActionableListItem {...props} />
};
