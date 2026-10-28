import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import AreaChart, { IAreaChartProps } from "./index";

const meta: Meta<IAreaChartProps> = {
    title: "Charts/AreaChart",
    component: AreaChart,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill AreaChart component argTypes
    },
    args: {
        // fill AreaChart component args
    }
};

export default meta;

type Story = StoryObj<IAreaChartProps>;

export const Default: Story = {};
