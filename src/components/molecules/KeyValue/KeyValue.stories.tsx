import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Pill from "@components/atoms/Pill";
import TextLink from "@components/atoms/TextLink";
import KeyValue, { IKeyValueProps } from "@components/molecules/KeyValue";
import Key from "@components/molecules/KeyValue/Key";
import Value from "@components/molecules/KeyValue/Value";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const key = <Key infoText="Info text">Title</Key>;

const meta: Meta<typeof KeyValue> = {
    title: "Molecules/KeyValue",
    component: KeyValue,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        spaceBetween: args({ control: "boolean", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        direction: "vertical",
        size: "medium",
        children: [key, <Value>Description</Value>],
        spaceBetween: false
    } as IKeyValueProps
};

export default meta;

type Story = StoryObj<IKeyValueProps>;

export const Default: Story = {};
Default.args = {} as IKeyValueProps;

export const WithPillValue: Story = {
    args: {
        children: [
            key,
            <Value>
                <Pill text="Pill" isFill />
            </Value>
        ]
    }
};

export const WithTextLinkValue: Story = {
    args: {
        children: [
            key,
            <Value>
                <TextLink text="Text Link" href="" />
            </Value>
        ]
    }
};
