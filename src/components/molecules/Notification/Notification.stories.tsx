import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Notification, { INotificationProps } from "./index";

const meta: Meta<typeof Notification> = {
    title: "Molecules/Notification",
    component: Notification,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        variant: args({ control: "select", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        title: args({ control: "text", ...propCategory.content }),
        description: args({ control: "text", ...propCategory.content }),
        primaryActionText: args({ control: "text", ...propCategory.content }),
        secondaryActionText: args({ control: "text", ...propCategory.content }),
        onClose: args({ control: "false", ...propCategory.action }),
        onPrimaryActionClick: args({ control: "false", ...propCategory.action }),
        onSecondaryActionClick: args({ control: "false", ...propCategory.action }),
        actionsButtonsSize: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        open: true,
        title: 'Notification "Title"',
        variant: "sectionMessage",
        description: 'This is a "description" of the notification. It can be a longer text to provide more context.'
    } as INotificationProps
};

export default meta;

type Story = StoryObj<INotificationProps>;

const NotificationStory = (props) => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setIsOpen(!!props?.open);
    }, [props?.open]);
    const closeHandler = () => {
        setIsOpen(false);
    };
    return <Notification {...props} open={isOpen} onClose={closeHandler} onSecondaryActionClick={closeHandler} />;
};

export const Default: Story = {
    render: (props) => <NotificationStory {...props} />
};

export const WithActions: Story = {
    render: (props) => <NotificationStory {...props} />,
    args: {
        secondaryActionText: "Secondary",
        primaryActionText: "Primary",
        variant: "toast",
        status: "warning"
    }
};
