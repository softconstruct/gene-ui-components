import React, { FC, forwardRef } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { Search } from "@geneui/icons";
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Button, { IButtonProps } from "./index";

const meta: Meta<typeof forwardRef<HTMLButtonElement, IButtonProps>> = {
    title: "Atoms/Button",
    component: Button,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        text: args({ control: "text", ...propCategory.content }),
        displayType: args({ control: "select", ...propCategory.appearance }),
        fullWidth: args({ control: "boolean", ...propCategory.appearance }),
        iconAfter: args({ control: "boolean", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        Icon: args({ control: "false", ...propCategory.content }),
        name: args({ control: "false", ...propCategory.functionality }),
        onClick: args({ control: "false", ...propCategory.action })
    },
    args: {
        text: "Button",
        appearance: "primary",
        size: "large",
        displayType: "fill",
        isLoading: false
    }
};

export default meta;

const Template: FC<IButtonProps> = (props) => <Button {...props} />;

export const Default = Template.bind({});

export const WithIcon = Template.bind({});

WithIcon.args = { Icon: Search } as IButtonProps;
