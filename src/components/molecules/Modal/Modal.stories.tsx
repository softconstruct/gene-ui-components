import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import QRCode from "@components/molecules/QRCode";
import Timeline from "@components/molecules/Timeline/Timeline";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { Divider } from "../../../index";
import TimelinePoint from "../Timeline/TimelinePoint";
// Components
import Modal, { IModalProps } from "./index";

const meta: Meta<IModalProps> = {
    title: "Molecules/Modal",
    component: Modal,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        shouldCloseOnOverlayClick: args({ control: "boolean", ...propCategory.action }),
        shouldCloseOnEscapePress: args({ control: "boolean", ...propCategory.action }),
        status: args({ control: "select", options: ["informative", "warning", "error"], ...propCategory.states })
    },
    args: {
        open: true,
        hasCloseButton: true,
        title: "Modal Title",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true
    }
};

export default meta;

const timelineData = [
    { title: "Task A", description: "Description A", status: "active" },
    { title: "Task B", description: "Description B", status: "error" },
    { title: "Task C", description: "Description C", status: "pending" }
] as const;

type Story = StoryObj<IModalProps>;
const ModalStory = (props) => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setIsOpen(!!props?.open);
    }, [props?.open]);
    const closeHandler = () => {
        setIsOpen(false);
    };
    return (
        <div style={{ height: "100vh" }}>
            <Modal {...props} onClose={closeHandler} open={isOpen}>
                {props?.children || null}
            </Modal>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <ModalStory {...props}>This is modal text content</ModalStory>
};

export const withContent: Story = {
    render: (props) => (
        <ModalStory {...props}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "160px",
                    display: "flex",
                    alignItems: "center",
                    gap: "18px"
                }}
            >
                <div style={{ maxWidth: "fit-content" }}>
                    <QRCode appearance="brand" level="M" value="https://geneui-storybook.softconstruct.com/" />
                </div>
                <Divider direction="vertical" />
                <Timeline direction="horizontal">
                    {timelineData.map((timeline) => {
                        return <TimelinePoint {...timeline} />;
                    })}
                </Timeline>
            </div>
        </ModalStory>
    )
};
