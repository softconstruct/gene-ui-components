import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Spreadsheet, { ISpreadsheetProps } from "./index";

const meta: Meta<ISpreadsheetProps> = {
    title: "Atoms/Spreadsheet",
    component: Spreadsheet,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        inset: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        inset: false
    }
};

export default meta;

type Story = StoryObj<ISpreadsheetProps>;

export const Default: Story = {};
