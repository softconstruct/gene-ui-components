import React, { FC, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Drawer, { IDrawerProps } from "./index";

const meta: Meta<IDrawerProps> = {
    title: "Molecules/Drawer",
    component: Drawer,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        position: args({ control: "select", ...propCategory.appearance }),
        withPadding: args({ control: "boolean", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        hasCloseButton: args({ control: "boolean", ...propCategory.functionality }),
        open: args({ control: "boolean", ...propCategory.states }),
        lockBodyScroll: args({ control: "boolean", ...propCategory.functionality }),
        shouldCloseOnEscapePress: args({ control: "boolean", ...propCategory.functionality }),
        shouldCloseOnOverlayClick: args({ control: "boolean", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        children: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.functionality }),
        headerContent: args({ control: "text", ...propCategory.content }),
        footerContent: args({ control: "text", ...propCategory.content })
    },
    args: {
        withPadding: true,
        title: "Drawer Title",
        open: true,
        size: "large",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true,
        hasCloseButton: true
    }
};

export default meta;

type Story = StoryObj<IDrawerProps>;

const DrawerTemplate: FC = (props) => {
    const { open } = props;
    const [isOpen, setIsOpen] = useState(!!open);
    const [isNestedOpen, setIsNestedOpen] = useState(false);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleNestedClose = () => {
        setIsNestedOpen(false);
    };
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
            <Drawer
                {...props}
                onClose={handleClose}
                open={isOpen}
                headerContent={<Pill appearance="lagoon" text="Header Content" Icon={Globe} filled />}
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
            >
                <Button onClick={() => setIsNestedOpen(true)}>Open Nested drawer</Button>
            </Drawer>
            <Drawer
                size="small"
                open={isNestedOpen}
                hasCloseButton
                onClose={handleNestedClose}
                title="Nested Drawer"
                footerContent={<Pill appearance="success" text="Footer Content" Icon={Globe} filled />}
                // headerContent={<Pill appearance="success" text="Footer Content" Icon={Globe} filled />}
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda corporis ex itaque magnam nisi
                praesentium quisquam sint vero. Adipisci aspernatur at eum magnam nihil odio optio recusandae sequi sit
                voluptas?
            </Drawer>
        </>
    );
};

export const Default: Story = {
    render: (props) => <DrawerTemplate {...props} />
};
