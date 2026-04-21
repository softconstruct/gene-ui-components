import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TransferList, { ITransferListProps } from "./index";

const meta: Meta<ITransferListProps> = {
    title: "Organisms/TransferList",
    component: TransferList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill TransferList component argTypes
    },
    args: {
        // fill TransferList component args
    }
};

export default meta;

type Story = StoryObj<ITransferListProps>;

export const Default: Story = {};
