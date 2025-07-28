import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Modal, { IModalProps } from "./index";

const meta: Meta<IModalProps> = {
    title: "Molecules/Modal",
    component: Modal,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Modal component argTypes
    },
    args: {
        // fill Modal component args
    }
};

export default meta;

type Story = StoryObj<IModalProps>;

export const Default: Story = {};
