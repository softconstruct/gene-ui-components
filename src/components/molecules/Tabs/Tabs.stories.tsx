import React, { FunctionComponent } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { TagOutline } from "@geneui/icons";

import Pill from "@components/atoms/Pill";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Tabs, { ITabsProps, Tab } from ".";

const meta: Meta<ITabsProps> = {
    title: "Molecules/Tabs",
    component: Tabs,
    argTypes: {
        isLoading: args({ control: "boolean", ...propCategory.states }),
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        direction: "horizontal",
        size: "large",
        type: "contained"
    } as ITabsProps,
    subcomponents: { Tab: Tab as FunctionComponent<unknown> }
};

export default meta;
type Story = StoryObj<ITabsProps>;

export const popoverStory: Story = {
    render: (props) => (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab title={`TAB ${i + 1}`}>tab {i + 1}</Tab>
            ))}
        </Tabs>
    )
};

export const IconOnly: Story = {
    render: (props) => (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab Icon={TagOutline}>tab {i + 1} </Tab>
            ))}
        </Tabs>
    )
};

export const TextOnly: Story = {
    render: (props) => (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab title={`tab${i + 1}`} Icon={null}>
                    tab {i + 1}
                </Tab>
            ))}
        </Tabs>
    )
};

export const TemplateWithSwap: Story = {
    render: (props) => (
        <Tabs {...props}>
            {new Array(25).fill(null).map((_, i) => (
                <Tab title={`TAB ${i + 1}`} content={<Pill size="medium" text={`${i}`} />}>
                    tab {i + 1}
                </Tab>
            ))}
        </Tabs>
    )
};
