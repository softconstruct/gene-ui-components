import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import GroupedBarChart, { IGroupedBarChartProps } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

const sampleSeries = [
    { name: "Channel 1", data: [220, 180, 90, 250, 160, 70, 200] },
    { name: "Channel 2", data: [120, 200, 140, 170, 90, 150, 180] },
    { name: "Channel 3", data: [90, 140, 200, 110, 180, 120, 160] },
    { name: "Channel 4", data: [160, 90, 120, 200, 140, 190, 100] }
];

const meta: Meta<IGroupedBarChartProps> = {
    title: "Charts/GroupedBarChart",
    component: GroupedBarChart,
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
        max: 300,
        showLegend: true,
        loading: false,
        valueFormatter: (value) => `${value}`
    },
    parameters: {
        chromatic: { delay: 1000 }
    }
};

export default meta;

type Story = StoryObj<IGroupedBarChartProps>;

export const Rest: Story = {};
