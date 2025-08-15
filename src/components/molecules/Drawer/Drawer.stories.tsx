import React, { FC, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import Button from "@components/atoms/Button";

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
        open: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        withPadding: true,
        title: "Drawer Title",
        open: true,
        size: "medium",
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

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
    };
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
            {/* <Drawer size="large" open hasCloseButton /> */}
            <Drawer {...props} onClose={handleClose} open={isOpen} />
        </>
    );
};

export const Default: Story = {
    render: (props) => <DrawerTemplate {...props} />
};
