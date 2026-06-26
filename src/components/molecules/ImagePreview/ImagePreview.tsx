import React, { FC, useContext } from "react";
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
const ImagePreview: FC<IImagePreviewProps> = ({ className, withOverlay = false, open = true, onClose }) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const providerCurrent = geneUIProviderRef.current;

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
                <Button
                    appearance="inverse"
                    layout="fill"
                    size="medium"
                    Icon={ChevronLeft}
                    className="imagePreview__close"
                />
                <div>image</div>
                <Button
                    appearance="inverse"
                    layout="fill"
                    size="medium"
                    Icon={ChevronRight}
                    className="imagePreview__close"
                />
            </div>
            <div className="imagePreview__footer">
                <span
                    className={classNames("imagePreview__count", {
                        imagePreview__count_withOverlay: withOverlay
                    })}
                >
                    12/23
                </span>
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
