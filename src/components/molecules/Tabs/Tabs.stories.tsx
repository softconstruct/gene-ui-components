import React, { FunctionComponent } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Tag as TagOutline } from "@geneui/icons";

// Components
import Pill from "@components/atoms/Pill";
import { ITabsProps, Tab, Tabs } from "@components/molecules/Tabs";
import DataTable from "@components/organisms/DataTable";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { mockColumns, mockData } from "../../../../stories/data/__dataTable";

const meta: Meta<ITabsProps> = {
    title: "Molecules/Tabs",
    component: Tabs,
    argTypes: {
        loading: args({ control: "boolean", ...propCategory.states }),
        closable: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        layout: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        onClose: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content }),
        defaultSelectedIndex: args({ control: "number", ...propCategory.states })
    },
    args: {
        direction: "horizontal",
        size: "large",
        layout: "contained",
        onChange: undefined
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
    ),
    args: {
        onClose: undefined,
        closable: true,
        direction: "vertical"
    }
};

const largeTableData = Array.from({ length: 12 }, (_, chunkIndex) =>
    mockData.map((row) => ({
        ...row,
        Id: row.Id + chunkIndex * 10000
    }))
).flat();

export const WithNestedScrollableContent: Story = {
    render: (props: ITabsProps) => (
        <div style={{ height: "56rem" }}>
            <Tabs {...props}>
                <Tab title="Large Data Table">
                    <div style={{ height: "100%", minHeight: 0 }}>
                        <DataTable columns={mockColumns} data={largeTableData} pagination />
                    </div>
                </Tab>
                <Tab title="Overview">Overview content</Tab>
            </Tabs>
        </div>
    ),
    args: {
        closable: false
    }
};
