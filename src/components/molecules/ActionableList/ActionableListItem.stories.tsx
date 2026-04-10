import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ActionableListItem, { IActionableListItemProps } from "./ActionableListItem/ActionableListItem";
import {
    actionableListNodeMetaToSelectionProps,
    getActionableListNodeMeta,
    type IActionableListTreeNode
} from "./index";

/** Parent with three children: two selected in the subtree — counts are derived, not hand-written. */
const PLAYGROUND_TREE: IActionableListTreeNode = {
    checked: false,
    children: [{ checked: true }, { checked: true }, { checked: false }]
};

const COLLAPSED_PARENT_TREE: IActionableListTreeNode = {
    checked: false,
    children: [{ checked: false }, { checked: false }, { checked: false }]
};

const LEAF_TREE: IActionableListTreeNode = {
    checked: false
};

const playgroundSelection = actionableListNodeMetaToSelectionProps(getActionableListNodeMeta(PLAYGROUND_TREE));
const collapsedSelection = actionableListNodeMetaToSelectionProps(getActionableListNodeMeta(COLLAPSED_PARENT_TREE));
const leafSelection = actionableListNodeMetaToSelectionProps(getActionableListNodeMeta(LEAF_TREE));

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
        selectedLabel: "Selected",
        isDraggable: true,
        expandAriaLabel: "Toggle nested items"
    }
};

export default meta;

type Story = StoryObj<IActionableListItemProps>;

export const Playground: Story = {
    render: (props) => <ActionableListItem {...props} {...playgroundSelection} />
};

export const ExpandableCollapsed: Story = {
    args: {
        id: "item-collapsed",
        title: "Program with children (collapsed)",
        isExpandable: true,
        isExpanded: false
    },
    render: (props) => <ActionableListItem {...props} {...collapsedSelection} />
};

export const LeafRow: Story = {
    args: {
        id: "item-leaf",
        title: "Pricing and Contracts",
        isExpandable: false,
        isExpanded: false
    },
    render: (props) => <ActionableListItem {...props} {...leafSelection} />
};
