import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Button from "@components/atoms/Button";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import PopoverConfirm, { IPopoverConfirmProps } from "./index";

const meta: Meta<IPopoverConfirmProps> = {
    title: "Molecules/PopoverConfirm",
    component: PopoverConfirm,
    argTypes: {
        position: args({ control: "select", ...propCategory.appearance }),
        margin: args({ control: "number", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        fitReference: args({ control: "boolean", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states, defaultValue: undefined }),
        withArrow: args({ control: "boolean", ...propCategory.states }),
        disableReposition: args({ control: "boolean", ...propCategory.states }),
        defaultOpen: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        confirmText: args({ control: "text", ...propCategory.content }),
        cancelText: args({ control: "text", ...propCategory.content }),
        setProps: args({ control: "false", ...propCategory.functionality }),
        trigger: args({ control: "select", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.action }),
        onConfirm: args({ control: "false", ...propCategory.action }),
        onCancel: args({ control: "false", ...propCategory.action })
    },
    args: {
        margin: 15,
        position: "bottom-left",
        size: "medium",
        title: "Confirm action",
        confirmText: "Confirm",
        cancelText: "Cancel",
        onClose: () => {},
        onConfirm: () => {},
        onCancel: () => {}
    }
};

export default meta;

type Story = StoryObj<IPopoverConfirmProps>;

const DefaultComponent: FC<IPopoverConfirmProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});

    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <PopoverConfirm {...props} setProps={setPropsForContent}>
                <span>Are you sure you want to proceed with this action?</span>
            </PopoverConfirm>
            <Button onClick={() => {}} {...propsForContent}>
                Click to confirm
            </Button>
        </div>
    );
};

export const Default: Story = {
    render: (props: IPopoverConfirmProps) => <DefaultComponent {...props} />
};
