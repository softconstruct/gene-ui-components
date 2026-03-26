import React, { FC, ReactNode } from "react";
import classNames from "classnames";

// Styles
import "./FileUploadList.scss";

interface IFileUploadListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The file upload items to be rendered within the list.
     * If not provided, the component renders `null`.
     * Expects one or more `FileUploadItem` components.
     */
    children?: ReactNode;
}

/**
 * File Upload List component is designed to facilitate the display and management of files uploaded by users.
 * This component provides a clear and organized list of uploaded files, including key details such as file name, size, date, and actions for each file.
 */
const FileUploadList: FC<IFileUploadListProps> = ({ className, children }) => {
    if (!children) return null;

    return (
        <div className={classNames("fileUploadList", className)} role="list" aria-label="Uploaded files list">
            {children}
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
