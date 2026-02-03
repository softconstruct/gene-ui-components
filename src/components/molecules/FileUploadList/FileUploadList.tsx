import React, { FC } from "react";
import classNames from "classnames";

import "./FileUploadList.scss";

import FileUploadItem, { IFileUploadItem } from "./FileUploadItem";

interface IFileUploadListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Files to be rendered within the list.
     */
    files: IFileUploadItem[];
}

const FileUploadList: FC<IFileUploadListProps> = ({ className, files }) => {
    return (
        <div className={classNames("fileUploadList", className)}>
            {/* States => (image,audio,video, document) */}
            {files.map((item) => (
                <FileUploadItem key={item.id} {...item} />
            ))}
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
