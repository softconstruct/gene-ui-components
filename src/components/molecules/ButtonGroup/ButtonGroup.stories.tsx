import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup, { IButtonGroupProps } from "@components/molecules/ButtonGroup";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IButtonGroupProps> = {
    title: "Molecules/ButtonGroup",
    component: ButtonGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "array", ...propCategory.content }),
        size: args({
            control: "select",
            options: ["small", "medium", "large", "smallNudge"],
            ...propCategory.appearance
        })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IButtonGroupProps>;

export const Default: Story = {
    render: (props) => (
        <ButtonGroup {...props}>
            <Button size="medium" appearance="primary" Icon={Globe} iconPosition="after">
                Primary
            </Button>
            <Button size="medium" appearance="secondary">
                Secondary
            </Button>
            <Button size="medium" appearance="danger">
                Danger
            </Button>
            <Button size="medium" appearance="success" disabled>
                Disabled
            </Button>
            <Button size="medium" appearance="danger" iconPosition="before">
                Danger
            </Button>
            <Button size="medium" appearance="success">
                Success
            </Button>
            <Button size="medium" Icon={Globe} iconPosition="before">
                With icon
            </Button>
        </ButtonGroup>
    )
};

export const NoSplit: Story = {
    render: (props) => (
        <ButtonGroup {...props}>
            <Button size="medium" appearance="primary">
                primary
            </Button>
            <Button size="medium" appearance="secondary">
                secondary
            </Button>
        </ButtonGroup>
    )
};
