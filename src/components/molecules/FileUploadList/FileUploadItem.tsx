import React, { FC, MouseEvent } from "react";
import classNames from "classnames";

import { IconProps, X } from "@geneui/icons";

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

export interface IActionProp {
    /**
     * Icon rendered inside the action button.
     */
    Icon: React.FC<IconProps>;
    /**
     * Click handler for the action button.
     * Receives the file item's unique identifier (id) and the mouse event.
     */
    actionHandler: (id: string | number, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Cancels the upload when the file is in loading state.
     * Receives the file item's unique identifier (id).
     */
    onCancel?: (id: string | number) => void;
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
     * Action buttons available for the file row.
     */
    actions: IActionProp[];
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
    id
}) => {
    const cancelAction = actions.find(({ onCancel }) => Boolean(onCancel));

    let visibleActions: IActionProp[];
    if (loading) {
        visibleActions = cancelAction ? [cancelAction] : [];
    } else {
        visibleActions = actions.filter(({ onCancel }) => !onCancel);
    }

    return (
        <div className={classNames("fileUploadList", className)}>
            {/* States => (image,audio,video, document) */}
            <div className="fileUploadList__row audio">
                {loading ? (
                    <div className="fileUploadList__item fileUploadList__item--progress">
                        <ProgressBar
                            percent={progressPercent}
                            size="small"
                            uploadingText="Uploading"
                            type="determinate"
                            label={name}
                            className="fileUploadList__progress"
                        />
                    </div>
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
                    </>
                )}
                <div
                    className={classNames("fileUploadList__item", { "fileUploadList__item--actionsLoading": loading })}
                >
                    <ButtonGroup className="fileUploadList__actions" size="small">
                        {visibleActions.map(({ Icon: ActionIcon, actionHandler, onCancel }) => {
                            const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
                                if (loading && onCancel) {
                                    onCancel(id);
                                } else {
                                    actionHandler(id, event);
                                }
                            };
                            return (
                                <Button
                                    key={`action-${ActionIcon.name || ActionIcon.displayName || Math.random()}`}
                                    size="small"
                                    layout="text"
                                    appearance="secondary"
                                    className="fileUploadList__button"
                                    Icon={ActionIcon ?? X}
                                    onClick={handleClick}
                                />
                            );
                        })}
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export { IFileUploadItem, IBlobProps, FileUploadItem as default };
