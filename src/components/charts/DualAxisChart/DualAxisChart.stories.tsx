import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DualAxisChart, { IDualAxisChartProps, IDualAxisChartSeries } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

const sampleSeries: IDualAxisChartSeries[] = [
    {
        name: "Channel 1",
        type: "line",
        data: [32, 38, 37, 36, 39, 38, 35],
        valueFormatter: (value) => `${value}%`
    },
    {
        name: "Channel 2",
        type: "column",
        data: [135, 230, 78, 280, 190, 50, 275]
    }
];

const meta: Meta<IDualAxisChartProps> = {
    title: "Charts/DualAxisChart",
    component: DualAxisChart,
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
        secondaryYAxisTitle: args({ control: "text", ...propCategory.content }),
        secondaryMin: args({ control: "number", ...propCategory.content }),
        secondaryMax: args({ control: "number", ...propCategory.content }),
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
        secondaryMin: 0,
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

type Story = StoryObj<IDualAxisChartProps>;

export const Rest: Story = {};

export const Loading: Story = {
    args: { loading: true }
};

export const NoData: Story = {
    args: { series: [] }
};
