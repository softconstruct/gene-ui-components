import React, { FC } from "react";
import classNames from "classnames";

import { Download, Eye, Image, RecycleBin } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

import "./FileUploadList.scss";

import { ButtonGroup } from "../../../index";

interface IFileUploadListProps {
    className?: string;
}

const FileUploadList: FC<IFileUploadListProps> = ({ className }) => {
    return (
        <div className={classNames("fileUploadList", className)}>
            {/* States => (image,audio,video, document) */}
            <div className="fileUploadList__row image">
                <div className="fileUploadList__item">
                    <div className="fileUploadList__file">
                        <Image
                            size={16}
                            color="rgba(85, 62, 183, 1)"
                            aria-hidden
                            className="fileUploadList__fileIcon"
                        />
                    </div>
                    <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                        Film Name
                    </Text>
                </div>
                <div className="fileUploadList__item">
                    <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                        10:03 AM
                    </Text>
                </div>
                <div className="fileUploadList__item">
                    <Text className="fileUploadList__text ellipsis-text" as="span" variant="labelMediumMedium">
                        1,3 MB
                    </Text>
                </div>
                <div className="fileUploadList__item">
                    <ButtonGroup className="fileUploadList__actions" size="small">
                        <Button
                            size="small"
                            layout="text"
                            appearance="secondary"
                            className="fileUploadList__button"
                            Icon={RecycleBin}
                        />

                        <Button
                            size="small"
                            layout="text"
                            appearance="secondary"
                            className="fileUploadList__button"
                            Icon={Download}
                        />
                        <Button
                            size="small"
                            layout="text"
                            appearance="secondary"
                            className="fileUploadList__button"
                            Icon={Eye}
                        />
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
