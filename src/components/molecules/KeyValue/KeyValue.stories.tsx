import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import KeyValue, { IKeyValueProps } from "./index";
import Key from "./Key";
import Value from "./Value";
import Pill from "../../atoms/Pill";
import TextLink from "../../atoms/TextLink/TextLink";

const key = <Key infoText="Info text">Title</Key>;

const meta: Meta<typeof KeyValue> = {
    title: "Molecules/KeyValue",
    component: KeyValue,
    argTypes: {
        className: args({ control: false, ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.content })
    },
    args: {
        direction: "vertical",
        size: "medium",
        children: [key, <Value>Description</Value>]
    } as IKeyValueProps
};

export default meta;

const Template: FC<IKeyValueProps> = (props) => <KeyValue {...props} />;

export const Default = Template.bind({});
Default.args = {} as IKeyValueProps;

export const WithPillValue = Template.bind({});
WithPillValue.args = {
    children: [
        key,
        <Value>
            <Pill text="Pill" isFill />
        </Value>
    ]
};

export const WithTextLinkValue = Template.bind({});
WithTextLinkValue.args = {
    children: [
        key,
        <Value>
            <TextLink text="Text Link" href="" />
        </Value>
    ]
};
