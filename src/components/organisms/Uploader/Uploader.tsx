import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Uploader.scss";

interface IUploaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Uploader component props interface
}

/**
 * Uploader component allows users to select and upload files from their device to a system or application. It supports various file types and sizes, providing feedback on the upload process through progress indicators. Component includes features like drag-and-drop functionality, multiple file uploads, and validation rules to ensure that only appropriate files are uploaded.
 */
const Uploader: FC<IUploaderProps> = ({ className }) => {
    return <div className={classNames("uploader", className)}>Uploader</div>;
};

export { IUploaderProps, Uploader as default };
