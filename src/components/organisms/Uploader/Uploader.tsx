import React, { FC } from "react";
import classNames from "classnames";

import { Download } from "@geneui/icons";

// Styles
import "./Uploader.scss";

import { Button, Text } from "../../../index";

interface IUploaderProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Defines the visual style of the uploader.<br>
     * Possible values: `dropZone | button`<br>
     * `dropZone` provides a large interactive area for dragging files, while `button` provides a standard button trigger.
     */
    type?: "dropZone" | "button";
    /**
     * The main label text displayed above the uploader.
     */
    label?: string;
    /**
     * Supplementary descriptive text displayed within the uploader.<br>
     * For the `button` type, it appears between the label and upload button; for the `dropZone` type, it appears inside the drop area.
     */
    description?: string;
}

/**
 * Uploader component allows users to select and upload files from their device to a system or application. It supports various file types and sizes, providing feedback on the upload process through progress indicators. Component includes features like drag-and-drop functionality, multiple file uploads, and validation rules to ensure that only appropriate files are uploaded.
 */
const Uploader: FC<IUploaderProps> = ({ className, type = "dropZone", label, description }) => {
    const isDropZone = type === "dropZone";
    return (
        <div className={classNames("uploader", `uploader_type${type}`, className)}>
            {label && <div className="uploader__label">{label}</div>}
            {isDropZone ? (
                <div className="uploader__dropZone">
                    {description && (
                        <Text as="span" variant="bodyMediumRegular">
                            {description}
                        </Text>
                    )}
                </div>
            ) : (
                <div className="uploader__buttonWrapper">
                    {description && (
                        <Text as="span" variant="bodyMediumRegular">
                            {description}
                        </Text>
                    )}
                    <Button className="uploader__button" appearance="primary" layout="fill" Icon={Download}>
                        Upload
                    </Button>
                </div>
            )}
        </div>
    );
};

export { IUploaderProps, Uploader as default };
