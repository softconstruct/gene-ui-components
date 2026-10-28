import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import AreaChart, { IAreaChartProps } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

const sampleSeries = [
    { name: "Channel 1", data: [110, 40, 300, 60, 140, 80, 200, 20] },
    { name: "Channel 2", data: [50, 60, 80, 120, 160, 180, 110, 60] },
    { name: "Channel 3", data: [120, 70, 30, 140, 40, 130, 60, 220] },
    { name: "Channel 4", data: [60, 120, 220, 90, 150, 140, 90, 70] }
];

const meta: Meta<IAreaChartProps> = {
    title: "Charts/AreaChart",
    component: AreaChart,
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

type Story = StoryObj<IAreaChartProps>;

export const Rest: Story = {};

export const Loading: Story = {
    args: { loading: true }
};

export const NoData: Story = {
    args: { series: [] }
};
