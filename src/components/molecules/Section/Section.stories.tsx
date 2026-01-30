import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Section, { ISectionProps } from "./index";

const meta: Meta<ISectionProps> = {
    title: "Molecules/Section",
    component: Section,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Section component argTypes
    },
    args: {
        // fill Section component args
    }
};

export default meta;

type Story = StoryObj<ISectionProps>;

export const Default: Story = {};
