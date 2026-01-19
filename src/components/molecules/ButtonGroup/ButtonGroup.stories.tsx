import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Heart, Magnifier } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import ButtonGroup, { IButtonGroupProps } from "@components/molecules/ButtonGroup";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IButtonGroupProps> = {
    title: "Molecules/ButtonGroup",
    component: ButtonGroup,
    subcomponents: { Button },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "array", ...propCategory.content }),
        size: args({
            control: "select",
            options: ["small", "medium", "large", "smallNudge"],
            ...propCategory.appearance
        }),
        iconOnly: args({ control: "boolean", ...propCategory.appearance })
    },
    args: {}
};

const buttonsMap: IButtonProps[] = [
    {
        children: "Primary",
        appearance: "primary",
        iconPosition: "after",
        Icon: Globe
    },
    { children: "Secondary", appearance: "secondary", Icon: Magnifier },
    { children: "Danger", appearance: "danger", Icon: Heart },
    { children: "Disabled", appearance: "success", disabled: true },
    { children: "Danger", appearance: "danger", iconPosition: "before" },
    { children: "Success", appearance: "success" },
    { children: "With icon", Icon: Globe, iconPosition: "before" }
];

export default meta;

type Story = StoryObj<IButtonGroupProps>;

export const Default: Story = {
    render: (props) => {
        return (
            <ButtonGroup {...props}>
                {buttonsMap.map((button: IButtonProps) => (
                    <Button {...button} />
                ))}
            </ButtonGroup>
        );
    }
};

export const IconOnly: Story = {
    render: (props) => (
        <ButtonGroup {...props}>
            {buttonsMap.map((button: IButtonProps) => (
                <Button {...button} />
            ))}
        </ButtonGroup>
    ),
    args: {
        iconOnly: true
    }
};
