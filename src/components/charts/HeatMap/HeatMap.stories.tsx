import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import HeatMap, { IHeatMapProps } from "./index";

const sampleCategories = ["Segment", "Segment", "Segment", "Segment", "Segment", "Segment", "Segment"];

// Deterministic pseudo-values (Chromatic snapshots every story).
const sampleSeries = Array.from({ length: 12 }, (_, row) => ({
    name: `${String(row + 1).padStart(2, "0")}:00 AMT`,
    data: sampleCategories.map((__, column) => ((row * 37 + column * 53) % 9) * 10 + 20)
}));

const meta: Meta<IHeatMapProps> = {
    title: "Charts/HeatMap",
    component: HeatMap,
    decorators: [
        (Story) => (
            <div style={{ height: "60rem" }}>
                <Story />
            </div>
        )
    ],
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        categories: args({ control: "object", ...propCategory.content }),
        series: args({ control: "object", ...propCategory.content }),
        color: args({ control: "text", ...propCategory.appearance }),
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
        max: 100,
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

type Story = StoryObj<IHeatMapProps>;

export const Rest: Story = {};
