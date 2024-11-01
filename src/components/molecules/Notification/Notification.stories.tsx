import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Notification, { INotificationProps } from "./index";

const meta: Meta<typeof Notification> = {
    title: "Molecules/Notification",
    component: Notification,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),

        type: args({ control: false, ...propCategory.others })
    },
    args: {
        type: "fill the type prop value"
    } as INotificationProps
};

export default meta;

const Template: FC<INotificationProps> = (props) => <Notification {...props} />;

export const Default = Template.bind({});

Default.args = {} as INotificationProps;
