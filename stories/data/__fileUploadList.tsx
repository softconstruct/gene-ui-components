import { Download, Eye, RecycleBin, X } from "@geneui/icons";

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
        name: "Quarterly-report.png",
        time: "11:00AM",
        size: "12MB",
        type: "image",
        loading: true,
        progressPercent: 65,
        uploadingText: "Uploading...",
        actions: UPLOADING_FILE_ACTIONS
    },
    {
        name: "Failed-upload.wav",
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
        name: "Large-file.flv",
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
