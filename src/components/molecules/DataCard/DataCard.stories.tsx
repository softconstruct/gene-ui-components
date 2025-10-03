import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Copy, DocumentPen, Download, Eye, RecycleBin } from "@geneui/icons";

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
    { key: "Status", value: { type: "pill", text: "Active", appearance: "magenta", filled: true } },
    {
        key: "Email",
        value: { type: "textLink", text: "john@administrator.com", href: "mailto:john@administrator.com" }
    },
    { key: "Role", value: { type: "text", text: "Administrator" } }
];

const actions: IMenuItemProps[] = [
    { id: "1", title: "Edit", IconAfter: DocumentPen },
    { id: "2", title: "View", IconAfter: Eye },
    { id: "3", title: "Copy", IconAfter: Copy },
    { id: "4", title: "Download", IconAfter: Download },
    { id: "6", title: "Delete", IconAfter: RecycleBin, danger: true }
];

const longCardData: IDataCardProps["cardData"] = [
    { key: "Name", value: { type: "text", text: "John Doe" }, infoText: "infoText" },
    { key: "Status", value: { type: "pill", text: "Active", appearance: "magenta", filled: true } },
    {
        key: "Email",
        value: { type: "textLink", text: "john@administrator.com", href: "mailto:john@administrator.com" }
    },
    { key: "Role", value: { type: "text", text: "Administrator" } },
    { key: "Last Login", value: { type: "text", text: "2023-10-01 12:34 PM" } },
    { key: "Subscription", value: { type: "pill", text: "Premium", appearance: "informative", filled: true } },
    { key: "Projects", value: { type: "text", text: "15" } },
    { key: "Tasks", value: { type: "text", text: "42" } },
    { key: "Department", value: { type: "text", text: "Engineering" } },
    { key: "Manager", value: { type: "text", text: "Jane Smith" } },
    { key: "Location", value: { type: "text", text: "New York" } },
    { key: "Phone", value: { type: "textLink", text: "+1 (555) 123-4567", href: "tel:+15551234567" } }
];

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
    return <DataCard cardData={cardData} actions={actions} {...props} />;
};

export const Default: Story = {
    render: (props) => <DataCardStory {...props} />
};

export const WithLongData: Story = {
    render: (props) => <DataCardStory {...props} cardData={longCardData} />
};

export const WithoutActions: Story = {
    render: (props) => <DataCardStory {...props} actions={undefined} />
};

export const WithCustomTexts: Story = {
    render: (props) => <DataCardStory {...props} showMoreText="View All Details" actionsText="More Options" />
};
