import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Image.scss";

interface IImageProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Image component props interface
}

/**
 * The Image Component is used to display visual content within an interface. It supports various image formats, sizes, and ratios, allowing for responsive and accessible image handling.
 */
const Image: FC<IImageProps> = ({ className }) => {
    return <div className={classNames("image", className)}>Image</div>;
};

export { IImageProps, Image as default };
