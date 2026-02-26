import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Download, Eye, RecycleBin, X } from "@geneui/icons";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import FileUploadList, { FileUploadItem, IFileUploadItem, IFileUploadListProps } from "./index";

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    subcomponents: {
        FileUploadItem
    }
};

const mockData: IFileUploadItem[] = [
    {
        name: "Brand-styleguide.pdf",
        time: "08:05AM",
        size: "6MB",
        type: "file",
        actions: [{ Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    },
    {
        name: "Quarterly-report.pdf",
        time: "11:00AM",
        size: "12MB",
        type: "image",
        loading: true,
        progressPercent: 65,
        uploadingText: "Uploading...",
        actions: [{ Icon: X }, { Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
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
        actions: [{ Icon: X }, { Icon: RecycleBin }]
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
        actions: [{ Icon: X }, { Icon: Eye }]
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
        status: args({ control: "select", ...propCategory.states, options: ["rest", "warning", "error"] }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content })
    },
    args: {
        name: "File Name",
        time: "10:30AM",
        size: "10MB",
        type: "image",
        actions: [{ Icon: X }, { Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }],
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
