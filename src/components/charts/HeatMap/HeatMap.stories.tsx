import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import HeatMap, { IHeatMapProps } from "./index";

const meta: Meta<IHeatMapProps> = {
    title: "Charts/HeatMap",
    component: HeatMap,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill HeatMap component argTypes
    },
    args: {
        // fill HeatMap component args
    }
};

export default meta;

type Story = StoryObj<IHeatMapProps>;

export const Default: Story = {};
