import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import PieChart, { IPieChartProps } from "./index";

const sampleSeries = [
    { name: "Channel 1", value: 375 },
    { name: "Channel 2", value: 300 },
    { name: "Channel 3", value: 115 },
    { name: "Channel 4", value: 210 }
];

const meta: Meta<IPieChartProps> = {
    title: "Charts/PieChart",
    component: PieChart,
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
        rotate: args({ control: "number", ...propCategory.appearance }),
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
        rotate: -45,
        showLegend: true,
        loading: false,
        loadingText: "Loading Info",
        emptyTitle: "No Data Available",
        emptyDescription: "No data is available for display at this moment.",
        legendShowMoreText: (hiddenCount) => `Show ${hiddenCount} more`,
        legendShowLessText: "Show less",
        valueFormatter: (_value, percentage) => `${Math.round(percentage * 10) / 10}%`
    },
    parameters: {
        chromatic: { delay: 1000 }
    }
};

export default meta;

type Story = StoryObj<IPieChartProps>;

export const Rest: Story = {};

export const Loading: Story = {
    args: { loading: true }
};

export const NoData: Story = {
    args: { series: [] }
};
