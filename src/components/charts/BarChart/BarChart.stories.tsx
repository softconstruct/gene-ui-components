import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import BarChart, { IBarChartProps } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

const sampleSeries = {
    name: "Channel",
    data: [120, 200, 90, 250, 160, 70, 180]
};

const meta: Meta<IBarChartProps> = {
    title: "Charts/BarChart",
    component: BarChart,
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

type Story = StoryObj<IBarChartProps>;

export const Rest: Story = {};
