import React, { FunctionComponent } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import FileUploadList from "@components/molecules/FileUploadList/FileUploadList";

import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import { mockData, UPLOADING_FILE_ACTIONS } from "../../../../stories/data/__fileUploadList";
// Components
import { FileUploadItem, IFileUploadItemProps, IFileUploadListProps } from "./index";

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    subcomponents: {
        FileUploadItem: FileUploadItem as FunctionComponent<unknown>
    }
};

const FileUploadListStory: StoryObj<IFileUploadListProps> = {
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content })
    },
    args: {},
    render: (props) => (
        <FileUploadList {...props}>
            {mockData.map((item) => (
                <FileUploadItem key={item.name} {...item} />
            ))}
        </FileUploadList>
    )
};

const FileUploadItemStory: StoryObj<IFileUploadItemProps> = storyObjBuilder({
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
        const { name, ...rest } = props as IFileUploadItemProps;
        return (
            <FileUploadList>
                <FileUploadItem name={name} {...rest} />
            </FileUploadList>
        );
    }
});

export default meta;
export { FileUploadListStory as FileUploadList, FileUploadItemStory as FileUploadItem };
