import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Button from "../Button";
// Components
import Badge, { IBadgeProps } from "./index";

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

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithBorder: Story = {
    args: {
        withBorder: true
    }
};

export const withChildren: Story = {
    args: {
        size: "3xSmall",
        children: <Button onClick={() => {}} appearance="danger" text="Button" size="medium" />
    }
};
