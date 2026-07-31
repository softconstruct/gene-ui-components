import type { IFileUploadItemProps } from "@components/molecules/FileUploadList";

import { BYTES_IN_KB, BYTES_IN_MB, DEFAULT_FILE_READ_ERROR_MSG, DEFAULT_UPLOADING_TEXT } from "./Uploader.constants";

export const formatFileSize = (bytes: number): string => {
    if (bytes < BYTES_IN_KB) {
        return `${bytes} B`;
    }

    if (bytes < BYTES_IN_MB) {
        return `${(bytes / BYTES_IN_KB).toFixed(1)} KB`;
    }

    return `${(bytes / BYTES_IN_MB).toFixed(1)} MB`;
};

export const formatFileTime = (date: Date): string =>
    date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

export const getFileType = (file: File): IFileUploadItemProps["type"] => {
    const mimeType = file.type || "";

    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    if (mimeType.startsWith("audio/")) {
        return "audio";
    }

    return "file";
};

export const createFileItem = (file: File, index: number): IFileUploadItemProps => ({
    id: `${file.name}-${file.lastModified ?? index}-${file.size ?? 0}-${index}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
    name: file.name,
    size: formatFileSize(file.size || 0),
    time: formatFileTime(new Date()),
    type: getFileType(file)
});

export const completeUploadItem = (file: IFileUploadItemProps): IFileUploadItemProps => ({
    ...file,
    loading: false,
    progressPercent: undefined,
    uploadingText: undefined,
    status: "rest",
    helperText: undefined
});

export const toErrorItem = (file: IFileUploadItemProps, helperText?: string): IFileUploadItemProps => ({
    ...file,
    loading: false,
    progressPercent: undefined,
    uploadingText: undefined,
    status: "error",
    helperText
});

export const toUploadingItem = (file: IFileUploadItemProps): IFileUploadItemProps => ({
    ...file,
    loading: true,
    uploadingText: DEFAULT_UPLOADING_TEXT
});

export const processLocalFile = (file: File) =>
    new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve();
        reader.onerror = () => reject(new Error(DEFAULT_FILE_READ_ERROR_MSG));
        reader.readAsArrayBuffer(file);
    });
