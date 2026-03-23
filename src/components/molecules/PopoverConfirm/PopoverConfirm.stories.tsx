import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import PopoverConfirm, { IPopoverConfirmProps } from "@components/molecules/PopoverConfirm";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IPopoverConfirmProps> = {
    title: "Molecules/PopoverConfirm",
    component: PopoverConfirm,
    argTypes: {
        position: args({
            control: "select",
            ...propCategory.appearance
        }),
        size: args({
            control: "select",
            ...propCategory.appearance
        }),
        open: args({ control: "boolean", ...propCategory.states, defaultValue: undefined }),
        disableReposition: args({ control: "boolean", ...propCategory.states }),
        defaultOpen: args({ control: "boolean", ...propCategory.states }),
        children: args({ control: "false", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        primaryButtonText: args({ control: "text", ...propCategory.content }),
        secondaryButtonText: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.states }),
        actions: args({ control: "false", ...propCategory.functionality }),
        setProps: args({ control: "false", ...propCategory.functionality }),
        onOpenChange: args({ control: "false", ...propCategory.action }),
        onConfirm: args({ control: "false", ...propCategory.action }),
        onCancel: args({ control: "false", ...propCategory.action })
    },
    args: {
        position: "bottom-center",
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

const confirmContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Text as="p" variant="bodyMediumRegular">
            Are you sure you want to proceed with this action?
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <Text as="p" variant="bodyMediumRegular">
                <Text as="span" variant="bodyMediumSemibold">
                    • Changes:&nbsp;
                </Text>
                This action will modify your current settings.
            </Text>
            <Text as="p" variant="bodyMediumRegular">
                <Text as="span" variant="bodyMediumSemibold">
                    • Data Impact:&nbsp;
                </Text>
                Changes may affect your data, including possible deletions.
            </Text>
            <Text as="p" variant="bodyMediumRegular">
                <Text as="span" variant="bodyMediumSemibold">
                    • Irreversible:&nbsp;
                </Text>
                This action cannot be undone.
            </Text>
        </div>
    </div>
);

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
                actions={[
                    {
                        text: "Cancel",
                        appearance: "secondary",
                        onClick: () => setOpen(false)
                    },
                    {
                        text: "Confirm",
                        appearance: "primary",
                        onClick: () => setOpen(false)
                    }
                ]}
            >
                {confirmContent}
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

const DefaultOpenComponent: FC<IPopoverConfirmProps> = (props) => {
    const [propsForContent, setPropsForContent] = useState({});

    return (
        <div style={{ margin: "500px 500px", height: 1000 }}>
            <PopoverConfirm
                {...props}
                setProps={setPropsForContent}
                defaultOpen
                onCancel={() => {}}
                onConfirm={() => {}}
            >
                {confirmContent}
            </PopoverConfirm>
            <Button onClick={() => {}} {...propsForContent}>
                Click to open
            </Button>
        </div>
    );
};

export const DefaultOpen: Story = {
    render: (props: IPopoverConfirmProps) => <DefaultOpenComponent {...props} />
};
