import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import StackedBarChart, { IStackedBarChartProps } from "./index";

const meta: Meta<IStackedBarChartProps> = {
    title: "Charts/StackedBarChart",
    component: StackedBarChart,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IStackedBarChartProps>;

export const Default: Story = {};
