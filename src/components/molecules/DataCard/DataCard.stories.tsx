import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Pill from "@components/atoms/Pill";
import TextLink from "@components/atoms/TextLink";
import DataCard, { IDataCardProps } from "@components/molecules/DataCard";
import { Key, Value } from "@components/molecules/KeyValue";
import { MenuItem } from "@components/molecules/Menu";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Data
import { extendedActions, extendedCardData, longCardData } from "../../../../stories/data/__dataCard";

const meta: Meta<IDataCardProps> = {
    title: "Molecules/DataCard",
    component: DataCard,
    subcomponents: { Pill, TextLink, MenuItem, Key, Value },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        cardData: args({ control: "false", ...propCategory.content }),
        showMoreText: args({ control: "text", ...propCategory.content }),
        actionsText: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.content }),
        onActionClick: args({ control: "false", ...propCategory.action })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IDataCardProps>;

const DataCardStory: FC<IDataCardProps> = (props) => {
    const { cardData, actions, ...restProps } = props;
    return <DataCard cardData={cardData || extendedCardData} actions={actions || extendedActions} {...restProps} />;
};

export const Default: Story = {
    render: (props) => <DataCardStory {...props} />
};

export const WithLongData: Story = {
    render: (props) => <DataCardStory {...props} cardData={longCardData} />
};

export const WithoutActions: Story = {
    render: (props) => <DataCard {...props} cardData={extendedCardData} />
};

export const WithCustomTexts: Story = {
    render: (props) => <DataCardStory {...props} showMoreText="View All Details" actionsText="More Options" />
};
