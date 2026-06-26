import React, { FC, SyntheticEvent, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { ChevronLeft, ChevronRight, X } from "@geneui/icons";

import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import Magnifier from "@components/molecules/ImagePreview/Magnifier/Magnifier";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./ImagePreview.scss";

import { Button, Text } from "../../../index";
import { downloadImage, formatFileSize, IMAGE_PREVIEW_ROTATION_STEP } from "./ImagePreview.helpers";

interface IImagePreviewImageMeta {
    size: number;
    width: number;
    height: number;
}

const defaultImageMeta: IImagePreviewImageMeta = {
    size: 0,
    width: 0,
    height: 0
};

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
    /**
     * Shows the image file size in the header.
     * @default true
     */
    showSize?: boolean;
    /**
     * Shows the image dimensions in the header.
     * @default true
     */
    showDimensions?: boolean;
    /**
     * Shows rotate controls in the footer.
     * @default true
     */
    showRotate?: boolean;
    /**
     * Shows download control in the footer.
     * @default true
     */
    showDownload?: boolean;
    /**
     * Enables magnifier functionality.
     * @default true
     */
    withMagnifier?: boolean;
    /**
     * Initial checked state of the magnifier switch.
     * @default false
     */
    magnifierDefaultValue?: boolean;
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
    onClose,
    showSize = true,
    showDimensions = true,
    showRotate = true,
    showDownload = true,
    withMagnifier = true,
    magnifierDefaultValue = false
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
    const [rotation, setRotation] = useState(0);
    const [isMagnifierOn, setIsMagnifierOn] = useState(magnifierDefaultValue);
    const [imageMeta, setImageMeta] = useState<IImagePreviewImageMeta>(defaultImageMeta);

    const hasMultipleImages = imageList.length > 1;
    const currentImage = imageList[selectedIndex];
    const currentPath = currentImage?.path;
    const shouldShowSize = showSize && imageMeta.size > 0;
    const shouldShowDimensions = showDimensions && imageMeta.width > 0 && imageMeta.height > 0;
    const canShowMetadata = showSize || showDimensions;
    const hasMetadataToDisplay = shouldShowSize || shouldShowDimensions;
    const shouldShowMetadata = canShowMetadata && hasMetadataToDisplay;
    const shouldShowMetaDivider = shouldShowSize && shouldShowDimensions;
    const shouldRenderControllers = withMagnifier || showRotate || showDownload;

    useEffect(() => {
        setSelectedIndex(defaultIndex);
    }, [images, defaultIndex]);

    useEffect(() => {
        setIsMagnifierOn(magnifierDefaultValue);
    }, [magnifierDefaultValue]);

    useEffect(() => {
        setRotation(0);
    }, [currentPath]);

    useEffect(() => {
        setImageMeta(defaultImageMeta);

        let isCancelled = false;

        if (currentPath && showSize) {
            fetch(currentPath)
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                    if (!isCancelled) {
                        setImageMeta((prev) => ({
                            ...prev,
                            size: buffer.byteLength
                        }));
                    }
                })
                .catch(() => {});
        }

        return () => {
            isCancelled = true;
        };
    }, [currentPath, showSize]);

    const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        if (!showDimensions) {
            return;
        }

        const { naturalWidth, naturalHeight } = event.currentTarget;

        setImageMeta((prev) => ({
            ...prev,
            width: naturalWidth,
            height: naturalHeight
        }));
    };

    const onPrevClick = () => {
        setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const onNextClick = () => {
        setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    const onRotateLeft = () => {
        setRotation((prev) => prev - IMAGE_PREVIEW_ROTATION_STEP);
    };

    const onRotateRight = () => {
        setRotation((prev) => prev + IMAGE_PREVIEW_ROTATION_STEP);
    };

    const onDownloadClick = () => {
        if (!currentPath) {
            return;
        }

        downloadImage(currentPath, currentImage?.title).catch(() => {});
    };

    const onMagnifierChange = (checked: boolean) => {
        setIsMagnifierOn(checked);
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
                    {shouldShowMetadata && (
                        <div className="imagePreview__meta">
                            {shouldShowSize && (
                                <Text as="span" variant="bodyMediumRegular">
                                    {formatFileSize(imageMeta.size)}
                                </Text>
                            )}
                            {shouldShowMetaDivider && <span className="imagePreview__metaDivider" aria-hidden="true" />}
                            {shouldShowDimensions && (
                                <Text as="span" variant="bodyMediumRegular">
                                    {`${imageMeta.width}x${imageMeta.height}`}
                                </Text>
                            )}
                        </div>
                    )}
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
                    {currentPath &&
                        (withMagnifier ? (
                            <Magnifier
                                imgUrl={currentPath}
                                alt={currentImage?.title || ""}
                                className="imagePreview__image"
                                withMagnifier
                                showMagnifier={isMagnifierOn}
                                rotation={rotation}
                                onLoad={onImageLoad}
                            />
                        ) : (
                            <img
                                src={currentPath}
                                alt={currentImage?.title || ""}
                                className="imagePreview__image"
                                style={{ transform: `rotate(${rotation}deg)` }}
                                onLoad={onImageLoad}
                            />
                        ))}
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
                {shouldRenderControllers && (
                    <Controllers
                        withOverlay={withOverlay}
                        withMagnifier={withMagnifier}
                        magnifierChecked={isMagnifierOn}
                        onMagnifierChange={onMagnifierChange}
                        showRotate={showRotate}
                        showDownload={showDownload}
                        onRotateLeft={onRotateLeft}
                        onRotateRight={onRotateRight}
                        onDownload={onDownloadClick}
                        className={classNames("imagePreview__controllers", {
                            imagePreview__controllers_withOverlay: withOverlay
                        })}
                    />
                )}
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
