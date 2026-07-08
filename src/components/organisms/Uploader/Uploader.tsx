import React, { ChangeEvent, FC, useRef } from "react";
import classNames from "classnames";

import { Upload } from "@geneui/icons";

// Styles
import "./Uploader.scss";

import { Button, Text, TextLink } from "../../../index";

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
    /**
     * Callback fired when the user selects files through the native file picker.
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    // TODO: Add `accept` prop to restrict file types (e.g. "image/*,.pdf") on the native file input.
    /**
     * When `true`, allows selecting multiple files at once.
     */
    multiple?: boolean;
    /**
     * When `true`, disables the upload button and prevents file selection.
     */
    disabled?: boolean;
}

/**
 * Uploader component allows users to select and upload files from their device to a system or application. It supports various file types and sizes, providing feedback on the upload process through progress indicators. Component includes features like drag-and-drop functionality, multiple file uploads, and validation rules to ensure that only appropriate files are uploaded.
 */
const Uploader: FC<IUploaderProps> = ({
    className,
    type = "dropZone",
    label,
    description,
    onChange,
    multiple,
    disabled
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isDropZone = type === "dropZone";

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);

        const { current: fileInput } = fileInputRef;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleButtonClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={classNames("uploader", `uploader_type${type}`, className)}>
            {label && <div className="uploader__label">{label}</div>}
            {isDropZone ? (
                <div className="uploader__dropZone">
                    <TextLink text="Upload File" href="#" underline size="large" />
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="uploader__input"
                        multiple={multiple}
                        onChange={handleFileInputChange}
                        disabled={disabled}
                    />
                    <Button
                        className="uploader__button"
                        appearance="primary"
                        layout="fill"
                        Icon={Upload}
                        disabled={disabled}
                        onClick={handleButtonClick}
                    >
                        Upload
                    </Button>
                </div>
            )}
        </div>
    );
};

export { IUploaderProps, Uploader as default };
