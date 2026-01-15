import React, { FC, MouseEvent, useMemo } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

import { IconProps } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

import "./FileUploadList.scss";

import { ButtonGroup, ProgressBar } from "../../../index";

interface IBlobProps {
    /**
     * Human readable size of the uploaded file (e.g. 10MB).
     */
    size: string;
    /**
     * File type used for setting visual state (image, audio, etc.).
     */
    type: string;
}

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
     * Optional custom class for overriding default styles.
     */
    className?: string;
    /**
     * Display name of the file.
     */
    name: string;
    /**
     * Time when the file was uploaded or processed.
     */
    time: string;
    /**
     * Basic metadata such as size and type.
     */
    blob: IBlobProps;
    /**
     * An array of action button objects to display in the file upload item.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each action button is rendered with `layout="text"` and `appearance="secondary"` (these cannot be overridden).
     * For icon-only buttons, use the `Icon` prop (required).
     * @example
     * actions={[
     *   { Icon: Eye, onClick: handleAction },
     *   { Icon: Download, onClick: handleDownload },
     *   { Icon: X, onCancel: handleCancel }
     * ]}
     */
    actions?: IFileUploadActionProps[];
    /**
     * Icon representing the file type.
     */
    Icon: React.FC<IconProps>;
    /**
     * Unique identifier for the file item.
     */
    id: string | number;
    /**
     * Indicates if the file is currently being uploaded.
     */
    loading?: boolean;
    /**
     * Progress percentage for the upload (0-100).
     */
    progressPercent?: number;
    /**
     * Indicates an error state for the upload.
     */
    error?: boolean;
    /**
     * Helper text displayed below the progress bar (e.g., error messages).
     */
    helperText?: string;
    /**
     * Text displayed during upload progress.
     */
    uploadingText?: string;
}

const FileUploadItem: FC<IFileUploadItem> = ({
    className,
    name,
    time,
    blob,
    Icon,
    actions,
    loading,
    progressPercent,
    id,
    error,
    helperText,
    uploadingText
}) => {
    const hasActions = actions && actions.length > 0;

    const actionsWithIds = useMemo(() => {
        if (!actions) return [];
        return actions.map((action) => {
            const { onCancel, ...restAction } = action;
            return {
                ...restAction,
                id: action.id || `fileUpload-action-${nanoid()}`,
                onClick: onCancel
                    ? () => {
                          onCancel(id);
                      }
                    : action.onClick
            };
        });
    }, [actions, id]);

    return (
        <div className={classNames("fileUploadList", className)}>
            {/* States => (image,audio,video, document) */}
            <div className="fileUploadList__row audio">
                {loading || error ? (
                    <>
                        <div className="fileUploadList__item fileUploadList__item--withProgress">
                            <div className="fileUploadList__file">
                                <Icon className={`fileUploadList__fileIcon ${"avatar__icon"}`} size={16} />
                            </div>
                            <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                                {name}
                            </Text>
                        </div>
                        <div className="fileUploadList__item" />
                        <div className="fileUploadList__item" />
                        <div
                            className={classNames("fileUploadList__item", {
                                "fileUploadList__item--actionsLoading": loading || error
                            })}
                        >
                            {hasActions && (
                                <ButtonGroup className="fileUploadList__actions" size="small">
                                    {actionsWithIds.map((action) => {
                                        return action.Icon ? (
                                            <Button
                                                key={action.id}
                                                {...action}
                                                layout="text"
                                                appearance="secondary"
                                                className="fileUploadList__button"
                                            />
                                        ) : null;
                                    })}
                                </ButtonGroup>
                            )}
                        </div>
                        <div className="fileUploadList__item fileUploadList__item--progress">
                            <ProgressBar
                                percent={progressPercent}
                                size="small"
                                uploadingText={uploadingText}
                                type="determinate"
                                className="fileUploadList__progress"
                                error={error}
                                helperText={helperText}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="fileUploadList__item">
                            <div className="fileUploadList__file">
                                <Icon className={`fileUploadList__fileIcon ${"avatar__icon"}`} size={16} />
                            </div>
                            <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                                {name}
                            </Text>
                        </div>
                        <div className="fileUploadList__item">
                            <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                                {time}
                            </Text>
                        </div>
                        <div className="fileUploadList__item">
                            <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                                {blob.size}
                            </Text>
                        </div>
                        <div className="fileUploadList__item">
                            {hasActions && (
                                <ButtonGroup className="fileUploadList__actions" size="small">
                                    {actionsWithIds.map((action) => {
                                        return action.Icon ? (
                                            <Button
                                                key={action.id}
                                                {...action}
                                                layout="text"
                                                appearance="secondary"
                                                className="fileUploadList__button"
                                            />
                                        ) : null;
                                    })}
                                </ButtonGroup>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export { IFileUploadItem, IBlobProps, FileUploadItem as default };
