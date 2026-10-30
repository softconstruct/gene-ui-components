import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import StackedBarChart, { IStackedBarChartProps } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

const sampleSeries = [
    { name: "Channel 1", data: [15, 85, 50, 30, 50, 85, 65] },
    { name: "Channel 2", data: [75, 55, 60, 55, 45, 30, 55] },
    { name: "Channel 3", data: [70, 45, 55, 50, 55, 55, 40] },
    { name: "Channel 4", data: [65, 55, 60, 40, 65, 90, 25] }
];

const divergingSeries = [
    { name: "Channel 1", data: [-60, -60, -55, -60, -65, -45, -60] },
    { name: "Channel 2", data: [-60, -40, -25, -80, -45, -35, -80] },
    { name: "Channel 3", data: [45, 70, 30, 85, 70, 55, 95] },
    { name: "Channel 4", data: [0, 75, 0, 60, 0, 0, 70] }
];

const divergingPercentageSeries = [
    { name: "Channel 1", data: [-6, -6, -5, -6, -6, -4, -6] },
    { name: "Channel 2", data: [-6, -4, -3, -8, -5, -4, -8] },
    { name: "Channel 3", data: [5, 7, 3, 9, 7, 6, 10] },
    { name: "Channel 4", data: [0, 8, 0, 6, 0, 0, 7] }
];

const meta: Meta<IStackedBarChartProps> = {
    title: "Charts/StackedBarChart",
    component: StackedBarChart,
    decorators: [
        (Story) => (
            <div style={{ height: "32rem" }}>
                <Story />
            </div>
        )
    ],
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        categories: args({ control: "object", ...propCategory.content }),
        series: args({ control: "object", ...propCategory.content }),
        direction: args({ control: "select", options: ["vertical", "horizontal"], ...propCategory.appearance }),
        subtitle: args({ control: "text", ...propCategory.content }),
        xAxisTitle: args({ control: "text", ...propCategory.content }),
        yAxisTitle: args({ control: "text", ...propCategory.content }),
        min: args({ control: "number", ...propCategory.content }),
        max: args({ control: "number", ...propCategory.content }),
        showLegend: args({ control: "boolean", ...propCategory.appearance }),
        loading: args({ control: "boolean", ...propCategory.states }),
        loadingText: args({ control: "text", ...propCategory.content }),
        emptyTitle: args({ control: "text", ...propCategory.content }),
        emptyDescription: args({ control: "text", ...propCategory.content }),
        options: args({ control: "object", ...propCategory.others }),
        valueFormatter: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        categories: sampleCategories,
        series: sampleSeries,
        direction: "vertical",
        subtitle: "Subtitle",
        xAxisTitle: "X axis name",
        yAxisTitle: "Y axis name",
        min: 0,
        showLegend: true,
        loading: false,
        loadingText: "Loading Info",
        emptyTitle: "No Data Available",
        emptyDescription: "No data is available for display at this moment.",
        valueFormatter: (value) => `${value}`
    },
    parameters: {
        chromatic: { delay: 1000 }
    }
};

export default meta;

type Story = StoryObj<IStackedBarChartProps>;

export const Rest: Story = {};

export const Horizontal: Story = {
    args: {
        direction: "horizontal"
    }
};

export const DivergingNumber: Story = {
    args: {
        direction: "horizontal",
        series: divergingSeries,
        min: undefined
    }
};

export const DivergingPercentage: Story = {
    args: {
        direction: "horizontal",
        series: divergingPercentageSeries,
        min: undefined,
        valueFormatter: (value) => `${value}%`,
        options: {
            yAxis: {
                labels: {
                    format: "{value}%"
                }
            }
        }
    }
};
