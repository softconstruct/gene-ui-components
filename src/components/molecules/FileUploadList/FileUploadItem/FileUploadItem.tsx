import React, { FC, MouseEvent, useRef } from "react";
import classNames from "classnames";

// Icons
import { IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
// Mappers
import { icons } from "@components/molecules/FileUploadList/FileUploadItem/mappers";
// Types
import { FileType } from "@components/molecules/FileUploadList/FileUploadItem/types";
import ProgressBar from "@components/molecules/ProgressBar";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./FileUploadItem.scss";

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
     * @default "Unnamed file"
     */
    name?: string;
    /**
     * The formatted timestamp indicating when the file was uploaded or processed.
     */
    time?: string;
    /**
     * Human-readable representation of the file size (e.g., "10MB", "4.2MB").
     * @default "Unknown"
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
    /**
     * Accessible label for the list item container.
     */
    ariaLabel?: string;
}

const FileUploadItem: FC<IFileUploadItemProps> = ({
    name = "Unnamed file",
    time,
    size = "Unknown",
    type = "file",
    actions,
    loading,
    progressPercent,
    status = "rest",
    helperText,
    uploadingText,
    ariaLabel
}) => {
    const Icon = icons[type];

    const nameRef = useRef<HTMLSpanElement>(null);
    const timeRef = useRef<HTMLSpanElement>(null);
    const sizeRef = useRef<HTMLSpanElement>(null);
    const isNameTruncated = useEllipsisDetection(nameRef, []);
    const isTimeTruncated = useEllipsisDetection(timeRef, []);
    const isSizeTruncated = useEllipsisDetection(sizeRef, []);

    const shouldShowProgressBar = loading || status === "error" || status === "warning";
    const shouldShowItemActions = actions && actions.length > 0;

    const listItemDataColumns = [
        {
            id: "time",
            value: time,
            ref: timeRef,
            isTruncated: isTimeTruncated,
            visible: !shouldShowProgressBar
        },
        {
            id: "size",
            value: size,
            ref: sizeRef,
            isTruncated: isSizeTruncated,
            visible: !shouldShowProgressBar
        }
    ];

    return (
        <div className="fileUploadItem__itemWrapper">
            <div className={classNames("fileUploadItem__item")} role="listitem" aria-label={ariaLabel}>
                <div className="fileUploadItem__cell">
                    <div className={classNames("fileUploadItem__file", `fileUploadItem__file_type_${type}`)}>
                        <Icon className="fileUploadItem__fileIcon" size={16} />
                    </div>
                    <Tooltip text={name} isVisible={isNameTruncated}>
                        <Text
                            ref={nameRef}
                            className={classNames("ellipsis-text", { fileUploadItem__text: shouldShowProgressBar })}
                            as="span"
                            variant="labelMediumMedium"
                        >
                            {name}
                        </Text>
                    </Tooltip>
                </div>
                {listItemDataColumns.map(
                    ({ id, value, ref, visible, isTruncated }) =>
                        value &&
                        visible && (
                            <div key={id} className="fileUploadItem__cell">
                                <Tooltip text={value} isVisible={isTruncated}>
                                    <Text ref={ref} className="ellipsis-text" as="span" variant="labelMediumMedium">
                                        {value}
                                    </Text>
                                </Tooltip>
                            </div>
                        )
                )}
                {shouldShowItemActions && (
                    <div className={classNames("fileUploadItem__cell")}>
                        <ButtonGroup size="small">
                            {actions.map((action) => (
                                <Button
                                    key={action.name}
                                    {...action}
                                    layout="text"
                                    appearance="secondary"
                                    className="fileUploadItem__button"
                                />
                            ))}
                        </ButtonGroup>
                    </div>
                )}
            </div>
            {shouldShowProgressBar && (
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

export { IFileUploadItemProps, FileUploadItem as default };
