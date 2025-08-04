import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Pill from "@components/atoms/Pill";
import Modal, { IModalProps } from "@components/molecules/Modal";
import QRCode from "@components/molecules/QRCode";
import Timeline from "@components/molecules/Timeline/Timeline";
import TimelinePoint from "@components/molecules/Timeline/TimelinePoint";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IModalProps> = {
    title: "Molecules/Modal",
    component: Modal,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({
            control: "select",
            options: ["xxLarge", "xLarge", "large", "medium", "small"],
            ...propCategory.appearance
        }),
        open: args({ control: "boolean", ...propCategory.states }),
        withPadding: args({ control: "boolean", ...propCategory.appearance }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        shouldCloseOnOverlayClick: args({ control: "boolean", ...propCategory.functionality }),
        shouldCloseOnEscapePress: args({ control: "boolean", ...propCategory.functionality }),
        title: args({ control: "text", ...propCategory.content }),
        position: args({ control: "select", options: ["top", "center"], ...propCategory.appearance }),
        children: args({ control: "text", ...propCategory.content }),
        primaryActionText: args({ control: "text", ...propCategory.content }),
        secondaryActionText: args({ control: "text", ...propCategory.content }),
        onPrimaryActionClick: args({ control: "false", ...propCategory.action }),
        onSecondaryActionClick: args({ control: "false", ...propCategory.action }),
        footerContent: args({ control: "text", ...propCategory.content }),
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
    { title: "Task B", description: "Description B", status: "error" }
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
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                onClose={closeHandler}
                open={isOpen}
                status="informative"
                footerContent={<Pill appearance="success" text="Footer Content" Icon={Globe} filled />}
                {...props}
            >
                {props?.children || null}
            </Modal>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <ModalStory {...props}>{props.children}</ModalStory>,
    args: {
        title: "Default Modal",
        children: "This is the modal content.",
        primaryActionText: "Primary Action"
    }
};

const ModalWithContent = (props) => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setIsOpen(!!props?.open);
    }, [props?.open]);
    const closeHandler = () => {
        setIsOpen(false);
    };
    return (
        <div style={{ height: "100vh" }}>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal {...props} onClose={closeHandler} open={isOpen} onSecondaryActionClick={closeHandler}>
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
                    {props?.children || (
                        <>
                            <div style={{ maxWidth: "fit-content" }}>
                                <QRCode
                                    appearance="brand"
                                    level="Q"
                                    value="https://geneui-storybook.softconstruct.com/"
                                />
                            </div>
                            <Divider direction="vertical" />
                            <Timeline direction="horizontal">
                                {timelineData.map((timeline) => {
                                    return <TimelinePoint {...timeline} />;
                                })}
                            </Timeline>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export const withContent: Story = {
    render: (props) => <ModalWithContent {...props} />,
    args: {
        title: "Modal with Content",
        primaryActionText: "Primary Action",
        secondaryActionText: "Secondary Action"
    }
};
