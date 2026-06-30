import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Widget, { IWidgetProps } from "./index";

const meta: Meta<IWidgetProps> = {
    title: "Molecules/Widget",
    component: Widget,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Widget component argTypes
    },
    args: {
        // fill Widget component args
    }
};

export default meta;

type Story = StoryObj<IWidgetProps>;

export const Default: Story = {};
