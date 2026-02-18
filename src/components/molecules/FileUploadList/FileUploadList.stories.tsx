import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Bell, Download, Eye, Image, RecycleBin, X } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import FileUploadItem, { IFileUploadItem } from "./FileUploadItem";
import FileUploadList, { IFileUploadListProps } from "./index";

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    subcomponents: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        FileUploadItem: FileUploadItem as ComponentType<any>
    }
};

const mockData: IFileUploadItem[] = [
    {
        id: "1",
        name: "Brand-styleguide.pdf",
        time: "08:05AM",
        blob: { size: "6MB", type: "document" },
        Icon: Image,
        actions: [{ Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    },
    {
        id: "2",
        name: "Quarterly-report.pdf",
        time: "11:00AM",
        blob: { size: "12MB", type: "document" },
        Icon: Image,
        loading: true,
        progressPercent: 65,
        uploadingText: "Uploading...",
        actions: [{ Icon: X, onCancel: () => {} }, { Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    },
    {
        id: "3",
        name: "Failed-upload.pdf",
        time: "09:15AM",
        blob: { size: "8MB", type: "document" },
        Icon: Image,
        loading: true,
        progressPercent: 40,
        status: "error",
        helperText: "Upload failed. Please try again.",
        uploadingText: "Uploading",
        actions: [{ Icon: X, onCancel: () => {} }, { Icon: RecycleBin }]
    },
    {
        id: "4",
        name: "Large-file.zip",
        time: "02:30PM",
        blob: { size: "250MB", type: "document" },
        Icon: Bell,
        loading: true,
        progressPercent: 85,
        status: "warning",
        helperText: "File is large. Upload may take a while.",
        uploadingText: "Uploading...",
        actions: [{ Icon: X, onCancel: () => {} }, { Icon: Eye }]
    }
];

type Story = StoryObj<IFileUploadListProps>;

type FileUploadItemStoryArgs = Omit<IFileUploadItem, "blob"> & {
    blobSize?: string;
    blobType?: "visual" | "video" | "audio" | "document";
};

const FileUploadListStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        files: args({ control: "false", ...propCategory.content })
    },
    args: {
        files: mockData
    },
    render: (props) => <FileUploadList {...props} />
};

const blobTypeOptions = ["visual", "video", "audio", "document"] as const;

const FileUploadItemStory: StoryObj<FileUploadItemStoryArgs> = {
    parameters: {
        controls: {
            exclude: ["files"]
        }
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        id: args({ control: "false", ...propCategory.content }),
        name: args({ control: "text", ...propCategory.content }),
        time: args({ control: "text", ...propCategory.content }),
        blobSize: {
            name: "size",
            control: "text",
            description: "Human-readable file size (e.g. 10MB, 4.2MB)",
            table: { category: "Content" }
        },
        blobType: {
            name: "type",
            control: "select",
            options: [...blobTypeOptions],
            description: "File type for row styling (image, video, audio, document, media)",
            table: { category: "Content" }
        },
        Icon: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "object", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        progressPercent: args({ control: "number", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.states, options: ["rest", "warning", "error"] }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content })
    },
    args: {
        id: "1",
        name: "File Name",
        time: "10:30AM",
        blobSize: "10MB",
        blobType: "visual",
        actions: [
            {
                Icon: X,
                onCancel: () => {}
            },
            { Icon: Eye },
            { Icon: Download },
            { Icon: RecycleBin }
        ],
        loading: false,
        progressPercent: 50,
        status: "rest",
        helperText: undefined,
        uploadingText: "Uploading"
    },
    render: (storyArgs) => {
        const { blobSize, blobType, ...rest } = storyArgs;
        const props = {
            ...rest,
            blob: { size: blobSize, type: blobType }
        };
        return <FileUploadItem key={`${props.id}-${blobType}`} {...props} />;
    }
};

export default meta;
export { FileUploadListStory as FileUploadList, FileUploadItemStory as FileUploadItem };
