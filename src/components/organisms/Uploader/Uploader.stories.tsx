import { Meta, StoryObj } from "@storybook/react";

import { Download, Eye, RecycleBin } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Uploader, { IUploaderProps } from "./index";

const getActions: NonNullable<IUploaderProps["getActions"]> = (_file, { removeFile }) => [
    {
        Icon: Eye,
        name: "View file",
        onClick: () => undefined
    },
    {
        Icon: Download,
        name: "Download file",
        onClick: () => undefined
    },
    {
        Icon: RecycleBin,
        name: "Remove file",
        onClick: () => removeFile()
    }
];

const argTypes = {
    className: args({ control: "false", ...propCategory.appearance }),
    type: args({ control: "select", ...propCategory.appearance }),
    label: args({ control: "text", ...propCategory.content }),
    description: args({ control: "text", ...propCategory.content }),
    dropZoneText: args({ control: "text", ...propCategory.content }),
    uploadText: args({ control: "text", ...propCategory.content }),
    onChange: args({ control: "false", ...propCategory.action }),
    upload: args({ control: "false", ...propCategory.action }),
    // TODO: Add `accept` argType when accept prop is implemented.
    maxFileSize: args({ control: "number", ...propCategory.validation }),
    sizeErrorMsg: args({ control: "text", ...propCategory.validation }),
    multiple: args({ control: "boolean", ...propCategory.functionality }),
    disabled: args({ control: "boolean", ...propCategory.states }),
    files: args({ control: "false", ...propCategory.content }),
    getActions: args({ control: "false", ...propCategory.functionality })
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
        dropZoneText: "Drag and Drop file or",
        uploadText: "Click to upload",
        description: "Max file size 25MB",
        multiple: true,
        maxFileSize: 25 * 1024 * 1024,
        sizeErrorMsg: "Max file size 25MB",
        getActions
    }
};

export const Button: Story = {
    args: {
        type: "button",
        label: "Label",
        description: "Description",
        uploadText: "Upload",
        multiple: false,
        getActions
    }
};
