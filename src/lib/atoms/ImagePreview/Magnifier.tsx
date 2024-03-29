import React, { forwardRef, MouseEvent, useCallback, useImperativeHandle, useRef, useState } from 'react';

interface IMagnifierProps {
    /**
     * Image path to display. <span style="color: red">( Required )</span>
     */
    imgUrl: string;
    /**
     * On or off rotation functionality
     */
    withRotation?: boolean;
    /**
     * On or off magnifier functionality
     */
    withMagnifier?: boolean;
    /**
     * Zoom Ratio
     */
    zoom?: number;
    /**
     * Hide or show magnifier
     */
    showMagnifier?: boolean;
    /**
     * Name for image alt
     */
    name?: string;
    /**
     * Additional className for img
     */
    className?: string;
    /**
     * Shape for magnifier
     */
    magnifierAppearance?: 'square' | 'circle';
}

interface IStylesProps {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    backgroundPosition?: string;
}

const magnifierAppearances = {
    square: 'square',
    circle: 'circle'
};

const bufferSize = 40;
const borderWidth = 2;

interface IMagnifierForwardRef {
    rotate?: (deg?: number) => void;
}

const Magnifier = forwardRef<IMagnifierForwardRef, IMagnifierProps>(
    (
        {
            imgUrl,
            className,
            name,
            withRotation = false,
            withMagnifier = false,
            showMagnifier = false,
            zoom = 1.5,
            magnifierAppearance = magnifierAppearances.square
        },
        ref
    ) => {
        const imgRef = useRef<HTMLImageElement | null>(null);
        const glassRef = useRef<HTMLDivElement | null>(null);

        const [rotationDeg, setRotationDeg] = useState(0);
        const [isCursorInScopeOfImage, setIsCursorInScopeOfImage] = useState(false);
        const [glassPositionStyles, setGlassPositionStyles] = useState<IStylesProps>({});

        const rotate = (deg = 90) => {
            if (!withRotation) return;
            const newDeg = rotationDeg + deg;
            setRotationDeg(Math.abs(newDeg) >= 360 ? 0 : newDeg);
        };

        useImperativeHandle(ref, () => ({
            rotate
        }));

        const onMouseMoveHandler = useCallback(
            (e: MouseEvent) => {
                // Prevent any calculation in case of magnifier is turned off
                if (!withMagnifier || !imgRef.current || !glassRef.current) return;

                e.preventDefault();

                const img = imgRef.current;
                const cnt = img.offsetParent;

                if (!cnt) return;

                const glassWidth = glassRef.current?.offsetWidth / 2;
                const glassHeight = glassRef.current?.offsetHeight / 2;

                // Positive value of rotation deg
                const absRotationDeg = Math.abs(rotationDeg);

                const { clientX, clientY } = e;

                const stylesProps: IStylesProps = {};

                // @TODO need move to useMemo hooks for better performance
                const { bottom, height, left, right, top, width } = cnt.getBoundingClientRect();

                let x = clientX - left - glassWidth;
                let y = clientY - top - glassHeight;

                // Calculate horizontal thresholds for img
                if (clientX < left + bufferSize) x = -glassWidth + bufferSize;
                if (clientX > right - bufferSize) x = width - bufferSize - glassWidth;

                // Calculate vertical thresholds for img
                if (clientY < top + bufferSize) y = -glassHeight + bufferSize;
                if (clientY > bottom - bufferSize) y = height - glassHeight - bufferSize;

                // Handle vertical rotation cases
                if (rotationDeg === 0 || absRotationDeg === 180) {
                    if (rotationDeg === 0) {
                        // Adoption coordinates values to img sides
                        stylesProps.left = `${x}px`;
                        stylesProps.top = `${y}px`;

                        // Calculate zoomed image positions
                        const glassX = x * zoom + bufferSize * zoom + borderWidth * 2;
                        const glassY = y * zoom + bufferSize * zoom + borderWidth * 2;

                        stylesProps.backgroundPosition = `-${glassX}px -${glassY}px`;
                    }

                    if (absRotationDeg === 180) {
                        // Adoption coordinates values to img sides
                        stylesProps.right = `${x}px`;
                        stylesProps.bottom = `${y}px`;

                        // Calculate zoomed image positions
                        const glassX = width * zoom - glassWidth - 40 * zoom - (x * zoom + 40 * zoom);
                        const glassY = height * zoom - glassHeight - 40 * zoom - (y * zoom + 40 * zoom);

                        stylesProps.backgroundPosition = `-${glassX}px -${glassY}px`;
                    }
                }

                // Handle horizontal rotation cases
                if (absRotationDeg === 90 || absRotationDeg === 270) {
                    if (rotationDeg === 90 || rotationDeg === -270) {
                        // Adoption coordinates values to img sides
                        stylesProps.bottom = `${x}px`; // x
                        stylesProps.left = `${y}px`; // y

                        // Calculate zoomed image positions
                        const glassX = img.height * zoom - glassHeight - 40 * zoom - (x * zoom + 40 * zoom);
                        const glassY = y * zoom + 40 * zoom;

                        stylesProps.backgroundPosition = `-${glassY}px -${glassX}px`;
                    }

                    if (rotationDeg === 270 || rotationDeg === -90) {
                        // Adoption coordinates values to img sides
                        stylesProps.top = `${x}px`; // x
                        stylesProps.right = `${y}px`; // y

                        // Calculate zoomed image positions
                        const glassX = x * zoom + 40 * zoom;
                        const glassY = img.width * zoom - glassWidth - 40 * zoom - (y * zoom + 40 * zoom);

                        stylesProps.backgroundPosition = `-${glassY}px -${glassX}px`;
                    }
                }

                setGlassPositionStyles(stylesProps);
            },
            [rotationDeg]
        );

        const onMouseEnterHandler = () => showMagnifier && setIsCursorInScopeOfImage(true);

        const onMouseLeaveHandler = (e: MouseEvent) => {
            if (e.relatedTarget !== glassRef.current) {
                setIsCursorInScopeOfImage(false);
            }
        };

        return (
            <>
                <div
                    className="imgMagnifier"
                    style={{
                        transform: `rotateZ(${rotationDeg}deg)`
                    }}
                >
                    {withMagnifier && showMagnifier && isCursorInScopeOfImage && (
                        <div
                            ref={glassRef}
                            className="imgMagnifier__glass"
                            style={{
                                borderRadius: `${magnifierAppearance === magnifierAppearances.circle ? 50 : 0}%`,
                                backgroundImage: `url(${imgUrl})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: imgRef.current
                                    ? `${imgRef.current.clientWidth * zoom}px ${imgRef.current.clientHeight * zoom}px`
                                    : `0 0`,
                                ...glassPositionStyles
                            }}
                            onMouseLeave={onMouseLeaveHandler}
                            onMouseMove={onMouseMoveHandler}
                        />
                    )}
                    <img
                        ref={imgRef}
                        src={imgUrl}
                        alt={name}
                        onMouseEnter={onMouseEnterHandler}
                        onMouseMove={(e) => showMagnifier && onMouseMoveHandler(e)}
                        className={`imgMagnifier__img ${className}`}
                    />
                </div>
            </>
        );
    }
);

export { IMagnifierProps, IMagnifierForwardRef, Magnifier as default };
