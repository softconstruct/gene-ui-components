import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { DocumentPen, RecycleBin } from "@geneui/icons";

import Pill from "@components/atoms/Pill";
import TextLink from "@components/atoms/TextLink";
import { Key, Value } from "@components/molecules/KeyValue";
import { IMenuItemProps, MenuItem } from "@components/molecules/Menu";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DataCard, { IDataCardProps } from "./index";

const cardData: IDataCardProps["cardData"] = [
    { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "infoText" },
    { key: "Status", value: { type: "pill", text: "Active" } },
    { key: "Email", value: { type: "textLink", text: "john@administrator.com", href: "testHref" } },
    { key: "Role", value: { type: "text", text: "Administrator" } },
    { key: "Last Login", value: { type: "text", text: "2023-10-01 12:34 PM" } },
    { key: "Subscription", value: { type: "pill", text: "Premium" } },
    { key: "Projects", value: { type: "text", text: "15" } },
    { key: "Tasks", value: { type: "text", text: "42" } }
];

const actions: IMenuItemProps = [
    { id: "1", title: "Edit", IconAfter: DocumentPen },
    { id: "2", title: "Delete", IconAfter: RecycleBin, danger: true }
];

const meta: Meta<IDataCardProps> = {
    title: "Molecules/DataCard",
    component: DataCard,
    subcomponents: { Pill, TextLink, MenuItem, Key, Value },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IDataCardProps>;

const DataCardStory: FC<IDataCardProps> = (props) => {
    return <DataCard {...props} cardData={cardData} actions={actions} />;
};

export const Default: Story = {
    render: (props) => <DataCardStory {...props} />
};
