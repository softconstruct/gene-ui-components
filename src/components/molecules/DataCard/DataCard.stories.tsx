import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DataCard, { IDataCardProps } from "./index";

const meta: Meta<IDataCardProps> = {
    title: "Molecules/DataCard",
    component: DataCard,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill DataCard component argTypes
    },
    args: {
        // fill DataCard component args
    }
};

export default meta;

type Story = StoryObj<IDataCardProps>;

export const Default: Story = {};
