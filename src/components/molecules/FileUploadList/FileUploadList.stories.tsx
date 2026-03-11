import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Download, Eye, RecycleBin, X } from "@geneui/icons";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import FileUploadList, { FileUploadItem, IFileUploadItem, IFileUploadListProps } from "./index";

const ACTIONS = {
    cancelUpload: { Icon: X, name: "Cancel upload" },
    retryUpload: { Icon: X, name: "Retry upload" },
    viewFile: { Icon: Eye, name: "View file" },
    downloadFile: { Icon: Download, name: "Download file" },
    removeFile: { Icon: RecycleBin, name: "Remove file" }
} as const;

const DEFAULT_FILE_ACTIONS = [ACTIONS.viewFile, ACTIONS.downloadFile, ACTIONS.removeFile];
const UPLOADING_FILE_ACTIONS = [ACTIONS.cancelUpload, ...DEFAULT_FILE_ACTIONS];
const ERROR_FILE_ACTIONS = [ACTIONS.retryUpload, ACTIONS.removeFile];
const WARNING_FILE_ACTIONS = [ACTIONS.cancelUpload, ACTIONS.viewFile];

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    subcomponents: {
        FileUploadItem: FileUploadItem as ComponentType<unknown>
    }
};

const mockData: IFileUploadItem[] = [
    {
        name: "Brand-styleguide.pdf",
        time: "08:05AM",
        size: "6MB",
        type: "file",
        actions: DEFAULT_FILE_ACTIONS
    },
    {
        name: "Quarterly-report.pdf",
        time: "11:00AM",
        size: "12MB",
        type: "image",
        loading: true,
        progressPercent: 65,
        uploadingText: "Uploading...",
        actions: UPLOADING_FILE_ACTIONS
    },
    {
        name: "Failed-upload.pdf",
        time: "09:15AM",
        size: "8MB",
        type: "audio",
        loading: true,
        progressPercent: 40,
        status: "error",
        helperText: "Upload failed. Please try again.",
        uploadingText: "Uploading",
        actions: ERROR_FILE_ACTIONS
    },
    {
        name: "Large-file.zip",
        time: "02:30PM",
        size: "250MB",
        type: "video",
        loading: true,
        progressPercent: 85,
        status: "warning",
        helperText: "File is large. Upload may take a while.",
        uploadingText: "Uploading...",
        actions: WARNING_FILE_ACTIONS
    }
];

const FileUploadListStory: StoryObj<IFileUploadListProps> = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {},
    render: (props) => (
        <FileUploadList {...props}>
            {mockData.map((item, index) => (
                <FileUploadItem
                    key={item.id ?? `fallback-${index}`}
                    {...item}
                    ariaLabel={
                        item.ariaLabel ??
                        `File: ${item.name ?? "Unnamed"}, Size: ${item.size ?? "Unknown"}, Time: ${item.time ?? ""}`
                    }
                />
            ))}
        </FileUploadList>
    )
};

const FileUploadItemStory: StoryObj<IFileUploadItem> = storyObjBuilder({
    argTypes: {
        id: args({ control: "false", ...propCategory.content }),
        name: args({ control: "text", ...propCategory.content }),
        time: args({ control: "text", ...propCategory.content }),
        size: args({
            control: "text",
            ...propCategory.appearance
        }),
        type: args({
            control: "select",
            options: ["image", "video", "audio", "file"],
            ...propCategory.appearance
        }),
        actions: args({ control: "object", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        progressPercent: args({ control: "number", ...propCategory.content }),
        status: args({ control: "select", options: ["rest", "warning", "error"], ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content })
    },
    args: {
        name: "File Name",
        time: "10:30AM",
        size: "10MB",
        type: "image",
        actions: UPLOADING_FILE_ACTIONS,
        loading: false,
        progressPercent: 50,
        status: "rest",
        helperText: undefined,
        uploadingText: "Uploading"
    },
    render: (props) => {
        return (
            <FileUploadList>
                <FileUploadItem {...props} />
            </FileUploadList>
        );
    }
});

export default meta;
export { FileUploadListStory as FileUploadList, FileUploadItemStory as FileUploadItem };
