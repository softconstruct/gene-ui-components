import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Modal, { IModalProps } from "./index";

const meta: Meta<IModalProps> = {
    title: "Molecules/Modal",
    component: Modal,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        open: true
    }
};

export default meta;

type Story = StoryObj<IModalProps>;
const ModalStory = (props) => {
    return (
        <div style={{ height: "100vh" }}>
            <Modal {...props}>This is a modal</Modal>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <ModalStory {...props} />
};
