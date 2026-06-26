const MIN_BYTES = 1;
export const IMAGE_PREVIEW_ROTATION_STEP = 90;

const BYTES_IN_KILOBYTE = 1024;
const EMPTY_SIZE_LABEL = "0 Byte";
const FILE_SIZE_UNITS = ["Byte", "KB", "MB", "GB", "TB"] as const;

const MAX_SIZE_UNIT_INDEX = FILE_SIZE_UNITS.length - 1;
const KILOBYTE_EXPONENT = Math.log2(BYTES_IN_KILOBYTE);

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
