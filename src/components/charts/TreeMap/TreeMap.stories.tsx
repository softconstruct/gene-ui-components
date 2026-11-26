import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TreeMap, { ITreeMapProps } from "./index";

const meta: Meta<ITreeMapProps> = {
    title: "Charts/TreeMap",
    component: TreeMap,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TreeMap component argTypes
    },
    args: {
        // fill TreeMap component args
    }
};

export default meta;

type Story = StoryObj<ITreeMapProps>;

export const Default: Story = {};
