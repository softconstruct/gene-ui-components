import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import SearchField, { ISearchFieldProps } from "./index";

const meta: Meta<ISearchFieldProps> = {
    title: "Molecules/SearchField",
    component: SearchField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill SearchField component argTypes
    },
    args: {
        // fill SearchField component args
    }
};

export default meta;

type Story = StoryObj<ISearchFieldProps>;

export const Default: Story = {};
