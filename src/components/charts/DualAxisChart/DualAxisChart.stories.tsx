import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DualAxisChart, { IDualAxisChartProps } from "./index";

const meta: Meta<IDualAxisChartProps> = {
    title: "Charts/DualAxisChart",
    component: DualAxisChart,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill DualAxisChart component argTypes
    },
    args: {
        // fill DualAxisChart component args
    }
};

export default meta;

type Story = StoryObj<IDualAxisChartProps>;

export const Default: Story = {};
