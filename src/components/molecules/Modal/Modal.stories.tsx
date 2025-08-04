import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Pill from "@components/atoms/Pill";
import Modal, { IModalProps } from "@components/molecules/Modal/Modal";
import QRCode from "@components/molecules/QRCode";
import Timeline from "@components/molecules/Timeline/Timeline";
import TimelinePoint from "@components/molecules/Timeline/TimelinePoint";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<typeof Modal> = {
    title: "Molecules/Modal",
    component: Modal,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({
            control: "select",
            ...propCategory.appearance
        }),
        open: args({ control: "boolean", ...propCategory.states }),
        withPadding: args({ control: "boolean", ...propCategory.appearance }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        shouldCloseOnOverlayClick: args({ control: "boolean", ...propCategory.functionality }),
        shouldCloseOnEscapePress: args({ control: "boolean", ...propCategory.functionality }),
        title: args({ control: "text", ...propCategory.content }),
        position: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: "text", ...propCategory.content }),
        footerContent: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.states }),
        actions: args({ control: "false", ...propCategory.functionality })
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

const timelineData = [{ title: "Task A", description: "Description A", status: "active" }] as const;

type Story = StoryObj<IModalProps>;
const ModalStory = (props) => {
    const { open } = props;
    const [isOpen, setIsOpen] = useState(!!open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div style={{ height: "100vh" }}>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                {...props}
                open={isOpen}
                onClose={handleClose}
                actions={[
                    {
                        children: "Secondary",
                        appearance: "secondary",
                        onClick: handleClose
                    },
                    {
                        children: "Primary",
                        appearance: "primary"
                    }
                ]}
            />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <ModalStory {...props} />,
    args: {
        title: "Default Modal",
        children: "This is the modal content."
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
            <Modal
                {...props}
                onClose={closeHandler}
                open={isOpen}
                footerContent={<Pill appearance="success" text="Footer Content" Icon={Globe} filled />}
            >
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
        title: "Modal with Content"
    }
};
