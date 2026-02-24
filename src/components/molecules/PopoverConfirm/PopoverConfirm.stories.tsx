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
        position: args({
            control: "select",
            ...propCategory.appearance,
            options: [
                "bottom-center",
                "bottom-left",
                "bottom-right",
                "left-bottom",
                "left-center",
                "left-top",
                "right-bottom",
                "right-center",
                "right-top",
                "top-center",
                "top-left",
                "top-right",
                "auto"
            ]
        }),
        margin: args({ control: "number", ...propCategory.appearance }),
        size: args({
            control: "select",
            ...propCategory.appearance,
            options: ["xLarge", "large", "medium", "small", "fitContent"]
        }),
        fitReference: args({ control: "boolean", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states, defaultValue: undefined }),
        withArrow: args({ control: "boolean", ...propCategory.states }),
        disableReposition: args({ control: "boolean", ...propCategory.states }),
        defaultOpen: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        primaryButtonText: args({ control: "text", ...propCategory.content }),
        secondaryButtonText: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.states }),
        setProps: args({ control: "false", ...propCategory.functionality }),
        trigger: args({ control: "select", ...propCategory.functionality }),
        onOpenChange: args({ control: "false", ...propCategory.action }),
        onConfirm: args({ control: "false", ...propCategory.action }),
        onCancel: args({ control: "false", ...propCategory.action })
    },
    args: {
        margin: 15,
        position: "bottom-left",
        size: "medium",
        title: "Confirm action",
        primaryButtonText: "Confirm",
        secondaryButtonText: "Cancel",
        onOpenChange: () => {},
        onConfirm: () => {},
        onCancel: () => {}
    }
};

export default meta;

type Story = StoryObj<IPopoverConfirmProps>;

const DefaultComponent: FC<IPopoverConfirmProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});
    const [open, setOpen] = useState(false);

    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <PopoverConfirm
                {...props}
                setProps={setPropsForContent}
                open={open}
                onOpenChange={setOpen}
                onCancel={() => setOpen(false)}
                onConfirm={() => setOpen(false)}
            >
                <span>Are you sure you want to proceed with this action?</span>
            </PopoverConfirm>
            <Button onClick={() => setOpen(true)} {...propsForContent}>
                Click to confirm
            </Button>
        </div>
    );
};

export const Default: Story = {
    render: (props: IPopoverConfirmProps) => <DefaultComponent {...props} />
};
