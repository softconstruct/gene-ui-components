/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import Pill from "../../atoms/Pill";
import TextLink from "../../atoms/TextLink/TextLink";
// Components
import { IKeyProps, IKeyValueProps, Key, KeyValue, Value } from "./index";

const meta: Meta<IKeyValueProps> = {
    title: "Molecules/KeyValue",
    component: KeyValue,
    subcomponents: {
        Key,
        Value
    }
};

type Story = StoryObj<IKeyValueProps>;

const KeyValueStory: Story = {
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
        spaceBetween: false
    },
    render: (props) => {
        return (
            <KeyValue {...props}>
                <Key>Title</Key>
                <Value>example value</Value>
            </KeyValue>
        );
    }
};

const KeyStory: Story = storyObjBuilder({
    argTypes: {
        infoText: args({ control: "text", ...propCategory.content })
    },
    args: {
        infoText:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas sapiente odit eaque assumenda expedita amet laborum iure est omnis aspernatur voluptate, quaerat minima tenetur quis. Aliquam, molestias! Corporis, in dolore?"
    },
    render: (props) => {
        const { infoText, ...rest } = props as IKeyProps;

        return (
            <KeyValue {...rest}>
                <Key infoText={infoText}>Title</Key>
                <Value>example value</Value>
            </KeyValue>
        );
    }
});

const WithPillValue: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <KeyValue>
                <Key>Title</Key>
                <Value>
                    <Pill text="Pill" isFill />
                </Value>
            </KeyValue>
        );
    }
});

const WithTextLinkValue: Story = storyObjBuilder({
    argTypes: {},
    args: {},
    render: (props) => {
        return (
            <KeyValue>
                <Key>Title</Key>
                <Value>
                    <TextLink text="Text Link" href="" />
                </Value>
            </KeyValue>
        );
    }
});

export default meta;
export { KeyValueStory as KeyValue, KeyStory as Key, WithPillValue, WithTextLinkValue };
