import React, { FC, MouseEvent, useRef } from "react";
import classNames from "classnames";

// Icons
import { Document, IconProps, Image, NoteMusical, PlaySquare } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import ProgressBar from "@components/molecules/ProgressBar";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./FileUploadItem.scss";

// Types
export type FileType = "image" | "video" | "audio" | "file";

const icons: Record<FileType, FC<IconProps>> = {
    image: Image,
    video: PlaySquare,
    audio: NoteMusical,
    file: Document
};

interface IFileUploadActionProps {
    /**
     * The icon component to display within the action button.
     */
    Icon: FC<IconProps>;
    /**
     * Callback fired when the action button is clicked.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * The unique identifier for the action button.
     */
    id?: string;
    /**
     * The visually hidden or tooltip name of the button.
     * Required to prevent rendering empty menu items in the `ButtonGroup`.
     */
    name: string;
    /**
     * Accessible ARIA label for screen readers.
     */
    ariaLabel?: string;
}

interface IFileUploadItemProps {
    /**
     * Display name of the file.
     */
    name: string;
    /**
     * The formatted timestamp indicating when the file was uploaded or processed.
     */
    time?: string;
    /**
     * Human-readable representation of the file size (e.g., "10MB", "4.2MB").
     */
    size?: string;
    /**
     * Defines the file category, which dictates the styling and icon used.
     * @default "file"
     */
    type?: FileType;
    /**
     * An array of action button configurations (e.g., View, Download, Delete).
     * Buttons are grouped automatically in a secondary text layout.
     */
    actions?: IFileUploadActionProps[];
    /**
     * The unique identifier for the file item.
     */
    id?: string | number;
    /**
     * If `true`, hides the time/size metadata and reveals a progress bar.
     * Takes visual precedence over the `status` prop.
     * @default false
     */
    loading?: boolean;
    /**
     * The current upload progress as a percentage (0 to 100).
     */
    progressPercent?: number;
    /**
     * The semantic state of the file upload.
     * Applies specific color treatments and icons to the progress bar.
     * @default "rest"
     */
    status?: "rest" | "warning" | "error";
    /**
     * Contextual text displayed below the progress bar (e.g., "Upload failed").
     */
    helperText?: string;
    /**
     * Status text displayed alongside the progress bar while uploading.
     */
    uploadingText?: string;
}

/**
 * `FileUploadItem` renders a single row inside the `FileUploadList`.
 *
 * It can show:
 * - file metadata (name, and optional time/size) when not uploading,
 * - a progress bar with contextual helper text when `loading` / `status` indicates upload state,
 * - grouped action buttons when `actions` are provided.
 */
const FileUploadItem: FC<IFileUploadItemProps> = ({
    name,
    time,
    size,
    type = "file",
    actions,
    loading,
    progressPercent,
    status = "rest",
    helperText,
    uploadingText
}) => {
    const Icon = icons[type];

    const nameRef = useRef<HTMLSpanElement>(null);
    const timeRef = useRef<HTMLSpanElement>(null);
    const sizeRef = useRef<HTMLSpanElement>(null);
    const isNameTruncated = useEllipsisDetection(nameRef);
    const isTimeTruncated = useEllipsisDetection(timeRef);
    const isSizeTruncated = useEllipsisDetection(sizeRef);

    const shouldShowProgressBar = loading || status === "error" || status === "warning";
    const shouldShowItemActions = actions && actions.length > 0;

    const listItemDataColumns = [
        {
            id: "time",
            value: time,
            ref: timeRef,
            isTruncated: isTimeTruncated
        },
        {
            id: "size",
            value: size,
            ref: sizeRef,
            isTruncated: isSizeTruncated
        }
    ];

    return (
        <div className="fileUploadItem">
            <div className="fileUploadItem__content">
                <div className="fileUploadItem__cell">
                    <div
                        className={classNames(
                            "fileUploadItem__iconWrapper",
                            `fileUploadItem__iconWrapper_type_${type}`
                        )}
                    >
                        <Icon className="fileUploadItem__fileIcon" size={16} />
                    </div>
                    <Tooltip text={name} isVisible={isNameTruncated}>
                        <Text ref={nameRef} className="ellipsis-text" as="span" variant="labelMediumMedium">
                            {name}
                        </Text>
                    </Tooltip>
                </div>
                {listItemDataColumns.map(({ id, value, ref, isTruncated }) => (
                    <div key={id} className="fileUploadItem__cell">
                        {value && (
                            <Tooltip text={value} isVisible={isTruncated}>
                                <Text ref={ref} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                    {value}
                                </Text>
                            </Tooltip>
                        )}
                    </div>
                ))}
                {shouldShowItemActions && (
                    <div className="fileUploadItem__cell">
                        <ButtonGroup size="small" iconOnly>
                            {actions.map((action) => (
                                <Button
                                    key={action.name}
                                    layout="text"
                                    appearance="secondary"
                                    className="fileUploadItem__button"
                                    {...action}
                                >
                                    {action.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                )}
            </div>
            {shouldShowProgressBar && (
                <ProgressBar
                    percent={progressPercent}
                    size="medium"
                    uploadingText={uploadingText}
                    type="determinate"
                    status={status}
                    helperText={helperText}
                />
            )}
        </div>
    );
};

export { IFileUploadItemProps, FileUploadItem as default };
