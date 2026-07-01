import React, { CSSProperties, FC, MouseEvent, SyntheticEvent, useCallback, useMemo, useRef, useState } from "react";
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
    const [imageLayoutVersion, setImageLayoutVersion] = useState(0);

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

    const onImageLoadHandler = (event: SyntheticEvent<HTMLImageElement>) => {
        setImageLayoutVersion((version) => version + 1);
        onLoad?.(event);
    };

    const shouldShowGlass = withMagnifier && showMagnifier && isCursorInImageScope;

    const magnifierStyle = useMemo(
        () =>
            ({
                "--magnifier-rotation": `${rotation}deg`
            }) as CSSProperties,
        [rotation]
    );

    const glassClassName = classNames("magnifier__glass", {
        magnifier__glass_circle: magnifierAppearance === "circle"
    });

    const glassStyle = useMemo(() => {
        const imageElement = imageRef.current;
        const backgroundSize = imageElement
            ? `${imageElement.clientWidth * zoom}px ${imageElement.clientHeight * zoom}px`
            : "0 0";

        return {
            backgroundImage: `url(${imgUrl})`,
            backgroundSize,
            ...glassPositionStyles
        } as CSSProperties;
    }, [glassPositionStyles, imageLayoutVersion, imgUrl, zoom]);

    return (
        <div className="magnifier" style={magnifierStyle}>
            {shouldShowGlass && (
                <div
                    ref={glassRef}
                    className={glassClassName}
                    style={glassStyle}
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
                onLoad={onImageLoadHandler}
            />
        </div>
    );
};

export { IMagnifierProps, Magnifier as default };
