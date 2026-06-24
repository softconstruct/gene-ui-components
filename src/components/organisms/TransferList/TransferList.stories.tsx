import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import {
    TRANSFER_LIST_FOURTH_PANEL_TREE,
    TRANSFER_LIST_SOURCE_TREE,
    TRANSFER_LIST_TARGET_TREE,
    TRANSFER_LIST_THIRD_PANEL_TREE
} from "../../../../stories/data/__transferList";
// Components
import TransferList, { ITransferListProps } from "./index";

const panelTexts = {
    available: { searchLabel: "Available", searchPlaceholder: "Search" },
    selected: { searchLabel: "Selected", searchPlaceholder: "Search" },
    staging: { searchLabel: "Staging", searchPlaceholder: "Search" },
    archive: { searchLabel: "Archive", searchPlaceholder: "Search" }
};

const twoPanelsConfig: ITransferListProps["panels"] = [
    {
        id: "available",
        defaultItems: TRANSFER_LIST_SOURCE_TREE,
        texts: panelTexts.available
    },
    {
        id: "selected",
        defaultItems: TRANSFER_LIST_TARGET_TREE,
        texts: panelTexts.selected
    }
];

const threePanelsConfig: ITransferListProps["panels"] = [
    {
        id: "available",
        defaultItems: TRANSFER_LIST_SOURCE_TREE,
        texts: panelTexts.available
    },
    {
        id: "staging",
        defaultItems: TRANSFER_LIST_THIRD_PANEL_TREE,
        texts: panelTexts.staging
    },
    {
        id: "selected",
        defaultItems: TRANSFER_LIST_TARGET_TREE,
        texts: panelTexts.selected
    }
];

const fourPanelsConfig: ITransferListProps["panels"] = [
    {
        id: "available",
        defaultItems: TRANSFER_LIST_SOURCE_TREE,
        texts: panelTexts.available
    },
    {
        id: "staging",
        defaultItems: TRANSFER_LIST_THIRD_PANEL_TREE,
        texts: panelTexts.staging
    },
    {
        id: "selected",
        defaultItems: TRANSFER_LIST_TARGET_TREE,
        texts: panelTexts.selected
    },
    {
        id: "archive",
        defaultItems: TRANSFER_LIST_FOURTH_PANEL_TREE,
        texts: panelTexts.archive
    }
];

const ControlledTransferList = (props: ITransferListProps) => {
    const { onChange, panels: initialPanels } = props;
    const [panelItems, setPanelItems] = useState(() => initialPanels.map((panel) => panel.defaultItems ?? []));

    const controlledPanels = initialPanels.map((panel, index) => ({
        ...panel,
        items: panelItems[index]
    }));

    return (
        <TransferList
            {...props}
            panels={controlledPanels}
            onChange={(payload) => {
                setPanelItems(payload.panels);
                onChange?.(payload);
            }}
        />
    );
};

const meta: Meta<ITransferListProps> = {
    title: "Organisms/TransferList",
    component: TransferList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        panels: args({ control: "false", ...propCategory.content }),
        draggable: args({ control: "boolean", ...propCategory.appearance }),
        onChange: args({ control: "false", action: "onChange", ...propCategory.action })
    }
};

export default meta;

type Story = StoryObj<ITransferListProps>;

export const TwoPanels: Story = {
    args: {
        panels: twoPanelsConfig
    }
};

export const ThreePanels: Story = {
    args: {
        panels: threePanelsConfig
    }
};

export const FourPanels: Story = {
    args: {
        panels: fourPanelsConfig
    }
};

const dragToEmptyPanelsConfig: ITransferListProps["panels"] = [
    {
        id: "available",
        defaultItems: TRANSFER_LIST_SOURCE_TREE,
        texts: panelTexts.available
    },
    {
        id: "selected",
        defaultItems: [],
        texts: panelTexts.selected
    }
];

export const WithDragAndDrop: Story = {
    args: {
        panels: dragToEmptyPanelsConfig,
        draggable: true
    }
};

export const Controlled: Story = {
    render: (props) => <ControlledTransferList {...props} />,
    args: {
        panels: twoPanelsConfig
    }
};
