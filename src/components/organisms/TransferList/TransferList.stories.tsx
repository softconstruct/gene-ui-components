import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TransferList, { ITransferListProps } from "./index";

const sourceTree: NonNullable<ITransferListProps["defaultSourceItems"]> = [
    {
        id: "portfolio-na",
        title: "Portfolio - North America",
        children: [
            { id: "na-pricing", title: "Pricing and Contracts" },
            { id: "na-sales", title: "Sales Enablement" }
        ]
    },
    {
        id: "portfolio-emea",
        title: "Portfolio - EMEA",
        children: [
            { id: "emea-distributor", title: "Distributor Onboarding" },
            { id: "emea-localization", title: "Localization" }
        ]
    }
];

const targetTree: NonNullable<ITransferListProps["defaultTargetItems"]> = [
    { id: "latam", title: "LATAM Market Assessment" }
];

const ControlledTransferList = (props: ITransferListProps) => {
    const { onChange } = props;
    const [sourceItems, setSourceItems] = useState(sourceTree);
    const [targetItems, setTargetItems] = useState(targetTree);

    return (
        <TransferList
            {...props}
            sourceItems={sourceItems}
            targetItems={targetItems}
            onChange={(payload) => {
                setSourceItems(payload.sourceItems);
                setTargetItems(payload.targetItems);
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
        sourceItems: args({ control: "false", ...propCategory.content }),
        targetItems: args({ control: "false", ...propCategory.content }),
        defaultSourceItems: args({ control: "false", ...propCategory.content }),
        defaultTargetItems: args({ control: "false", ...propCategory.content }),
        texts: args({ control: "object", ...propCategory.content }),
        onChange: args({ control: "false", action: "onChange", ...propCategory.action })
    },
    args: {
        defaultSourceItems: sourceTree,
        defaultTargetItems: targetTree,
        texts: {
            leftTitle: "Available",
            rightTitle: "Selected"
        }
    }
};

export default meta;

type Story = StoryObj<ITransferListProps>;

export const Default: Story = {};

export const Controlled: Story = {
    render: (props) => <ControlledTransferList {...props} />
};
