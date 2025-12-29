import React, { FunctionComponent } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Tag as TagOutline } from "@geneui/icons";

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
        onClose: args({ control: "false", ...propCategory.action }),
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
        <div style={{ height: "100%" }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => {
                    const title = `TAB ${i + 1}`;
                    return (
                        <Tab title={title} key={title}>
                            tab {i + 1}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    ),
    args: {
        closable: true
    }
};

export const IconOnly: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: "100%" }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => {
                    const key = i + 1;
                    return (
                        <Tab Icon={TagOutline} key={key}>
                            tab {i + 1}{" "}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    )
};

export const TextOnly: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: "100%" }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => {
                    const title = `tab${i + 1}`;
                    return (
                        <Tab title={title} key={title}>
                            tab {i + 1}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    )
};

export const TemplateWithSwap: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: "100%" }}>
            <Tabs {...props}>
                {new Array(25).fill(null).map((_, i) => {
                    const title = `TAB ${i + 1}`;
                    return (
                        <Tab title={title} content={<Pill size="medium" text={`${i}`} key={title} />}>
                            tab {i + 1}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    )
};

export const VerticalUncontrolled: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: "100%" }}>
            <Tabs {...props} direction="vertical">
                {new Array(25).fill(null).map((_, i) => {
                    const title = `TAB ${i + 1}`;
                    return (
                        <Tab title={title} content={<Pill size="medium" text={`${i}`} key={title} />}>
                            tab {i + 1}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    ),
    args: {
        onClose: undefined,
        closable: true
    }
};
