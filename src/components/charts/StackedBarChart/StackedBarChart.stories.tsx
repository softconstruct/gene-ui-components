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
        valueFormatter: (value) => `${value}`
    },
    parameters: {
        chromatic: { delay: 1000 }
    }
};

export default meta;

type Story = StoryObj<IStackedBarChartProps>;

export const Rest: Story = {};
