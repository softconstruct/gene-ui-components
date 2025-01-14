import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Badge, { IBadgeProps } from "./index";
import Button from "../Button";

const meta: Meta<typeof Badge> = {
    title: "Atoms/Badge",
    component: Badge,
    argTypes: {
        withBorder: args({ control: "boolean", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        value: args({ control: "number", ...propCategory.content }),
        maxValue: args({ control: "number", ...propCategory.functionality }),
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {
        withBorder: false,
        appearance: "brand",
        size: "small"
    } as IBadgeProps
};

export default meta;

const Template: FC<IBadgeProps> = (props) => <Badge {...props} />;

export const Default = Template.bind({});

Default.args = {} as IBadgeProps;

export const WithBorder = Template.bind({});

WithBorder.args = {
    withBorder: true
} as IBadgeProps;

export const withChildren = Template.bind({});

withChildren.args = {
    size: "3xSmall",
    children: <Button onClick={() => {}} appearance="danger" text="Button" size="medium" />
} as IBadgeProps;
