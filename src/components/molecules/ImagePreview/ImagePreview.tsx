import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { ChevronLeft, ChevronRight, X } from "@geneui/icons";

import Controllers from "@components/molecules/ImagePreview/Controllers/Controllers";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./ImagePreview.scss";

import { Button, Text } from "../../../index";

interface IImagePreviewProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Image source path or a list of paths for carousel navigation.
     */
    path?: string | string[];
    /**
     * Initial image index when `path` contains multiple items.
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
    path,
    defaultIndex = 0,
    withOverlay = false,
    open = true,
    onClose
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;

    const paths = useMemo(() => {
        if (!path) {
            return [];
        }

        return Array.isArray(path) ? path : [path];
    }, [path]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(defaultIndex);
    }, [path, defaultIndex]);

    const hasMultipleImages = paths.length > 1;
    const currentPath = paths[selectedIndex];

    const onPrevClick = () => {
        setSelectedIndex((prev) => (prev === 0 ? paths.length - 1 : prev - 1));
    };

    const onNextClick = () => {
        setSelectedIndex((prev) => (prev === paths.length - 1 ? 0 : prev + 1));
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
                    <Text as="span" variant="bodyMediumRegular">
                        Title
                    </Text>
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
                        {selectedIndex + 1}/{paths.length}
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

export { IImagePreviewProps, ImagePreview as default };
