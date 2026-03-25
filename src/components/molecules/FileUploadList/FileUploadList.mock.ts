import { Download, Eye, Image, RecycleBin, X } from "@geneui/icons";

import { IFileUploadItemProps } from "@components/molecules/FileUploadList/FileUploadItem/FileUploadItem";

const ACTIONS = {
    cancelUpload: { Icon: X, name: "Cancel upload" },
    retryUpload: { Icon: X, name: "Retry upload" },
    viewFile: { Icon: Eye, name: "View file" },
    downloadFile: { Icon: Download, name: "Download file" },
    removeFile: { Icon: RecycleBin, name: "Remove file" }
} as const;

const DEFAULT_FILE_ACTIONS = [ACTIONS.viewFile, ACTIONS.downloadFile, ACTIONS.removeFile];
export const UPLOADING_FILE_ACTIONS = [ACTIONS.cancelUpload, ...DEFAULT_FILE_ACTIONS];
const ERROR_FILE_ACTIONS = [ACTIONS.retryUpload, ACTIONS.removeFile];
const WARNING_FILE_ACTIONS = [ACTIONS.cancelUpload, ACTIONS.viewFile];

export const mockData: IFileUploadItemProps[] = [
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

export const mockDataForTests: IFileUploadItemProps[] = [
    {
        id: "1",
        name: "Invoice Q1.pdf",
        time: "09:15AM",
        size: "4.2MB",
        type: "file",
        actions: [
            { id: "1-image", Icon: Image, name: "Preview image" },
            { id: "1-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "2",
        name: "UX_Wireframe.sketch",
        time: "10:30AM",
        size: "12MB",
        type: "image",
        actions: [
            { id: "2-image", Icon: Image, name: "Preview image" },
            { id: "2-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "3",
        name: "Voiceover-final.mp3",
        time: "01:05PM",
        size: "8MB",
        type: "audio",
        actions: [
            { id: "3-image", Icon: Image, name: "Preview audio" },
            { id: "3-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    },
    {
        id: "4",
        name: "Product-demo.mp4",
        time: "05:40PM",
        size: "220MB",
        type: "video",
        actions: [
            { id: "4-image", Icon: Image, name: "Preview video" },
            { id: "4-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    }
];

export const uploadingData: IFileUploadItemProps[] = [
    {
        id: "uploading-1",
        name: "Quarterly-report.zip",
        time: "11:00AM",
        size: "120MB",
        type: "file",
        loading: true,
        progressPercent: 45,
        uploadingText: "Uploading",
        actions: [
            { id: "uploading-1-cancel", Icon: Image, name: "Cancel upload" },
            { id: "uploading-1-recycle", Icon: RecycleBin, name: "Remove file" }
        ]
    }
];

export const uploadingWithoutCancelData: IFileUploadItemProps[] = [
    {
        id: "uploading-2",
        name: "Research-notes.docx",
        time: "03:30PM",
        size: "2MB",
        type: "file",
        loading: true,
        progressPercent: 70,
        uploadingText: "Uploading",
        actions: [{ id: "uploading-2-recycle", Icon: RecycleBin, name: "Remove file" }]
    }
];
