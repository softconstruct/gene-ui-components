import React, { ChangeEvent, DragEvent, FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Upload } from "@geneui/icons";

// Styles
import "./Uploader.scss";

import { Button, FileUploadItem, FileUploadList, IFileUploadItemProps, Label, Text } from "../../../index";
import { DEFAULT_UPLOAD_FAILED_MSG, DEFAULT_UPLOADING_TEXT } from "./Uploader.constants";
import { completeUploadItem, createFileItem, processLocalFile, toErrorItem, toUploadingItem } from "./Uploader.helpers";

type FileUploadAction = NonNullable<IFileUploadItemProps["actions"]>[number];

interface IUploaderActionHelpers {
    /**
     * Removes the current file from the uploader list.
     */
    removeFile: () => void;
}

interface IUploaderUploadPayload {
    /**
     * Native browser `File` object selected by the user.
     */
    file: File;
    /**
     * The corresponding list item currently shown in `FileUploadList`.
     */
    item: IFileUploadItemProps;
    /**
     * Call this during the upload to switch from indeterminate to determinate progress (0–100).
     * If never called, the progress bar stays indeterminate while uploading.
     */
    onProgress: (percent: number) => void;
}

interface IUploaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Defines the visual style of the uploader.<br>
     * Possible values: `dropZone | button`<br>
     * `dropZone` provides a large interactive area for dragging files, while `button` provides a standard button trigger.
     */
    type?: "dropZone" | "button";
    /**
     * The main label text displayed above the uploader.
     */
    label?: string;
    /**
     * Supplementary descriptive text displayed within the uploader.<br>
     * For the `button` type, it appears between the label and upload button; for the `dropZone` type, it appears inside the drop area.
     */
    description?: string;
    /**
     * Text displayed before the upload trigger in the drop zone.
     * Include connecting words such as "or" in this text so translations can keep them in the correct context.
     */
    dropZoneText?: string;
    /**
     * Text displayed by the control that opens the file picker.
     */
    uploadText?: string;
    /**
     * Fired whenever the file list changes (select, drop, upload progress, complete, error, or delete).<br>
     * Mirrors the main FileUploader `onChange({ value })` pattern, but returns the list directly.
     */
    onChange?: (files: IFileUploadItemProps[]) => void;
    /**
     * Optional async upload handler. Only provide this when you need to send files to a server.<br>
     * Without it, selected/dropped files are still listed immediately as completed items.<br>
     * When provided, call `onProgress` during the request to drive the progress bar. Reject or throw to mark the item as error.
     */
    upload?: (payload: IUploaderUploadPayload) => Promise<void>;
    // TODO: Add `accept` prop to restrict file types (e.g. "image/*,.pdf") on the native file input.
    /**
     * Maximum allowed file size in bytes. Files larger than this are added with an error state.
     */
    maxFileSize?: number;
    /**
     * Error message shown when a selected file exceeds `maxFileSize`. Provide this when using `maxFileSize`.
     */
    sizeErrorMsg?: string;
    /**
     * When `true`, allows selecting multiple files at once.
     */
    multiple?: boolean;
    /**
     * When `true`, disables the upload trigger and prevents file selection.
     */
    disabled?: boolean;
    /**
     * Controlled list of uploaded files rendered below the trigger using the internal `FileUploadList`.<br>
     * When provided, Uploader becomes controlled and the parent owns list updates via `onChange`.
     */
    files?: IFileUploadItemProps[];
    /**
     * Builds action buttons for each file item (e.g. view, download, delete).<br>
     * When omitted, no actions are shown. Use `helpers.removeFile` to remove an item from the list.
     */
    getActions?: (file: IFileUploadItemProps, helpers: IUploaderActionHelpers) => FileUploadAction[] | undefined;
}

/**
 * Uploader component allows users to select and upload files from their device to a system or application. It supports various file types and sizes, providing feedback on the upload process through progress indicators. Component includes features like drag-and-drop functionality, multiple file uploads, and validation rules to ensure that only appropriate files are uploaded.
 */
const Uploader: FC<IUploaderProps> = ({
    className,
    type = "dropZone",
    label,
    description,
    dropZoneText,
    uploadText = "Upload",
    onChange,
    upload,
    maxFileSize,
    sizeErrorMsg,
    multiple,
    disabled,
    files,
    getActions
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);
    const uploadRef = useRef(upload);
    const filesRef = useRef<IFileUploadItemProps[]>([]);
    const nativeFilesRef = useRef<Map<string | number, File>>(new Map());
    const isMountedRef = useRef(true);
    const [isDragActive, setIsDragActive] = useState(false);
    const [internalFiles, setInternalFiles] = useState<IFileUploadItemProps[]>([]);
    const isDropZone = type === "dropZone";
    const isControlled = files !== undefined;
    const displayedFiles = isControlled ? files : internalFiles;
    const hasFiles = displayedFiles.length > 0;

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        uploadRef.current = upload;
    }, [upload]);

    useEffect(() => {
        if (isControlled) {
            filesRef.current = files ?? [];
        }
    }, [isControlled, files]);

    const emitFiles = (nextFiles: IFileUploadItemProps[]) => {
        filesRef.current = nextFiles;
        if (!isControlled && isMountedRef.current) {
            setInternalFiles(nextFiles);
        }
        onChangeRef.current?.(nextFiles);
    };

    const patchFileById = (id: string | number | undefined, patch: Partial<IFileUploadItemProps>) => {
        if (id === undefined) {
            return;
        }

        const nextFiles = filesRef.current.map((item) => (item.id === id ? { ...item, ...patch } : item));
        emitFiles(nextFiles);
    };

    const startUploadForItem = async (nativeFile: File, item: IFileUploadItemProps) => {
        if (item.id === undefined) {
            return;
        }

        const uploadHandler = uploadRef.current;

        try {
            if (uploadHandler) {
                await uploadHandler({
                    file: nativeFile,
                    item,
                    onProgress: (percent) => {
                        const boundedPercent = Math.max(0, Math.min(100, percent));
                        patchFileById(item.id, {
                            loading: true,
                            progressPercent: boundedPercent,
                            uploadingText: DEFAULT_UPLOADING_TEXT,
                            status: "rest",
                            helperText: undefined
                        });
                    }
                });
            } else {
                await processLocalFile(nativeFile);
            }

            const currentItem = filesRef.current.find((file) => file.id === item.id) ?? item;
            patchFileById(item.id, completeUploadItem(currentItem));
        } catch (error) {
            const helperText = error instanceof Error ? error.message : DEFAULT_UPLOAD_FAILED_MSG;
            const currentItem = filesRef.current.find((file) => file.id === item.id) ?? item;
            patchFileById(item.id, toErrorItem(currentItem, helperText));
        }
    };

    const appendSelectedFiles = (nativeFiles: FileList | File[]) => {
        if (nativeFiles.length === 0) {
            return;
        }

        const filesArray = Array.from(nativeFiles as ArrayLike<File>);
        const currentFiles = filesRef.current;
        const nextItems: IFileUploadItemProps[] = [];

        filesArray.forEach((nativeFile, index) => {
            const baseItem = createFileItem(nativeFile, index);
            const isTooLarge = typeof maxFileSize === "number" && nativeFile.size > maxFileSize;

            if (baseItem.id !== undefined) {
                nativeFilesRef.current.set(baseItem.id, nativeFile);
            }

            if (isTooLarge) {
                nextItems.push(toErrorItem(baseItem, sizeErrorMsg));
                return;
            }

            nextItems.push(toUploadingItem(baseItem));
        });

        const nextFiles = multiple ? [...nextItems, ...currentFiles] : nextItems;
        emitFiles(nextFiles);

        nextItems.forEach((item) => {
            if (!item.loading || item.id === undefined) {
                return;
            }

            const nativeFile = nativeFilesRef.current.get(item.id);
            if (nativeFile) {
                startUploadForItem(nativeFile, item).catch(() => undefined);
            }
        });
    };

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;

        if (selectedFiles) {
            appendSelectedFiles(selectedFiles);
        }

        const { current: fileInput } = fileInputRef;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleBrowseClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const relatedTarget = event.relatedTarget as Node | null;
        if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
            return;
        }

        setIsDragActive(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        appendSelectedFiles(event.dataTransfer.files);
    };

    const handleDelete = (file: IFileUploadItemProps) => {
        const nextFiles = filesRef.current.filter((item) => item.id !== file.id);
        if (file.id !== undefined) {
            nativeFilesRef.current.delete(file.id);
        }
        emitFiles(nextFiles);
    };

    const filesToRender = displayedFiles.map((file) => {
        if (file.actions || !getActions) {
            return file;
        }

        const consumerActions = getActions(file, {
            removeFile: () => handleDelete(file)
        });

        if (!consumerActions?.length) {
            return file;
        }

        return { ...file, actions: consumerActions };
    });

    return (
        <div className={classNames("uploader", `uploader_type${type}`, className)}>
            <div className="uploader__body">
                {label && <Label text={label} className="uploader__label" />}
                <input
                    ref={fileInputRef}
                    type="file"
                    id="uploader__input"
                    className="uploader__input"
                    multiple={multiple}
                    onChange={handleFileInputChange}
                    disabled={disabled}
                />
                {isDropZone ? (
                    <div
                        className={classNames("uploader__dropZone", {
                            uploader__dropZone_dragActive: isDragActive,
                            uploader__dropZone_disabled: disabled
                        })}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <span className="uploader__uploadPrompt">
                            {dropZoneText && (
                                <Text className="uploader__title" as="span" variant="bodyMediumRegular">
                                    {dropZoneText}
                                </Text>
                            )}
                            <button
                                type="button"
                                className="uploader__browseTrigger"
                                onClick={handleBrowseClick}
                                disabled={disabled}
                            >
                                <Text as="span" variant="bodyLargeMedium">
                                    {uploadText}
                                </Text>
                            </button>
                        </span>
                        {description && (
                            <Text className="uploader__fileDescription" as="span" variant="captionLargeMedium">
                                {description}
                            </Text>
                        )}
                    </div>
                ) : (
                    <div className="uploader__buttonWrapper">
                        {description && (
                            <Text className="uploader__description" as="span" variant="bodyMediumRegular">
                                {description}
                            </Text>
                        )}
                        <Button
                            appearance="primary"
                            layout="fill"
                            Icon={Upload}
                            disabled={disabled}
                            onClick={handleBrowseClick}
                        >
                            {uploadText}
                        </Button>
                    </div>
                )}
            </div>
            {hasFiles && (
                <FileUploadList>
                    {filesToRender.map((file) => (
                        <FileUploadItem key={file.id ?? file.name} {...file} />
                    ))}
                </FileUploadList>
            )}
        </div>
    );
};

export { IUploaderActionHelpers, IUploaderProps, IUploaderUploadPayload, Uploader as default };
