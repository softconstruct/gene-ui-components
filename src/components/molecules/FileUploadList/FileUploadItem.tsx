import React, { FC, MouseEvent, useMemo, useRef } from "react";
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
import "./FileUploadList.scss";

/** File type used for row visual state (background and icon color). */
export type FileType = "visual" | "video" | "audio" | "document";

const VALID_FILE_TYPES: FileType[] = ["visual", "video", "audio", "document"];

function getFileType(type?: string): FileType {
    if (type && VALID_FILE_TYPES.includes(type as FileType)) {
        return type as FileType;
    }
    return "document";
}

const icons: Record<FileType, FC<IconProps>> = {
    visual: Image,
    video: PlaySquare,
    audio: NoteMusical,
    document: Document
} as const;

export interface IFileUploadActionProps {
    /**
     * The `Icon` component to display in the action button. If not provided, the action button will not be rendered.
     */
    Icon?: FC<IconProps>;
    /**
     * A callback function that is called when the button is clicked.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Cancels the upload when the file is in loading state.
     * Receives the file item's unique identifier (id).
     */
    onCancel?: (id: string | number) => void;
    /**
     * HTML id attribute for the button element.
     */
    id?: string;
    /**
     * Specifies the name of the button.
     */
    name?: string;
    /**
     * An ARIA label for the button.
     */
    "aria-label"?: string;
}

interface IFileUploadItem {
    /**
     * Display name of the file.
     */
    name?: string;
    /**
     * Time when the file was uploaded or processed.
     */
    time?: string;
    /**
     * Human-readable size of the uploaded file (e.g. "10MB", "4.2MB").
     */
    size?: string;
    /**
     * File type for row styling and icon. Possible values: `visual | video | audio | document`. Defaults to "document" if not provided.
     */
    type?: FileType;
    /**
     * An array of action button objects to display in the file upload item.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each action button is rendered with `layout="text"` and `appearance="secondary"` (these cannot be overridden).
     * For icon-only buttons, use the `Icon` prop on each action.
     * @example
     * actions={[
     *   { Icon: Eye, onClick: handleAction },
     *   { Icon: Download, onClick: handleDownload },
     *   { Icon: X, onCancel: handleCancel }
     * ]}
     */
    actions?: IFileUploadActionProps[];
    /**
     * Unique identifier for the file item.
     */
    id: string | number;
    /**
     * Indicates if the file is currently being uploaded.
     * When true, displays progress bar and hides time/size metadata. Takes precedence over `status` prop.
     */
    loading?: boolean;
    /**
     * Progress percentage for the upload (0-100).
     */
    progressPercent?: number;
    /**
     * Visual status indicator for the file. Only affects styling when `loading` is true.
     * Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     * Helper text displayed below the progress bar (e.g., error messages).
     */
    helperText?: string;
    /**
     * Text displayed during upload progress.
     */
    uploadingText?: string;
    /**
     * Accessible label for the list item (e.g. for screen readers).
     */
    "aria-label"?: string;
}

const FileUploadItem: FC<IFileUploadItem> = (props) => {
    const {
        name,
        time,
        size,
        type,
        actions,
        loading,
        progressPercent,
        id,
        status = "rest",
        helperText,
        uploadingText,
        "aria-label": ariaLabel
    } = props;

    const hasActions = Array.isArray(actions) && actions.length > 0;
    const fileType = getFileType(type);
    const Icon = icons[fileType];
    const hasName = name !== undefined && name !== null && name !== "";
    const fileName = name ?? "Unnamed file";
    const hasTime = time != null && time !== "";
    const fileTime = hasTime ? time : "--:--";
    const fileSize = size ?? "Unknown";

    const actionsWithIds = useMemo(() => {
        if (!actions) return [];
        return actions.map((action, index) => {
            const { onCancel, ...restAction } = action;
            const stableId = action.id || `fileUpload-action-${id}-${index}`;
            return {
                ...restAction,
                id: stableId,
                onCancel,
                onClick: onCancel ? () => onCancel(id) : action.onClick
            };
        });
    }, [actions, id]);

    const nameRef = useRef<HTMLSpanElement>(null);
    const timeRef = useRef<HTMLSpanElement>(null);
    const sizeRef = useRef<HTMLSpanElement>(null);
    const isNameTruncated = useEllipsisDetection(nameRef, [fileName]);
    const isTimeTruncated = useEllipsisDetection(timeRef, [fileTime]);
    const isSizeTruncated = useEllipsisDetection(sizeRef, [fileSize]);

    const showProgressLayout = loading || status === "error" || status === "warning";

    return (
        <div className="fileUploadList__itemWrapper">
            <div className={classNames("fileUploadList__item", fileType)} role="listitem" aria-label={ariaLabel}>
                <div className="fileUploadList__cell">
                    <div className={classNames("fileUploadList__file", `fileUploadList__file_type_${fileType}`)}>
                        <Icon className="fileUploadList__fileIcon" size={16} />
                    </div>
                    <Tooltip text={fileName} isVisible={isNameTruncated}>
                        <Text
                            ref={nameRef}
                            className={classNames("ellipsis-text", showProgressLayout && "fileUploadList__text")}
                            as="span"
                            variant="labelMediumMedium"
                        >
                            {fileName}
                        </Text>
                    </Tooltip>
                </div>
                {!showProgressLayout && (
                    <>
                        {hasTime && (
                            <div className="fileUploadList__cell">
                                <Tooltip text={fileTime} isVisible={isTimeTruncated}>
                                    <Text ref={timeRef} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                        {fileTime}
                                    </Text>
                                </Tooltip>
                            </div>
                        )}
                        {hasName && (
                            <div className="fileUploadList__cell">
                                <Tooltip text={fileSize} isVisible={isSizeTruncated}>
                                    <Text ref={sizeRef} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                        {fileSize}
                                    </Text>
                                </Tooltip>
                            </div>
                        )}
                    </>
                )}
                <div className={classNames("fileUploadList__cell", { showProgressLayout })}>
                    {hasActions && (
                        <ButtonGroup size="small">
                            {actionsWithIds.map((action) =>
                                action.Icon ? (
                                    <Button
                                        key={action.id}
                                        {...action}
                                        layout="text"
                                        appearance="secondary"
                                        className="fileUploadList__button"
                                        disabled={loading && !action.onCancel}
                                        aria-label={
                                            action["aria-label"] ?? (action.onCancel ? "Cancel upload" : "File action")
                                        }
                                    />
                                ) : null
                            )}
                        </ButtonGroup>
                    )}
                </div>
            </div>
            {showProgressLayout && (
                <ProgressBar
                    percent={progressPercent}
                    size="small"
                    uploadingText={uploadingText}
                    type="determinate"
                    status={status}
                    helperText={helperText}
                />
            )}
        </div>
    );
};

FileUploadItem.displayName = "FileUploadItem";

export { IFileUploadItem, FileUploadItem as default };
