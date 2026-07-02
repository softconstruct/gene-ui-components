const MIN_BYTES = 1;
export const IMAGE_PREVIEW_ROTATION_STEP = 90;

const BYTES_IN_KILOBYTE = 1024;
const EMPTY_SIZE_LABEL = "0 Byte";
const FILE_SIZE_UNITS = ["Byte", "KB", "MB", "GB", "TB"] as const;
const DEFAULT_IMAGE_EXTENSION = "jpg";
const DEFAULT_DOWNLOAD_FILE_NAME = "image";

const MAX_SIZE_UNIT_INDEX = FILE_SIZE_UNITS.length - 1;
const KILOBYTE_EXPONENT = Math.log2(BYTES_IN_KILOBYTE);

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
    "image/avif": "avif",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp"
};

const IMAGE_EXTENSIONS = new Set(Object.values(MIME_TYPE_TO_EXTENSION));

const hasImageExtension = (fileName: string): boolean => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    return Boolean(extension && IMAGE_EXTENSIONS.has(extension));
};

/**
 * Formats a byte count into a human-readable file size string.
 */
export const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes < MIN_BYTES) {
        return EMPTY_SIZE_LABEL;
    }

    const unitIndex = Math.min(Math.floor(Math.log2(bytes) / KILOBYTE_EXPONENT), MAX_SIZE_UNIT_INDEX);
    const sizeInUnit = Math.floor(bytes / BYTES_IN_KILOBYTE ** unitIndex);

    return `${sizeInUnit} ${FILE_SIZE_UNITS[unitIndex]}`;
};

const getFileExtensionFromBlob = (blob: Blob): string => {
    const extensionFromMimeType = MIME_TYPE_TO_EXTENSION[blob.type];

    if (extensionFromMimeType) {
        return extensionFromMimeType;
    }

    const extensionFromType = blob.type.split("/").pop();

    return extensionFromType || DEFAULT_IMAGE_EXTENSION;
};

/**
 * Builds a download file name from the image blob and optional title.
 */
export const getImageDownloadFileName = (blob: Blob, title?: string): string => {
    const extension = getFileExtensionFromBlob(blob);

    if (title) {
        return hasImageExtension(title) ? title : `${title}.${extension}`;
    }

    return `${DEFAULT_DOWNLOAD_FILE_NAME}.${extension}`;
};

/**
 * Downloads an image from the provided path.
 */
export const downloadImage = async (path: string, title?: string): Promise<void> => {
    const response = await fetch(path);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = getImageDownloadFileName(blob, title);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
};
