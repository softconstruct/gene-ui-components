import React, { FC, MouseEvent, useMemo, useRef } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

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

/** File type used for row image state (background and icon color). */
export type FileType = "image" | "video" | "audio" | "file";

const VALID_FILE_TYPES: FileType[] = ["image", "video", "audio", "file"];

/** Returns the given type if it's a valid FileType, otherwise "unknown". */
function getFileType(type?: string): FileType {
    if (type && VALID_FILE_TYPES.includes(type as FileType)) {
        return type as FileType;
    }
    return "file";
}

const icons: Record<FileType, FC<IconProps>> = {
    image: Image,
    video: PlaySquare,
    audio: NoteMusical,
    file: Document
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
     * File type for row styling and icon. Possible values: `image | video | audio | file`. Defaults to "file" if not provided.
     */
    type?: FileType;
    /**
     * An array of action button objects to display in the file upload item.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each action button is rendered with `layout="text"` and `appearance="secondary"` (these cannot be overridden).
     * For icon-only buttons, use the `Icon` prop on each action.
     * @example
     * actions={[
     *   { Icon: Eye, onClick: handleView },
     *   { Icon: Download, onClick: handleDownload },
     *   { Icon: RecycleBin, onClick: handleRemove }
     * ]}
     */
    actions?: IFileUploadActionProps[];
    /**
     * Unique identifier for the file item.
     */
    id?: string | number;
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
     * image status indicator for the file. Only affects styling when `loading` is true.
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
    ariaLabel?: string;
}

const FileUploadItem: FC<IFileUploadItem> = ({
    name = "Unnamed file",
    time,
    size = "Unknown",
    type,
    actions,
    loading,
    progressPercent,
    status = "rest",
    helperText,
    uploadingText,
    ariaLabel
}) => {
    const fileType = getFileType(type);
    const Icon = icons[fileType];

    const actionsWithIds = useMemo(() => {
        if (!actions) return [];
        return actions.map((action) => ({
            ...action,
            id: action.id || nanoid()
        }));
    }, [actions]);

    const nameRef = useRef<HTMLSpanElement>(null);
    const timeRef = useRef<HTMLSpanElement>(null);
    const sizeRef = useRef<HTMLSpanElement>(null);
    const isNameTruncated = useEllipsisDetection(nameRef, [name]);
    const isTimeTruncated = useEllipsisDetection(timeRef, [time]);
    const isSizeTruncated = useEllipsisDetection(sizeRef, [size]);

    const showProgressLayout = loading || status === "error" || status === "warning";

    return (
        <div className="fileUploadList__itemWrapper">
            <div className={classNames("fileUploadList__item")} role="listitem" aria-label={ariaLabel}>
                <div className="fileUploadList__cell">
                    <div className={classNames("fileUploadList__file", `fileUploadList__file_type_${fileType}`)}>
                        <Icon className="fileUploadList__fileIcon" size={16} />
                    </div>
                    <Tooltip text={name} isVisible={isNameTruncated}>
                        <Text
                            ref={nameRef}
                            className={classNames("ellipsis-text", { fileUploadList__text: showProgressLayout })}
                            as="span"
                            variant="labelMediumMedium"
                        >
                            {name}
                        </Text>
                    </Tooltip>
                </div>
                {!showProgressLayout && (
                    <>
                        {time && (
                            <div className="fileUploadList__cell">
                                <Tooltip text={time} isVisible={isTimeTruncated}>
                                    <Text ref={timeRef} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                        {time}
                                    </Text>
                                </Tooltip>
                            </div>
                        )}
                        {size && (
                            <div className="fileUploadList__cell">
                                <Tooltip text={size} isVisible={isSizeTruncated}>
                                    <Text ref={sizeRef} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                        {size}
                                    </Text>
                                </Tooltip>
                            </div>
                        )}
                    </>
                )}
                <div className={classNames("fileUploadList__cell", { showProgressLayout })}>
                    {!!actions?.length && (
                        <ButtonGroup size="small">
                            {actionsWithIds.map((action) =>
                                action.Icon ? (
                                    <Button
                                        key={action.id}
                                        {...action}
                                        layout="text"
                                        appearance="secondary"
                                        className="fileUploadList__button"
                                        aria-label={action["aria-label"] ?? "File action"}
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
