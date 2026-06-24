import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./ImagePreview.scss";

interface IImagePreviewProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ImagePreview component props interface
}

/**
 * Image Preview component provides users with a detailed and enhanced view of an image. It’s commonly used in scenarios where users need to examine an image closely before taking an action.
 */
const ImagePreview: FC<IImagePreviewProps> = ({ className }) => {
    return <div className={classNames("imagePreview", className)}>ImagePreview</div>;
};

export { IImagePreviewProps, ImagePreview as default };
