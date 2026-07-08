import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Uploader, { IUploaderProps } from "./index";

const argTypes = {
    className: args({ control: "false", ...propCategory.appearance }),
    type: args({ control: "select", ...propCategory.appearance }),
    label: args({ control: "text", ...propCategory.content }),
    description: args({ control: "text", ...propCategory.content }),
    onChange: args({ control: "false", ...propCategory.action }),
    onDrop: args({ control: "false", ...propCategory.action }),
    // TODO: Add `accept` argType when accept prop is implemented.
    multiple: args({ control: "boolean", ...propCategory.functionality }),
    disabled: args({ control: "boolean", ...propCategory.states })
};

const meta: Meta<IUploaderProps> = {
    title: "Organisms/Uploader",
    component: Uploader,
    argTypes
};

export default meta;

type Story = StoryObj<IUploaderProps>;

export const DropZone: Story = {
    args: {
        type: "dropZone",
        label: "Label",
        description: "Max file size 25MB"
    }
};

export const Button: Story = {
    args: {
        type: "button",
        label: "Label",
        description: "Description",
        multiple: false
    }
};

export const ButtonDisabled: Story = {
    args: {
        type: "button",
        label: "Label",
        description: "Description",
        disabled: true
    }
};
