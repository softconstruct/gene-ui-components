import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import PageHeader, { IPageHeaderProps } from "./index";

const meta: Meta<IPageHeaderProps> = {
    title: "Molecules/PageHeader",
    component: PageHeader,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill PageHeader component argTypes
    },
    args: {
        // fill PageHeader component args
    }
};

export default meta;

type Story = StoryObj<IPageHeaderProps>;

export const Default: Story = {};
