import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Uploader, { IUploaderProps } from "./index";

const argTypes = {
    className: args({ control: "false", ...propCategory.appearance }),
    type: args({ control: "select", ...propCategory.appearance }),
    label: args({ control: "text", ...propCategory.content }),
    description: args({ control: "text", ...propCategory.content })
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
        description: "Description"
    }
};
