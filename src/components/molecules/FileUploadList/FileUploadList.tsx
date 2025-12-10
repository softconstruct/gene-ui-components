import React, { FC } from "react";
import classNames from "classnames";

import "./FileUploadList.scss";

import FileUploadItem, { IFileUploadItem } from "./FileUploadItem";

interface IFileUploadListProps {
    /**
     * Optional custom class for styling overrides.
     */
    className?: string;
    /**
     * Files to be rendered within the list.
     */
    data: IFileUploadItem[];
}

const FileUploadList: FC<IFileUploadListProps> = ({ className, data }) => {
    return (
        <div className={classNames("fileUploadList", className)}>
            {/* States => (image,audio,video, document) */}
            {data.map((item) => (
                <FileUploadItem key={item.id} {...item} />
            ))}
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
