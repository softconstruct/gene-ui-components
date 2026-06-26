import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { ChevronLeft, ChevronRight, X } from "@geneui/icons";

import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./ImagePreview.scss";

import { Button, Text } from "../../../index";

interface IImagePreviewImage {
    /**
     * Image source path.
     */
    path: string;
    /**
     * Optional title displayed in the preview header.
     */
    title?: string;
}

interface IImagePreviewProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Image or a list of images for carousel navigation.
     */
    images?: IImagePreviewImage | IImagePreviewImage[];
    /**
     * Initial image index when `images` contains multiple items.
     * @default 0
     */
    defaultIndex?: number;
    /**
     * When `true`, renders the preview as a full-screen overlay using a portal.
     */
    withOverlay?: boolean;
    /**
     * Controls the visibility of the preview when `withOverlay` is `true`.
     */
    open?: boolean;
    /**
     * Callback fired when the close button is clicked in overlay mode.
     */
    onClose?: () => void;
}

/**
 * Image Preview component provides users with a detailed and enhanced view of an image. It’s commonly used in scenarios where users need to examine an image closely before taking an action.
 */
const ImagePreview: FC<IImagePreviewProps> = ({
    className,
    images,
    defaultIndex = 0,
    withOverlay = false,
    open = true,
    onClose
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;

    const imageList = useMemo(() => {
        if (!images) {
            return [];
        }

        return Array.isArray(images) ? images : [images];
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(defaultIndex);
    }, [images, defaultIndex]);

    const hasMultipleImages = imageList.length > 1;
    const currentImage = imageList[selectedIndex];
    const currentPath = currentImage?.path;

    const onPrevClick = () => {
        setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const onNextClick = () => {
        setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    const content = (
        <div
            className={classNames("imagePreview", className, {
                imagePreview_withOverlay: withOverlay
            })}
        >
            <div className="imagePreview__header">
                <div
                    className={classNames("imagePreview__headerInfo", className, {
                        imagePreview__headerInfo_withOverlay: withOverlay
                    })}
                >
                    {currentImage?.title && (
                        <Text as="span" variant="bodyMediumRegular">
                            {currentImage.title}
                        </Text>
                    )}
                    <Text as="span" variant="bodyMediumRegular">
                        2MB 700x394
                    </Text>
                </div>
                {withOverlay && (
                    <Button
                        appearance="inverse"
                        layout="fill"
                        size="medium"
                        Icon={X}
                        className="imagePreview__close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                )}
            </div>
            <div className="imagePreview__body">
                {hasMultipleImages && (
                    <Button
                        appearance="inverse"
                        layout="fill"
                        size="medium"
                        Icon={ChevronLeft}
                        className="imagePreview__nav imagePreview__nav_back"
                        aria-label="Previous image"
                        onClick={onPrevClick}
                    />
                )}
                <div className="imagePreview__imageWrapper">
                    {currentPath && <img src={currentPath} alt="" className="imagePreview__image" />}
                </div>
                {hasMultipleImages && (
                    <Button
                        appearance="inverse"
                        layout="fill"
                        size="medium"
                        Icon={ChevronRight}
                        className="imagePreview__nav imagePreview__nav_forward"
                        aria-label="Next image"
                        onClick={onNextClick}
                    />
                )}
            </div>
            <div className="imagePreview__footer">
                {hasMultipleImages && (
                    <span
                        className={classNames("imagePreview__count", {
                            imagePreview__count_withOverlay: withOverlay
                        })}
                    >
                        {selectedIndex + 1}/{imageList.length}
                    </span>
                )}
                <Controllers
                    withOverlay={withOverlay}
                    className={classNames("imagePreview__controllers", {
                        imagePreview__controllers_withOverlay: withOverlay
                    })}
                />
            </div>
        </div>
    );

    if (withOverlay && !open) {
        return null;
    }

    if (withOverlay) {
        return providerCurrent ? createPortal(content, providerCurrent) : null;
    }

    return content;
};

export { IImagePreviewImage, IImagePreviewProps, ImagePreview as default };
