import React, { FC, MouseEvent, SyntheticEvent, useCallback, useRef, useState } from "react";
import classNames from "classnames";

import {
    calculateMagnifierGlassStyles,
    IMagnifierGlassStyles,
    MAGNIFIER_DEFAULT_ZOOM
} from "@components/molecules/ImagePreview/Magnifier/Magnifier.helpers";

// Styles
import "./Magnifier.scss";

interface IMagnifierProps {
    /**
     * Image source path.
     */
    imgUrl: string;
    /**
     * Alternative text for the image.
     */
    alt?: string;
    /**
     * Additional class for the image element.
     */
    className?: string;
    /**
     * Enables magnifier functionality.
     */
    withMagnifier?: boolean;
    /**
     * Controls magnifier visibility.
     */
    showMagnifier?: boolean;
    /**
     * Current image rotation in degrees.
     */
    rotation?: number;
    /**
     * Magnifier zoom ratio.
     */
    zoom?: number;
    /**
     * Magnifier lens shape.
     */
    magnifierAppearance?: "square" | "circle";
    /**
     * Fires when the image finishes loading.
     */
    onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Renders an image with an optional magnifier lens that follows the cursor.
 */
const Magnifier: FC<IMagnifierProps> = ({
    imgUrl,
    alt = "",
    className,
    withMagnifier = false,
    showMagnifier = false,
    rotation = 0,
    zoom = MAGNIFIER_DEFAULT_ZOOM,
    magnifierAppearance = "square",
    onLoad
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const glassRef = useRef<HTMLDivElement | null>(null);

    const [isCursorInImageScope, setIsCursorInImageScope] = useState(false);
    const [glassPositionStyles, setGlassPositionStyles] = useState<IMagnifierGlassStyles>({});

    const onMouseMoveHandler = useCallback(
        (event: MouseEvent) => {
            if (!withMagnifier || !showMagnifier || !imageRef.current || !glassRef.current) {
                return;
            }

            event.preventDefault();

            const imageElement = imageRef.current;
            const container = imageElement.offsetParent as HTMLElement | null;

            if (!container) {
                return;
            }

            const glassWidth = glassRef.current.offsetWidth / 2;
            const glassHeight = glassRef.current.offsetHeight / 2;

            setGlassPositionStyles(
                calculateMagnifierGlassStyles({
                    clientX: event.clientX,
                    clientY: event.clientY,
                    containerRect: container.getBoundingClientRect(),
                    imageElement,
                    glassWidth,
                    glassHeight,
                    rotationDeg: rotation,
                    zoom
                })
            );
        },
        [rotation, showMagnifier, withMagnifier, zoom]
    );

    const onMouseEnterHandler = () => {
        if (showMagnifier) {
            setIsCursorInImageScope(true);
        }
    };

    const onMouseLeaveHandler = (event: MouseEvent) => {
        if (event.relatedTarget !== glassRef.current) {
            setIsCursorInImageScope(false);
        }
    };

    const shouldShowGlass = withMagnifier && showMagnifier && isCursorInImageScope;

    return (
        <div
            className="magnifier"
            style={{
                transform: `rotate(${rotation}deg)`
            }}
        >
            {shouldShowGlass && (
                <div
                    ref={glassRef}
                    className="magnifier__glass"
                    style={{
                        borderRadius: magnifierAppearance === "circle" ? "50%" : undefined,
                        backgroundImage: `url(${imgUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: imageRef.current
                            ? `${imageRef.current.clientWidth * zoom}px ${imageRef.current.clientHeight * zoom}px`
                            : "0 0",
                        ...glassPositionStyles
                    }}
                    onMouseLeave={onMouseLeaveHandler}
                    onMouseMove={onMouseMoveHandler}
                />
            )}
            <img
                ref={imageRef}
                src={imgUrl}
                alt={alt}
                className={classNames("magnifier__image", className)}
                onMouseEnter={onMouseEnterHandler}
                onMouseMove={(event) => showMagnifier && onMouseMoveHandler(event)}
                onLoad={onLoad}
            />
        </div>
    );
};

export { IMagnifierProps, Magnifier as default };
