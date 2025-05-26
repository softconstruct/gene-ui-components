import React, { FunctionComponent } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { TagOutline } from "@geneui/icons";

// Components
import Pill from "@components/atoms/Pill";
import { ITabsProps, Tab, Tabs } from "@components/molecules/Tabs";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<ITabsProps> = {
    title: "Molecules/Tabs",
    component: Tabs,
    argTypes: {
        loading: args({ control: "boolean", ...propCategory.states }),
        closable: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content })
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

export const Default: Story = {
    render: (props) => (
        <div style={{ height: 550 }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => (
                    <Tab title={`TAB ${i + 1}`}>tab {i + 1}</Tab>
                ))}
            </Tabs>
        </div>
    )
};

export const IconOnly: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: 550 }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => (
                    <Tab Icon={TagOutline}>tab {i + 1} </Tab>
                ))}
            </Tabs>
        </div>
    )
};

export const TextOnly: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: 550 }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => (
                    <Tab title={`tab${i + 1}`} Icon={null}>
                        tab {i + 1}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
};

export const TemplateWithSwap: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: 550 }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => (
                    <Tab title={`TAB ${i + 1}`} content={<Pill size="medium" text={`${i}`} />}>
                        tab {i + 1}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
};

export const Vertical: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: 550 }}>
            <Tabs {...props} direction="vertical">
                {new Array(25).fill(null).map((_, i) => (
                    <Tab title={`TAB ${i + 1}`} content={<Pill size="medium" text={`${i}`} />}>
                        tab {i + 1}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
};
