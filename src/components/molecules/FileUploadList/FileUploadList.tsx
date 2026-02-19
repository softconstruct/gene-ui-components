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
     * Provide `FileUploadItem` components to be rendered in the list.
     */
    children: ReactNode;
}

const FileUploadList: FC<IFileUploadListProps> = ({ className, children }) => {
    return (
        <div className={classNames("fileUploadList", className)} role="list" aria-label="Uploaded files list">
            {children}
        </div>
    );
};

export { IFileUploadListProps, FileUploadList as default };
