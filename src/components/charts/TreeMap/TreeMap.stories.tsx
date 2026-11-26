import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TreeMap, { ITreeMapProps } from "./index";

const sampleSeries = [
    { name: "Channel 1", value: 400 },
    { name: "Channel 2", value: 150 },
    { name: "Channel 3", value: 250 },
    { name: "Channel 4", value: 150 },
    { name: "Channel 5", value: 100 },
    { name: "Channel 6", value: 60 },
    { name: "Channel 7", value: 55 },
    { name: "Channel 8", value: 60 }
];

const stackedSeries = [
    {
        name: "Channel 1",
        subChannels: [
            { name: "Sub channel 1", value: 180 },
            { name: "Sub channel 2", value: 60 },
            { name: "Sub channel 3", value: 30 },
            { name: "Sub channel 4", value: 30 }
        ]
    },
    {
        name: "Channel 2",
        subChannels: [
            { name: "Sub channel 1", value: 57 },
            { name: "Sub channel 2", value: 28 },
            { name: "Sub channel 3", value: 47 },
            { name: "Sub channel 4", value: 57 }
        ]
    },
    {
        name: "Channel 3",
        subChannels: [
            { name: "Sub channel 1", value: 34 },
            { name: "Sub channel 2", value: 25 },
            { name: "Sub channel 3", value: 27 },
            { name: "Sub channel 4", value: 42 },
            { name: "Sub channel 5", value: 40 }
        ]
    },
    {
        name: "Channel 4",
        subChannels: [
            { name: "Sub channel 1", value: 31 },
            { name: "Sub channel 2", value: 46 },
            { name: "Sub channel 3", value: 34 },
            { name: "Sub channel 4", value: 43 }
        ]
    },
    { name: "Channel 5", subChannels: [{ name: "Sub channel 1", value: 63 }] },
    {
        name: "Channel 6",
        subChannels: [
            { name: "Sub channel 1", value: 41 },
            { name: "Sub channel 2", value: 22 }
        ]
    }
];

const combinedSeries = [
    stackedSeries[0],
    { name: "Channel 2", value: 189 },
    stackedSeries[2],
    { name: "Channel 4", value: 154 },
    stackedSeries[4],
    { name: "Channel 6", value: 63 }
];

const meta: Meta<ITreeMapProps> = {
    title: "Charts/TreeMap",
    component: TreeMap,
    decorators: [
        (Story) => (
            <div style={{ height: "42.8rem" }}>
                <Story />
            </div>
        )
    ],
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        series: args({ control: "object", ...propCategory.content }),
        subtitle: args({ control: "text", ...propCategory.content }),
        showLegend: args({ control: "boolean", ...propCategory.appearance }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyTitle: args({ control: "text", ...propCategory.content }),
        emptyDescription: args({ control: "text", ...propCategory.content }),
        legendShowMoreText: args({ control: "text", ...propCategory.content }),
        legendShowLessText: args({ control: "text", ...propCategory.content }),
        options: args({ control: "object", ...propCategory.others }),
        valueFormatter: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        series: sampleSeries,
        subtitle: "Subtitle",
        showLegend: true,
        loading: false,
        loadingText: "Loading Info",
        emptyTitle: "No Data Available",
        emptyDescription: "No data is available for display at this moment.",
        legendShowMoreText: (hiddenCount) => `Show ${hiddenCount} more`,
        legendShowLessText: "Show less",
        valueFormatter: (value) => `${value}`
    },
    parameters: {
        chromatic: { delay: 1000 }
    }
};

export default meta;

type Story = StoryObj<ITreeMapProps>;

export const Default: Story = {};

export const Stacked: Story = {
    args: {
        series: stackedSeries
    }
};

export const Combined: Story = {
    args: {
        series: combinedSeries
    }
};
