import React, { ComponentType } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Bell, Download, Eye, Image, RecycleBin, X } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import FileUploadItem, { IFileUploadItem } from "./FileUploadItem";
// Components
import FileUploadList, { IFileUploadListProps } from "./index";

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    subcomponents: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        FileUploadItem: FileUploadItem as ComponentType<any>
    }
};

const mockData = [
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
        name: "Homepage-concept.fig",
        time: "11:42AM",
        blob: { size: "18MB", type: "image" },
        Icon: Bell,
        actions: [{ Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    },
    {
        id: "3",
        name: "Narration-final.wav",
        time: "02:18PM",
        blob: { size: "15MB", type: "audio" },
        Icon: Eye,
        actions: [{ Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    },
    {
        id: "4",
        name: "Launch-teaser.mp4",
        time: "06:55PM",
        blob: { size: "320MB", type: "video" },
        Icon: Image,
        actions: [{ Icon: Eye }, { Icon: Download }, { Icon: RecycleBin }]
    }
];

type Story = StoryObj<IFileUploadListProps>;
type StoryFileUploadItem = StoryObj<IFileUploadItem>;

const FileUploadListStory: Story = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        data: args({ control: "false", ...propCategory.content })
    },
    args: {
        data: mockData
    },
    render: (props) => {
        return (
            <FileUploadList {...props}>
                {mockData.map((file) => {
                    return <FileUploadItem {...file} />;
                })}
            </FileUploadList>
        );
    }
};

const FileUploadItemStory: StoryFileUploadItem = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        name: args({ control: "text", ...propCategory.content }),
        time: args({ control: "text", ...propCategory.content }),
        blob: args({ control: "false", ...propCategory.content }),
        Icon: args({ control: "false", ...propCategory.content }),
        actions: args({ control: "object", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        progressPercent: args({ control: "number", ...propCategory.content }),
        error: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        uploadingText: args({ control: "text", ...propCategory.content })
    },
    args: {
        id: "1",
        name: "File Name",
        time: "10:30AM",
        blob: { size: "10MB", type: "media" },
        Icon: Image,
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
        error: false,
        helperText: undefined,
        uploadingText: "Uploading"
    },
    render: (props) => {
        return <FileUploadItem key={props.id} {...props} />;
    }
};

export default meta;
export { FileUploadListStory as FileUploadList, FileUploadItemStory as FileUploadItem };
