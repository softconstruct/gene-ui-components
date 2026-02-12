import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./FileUploadList.scss";

// Components
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
        <div className={classNames("fileUploadList", className)} role="list" aria-label="Uploaded files list">
            {files.map((item, index) => (
                <FileUploadItem
                    key={item.id ?? `fallback-${index}`}
                    {...item}
                    aria-label={
                        item["aria-label"] ??
                        `File: ${item.name ?? "Unnamed"}, Size: ${item.blob?.size ?? "Unknown"}, Time: ${item.time ?? "--:--"}`
                    }
                />
            ))}
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
