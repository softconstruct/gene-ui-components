import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DonutChart, { IDonutChartProps } from "./index";

const meta: Meta<IDonutChartProps> = {
    title: "Charts/DonutChart",
    component: DonutChart,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill DonutChart component argTypes
    },
    args: {
        // fill DonutChart component args
    }
};

export default meta;

type Story = StoryObj<IDonutChartProps>;

export const Default: Story = {};
