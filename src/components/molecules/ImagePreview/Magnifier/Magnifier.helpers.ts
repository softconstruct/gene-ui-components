export const MAGNIFIER_BUFFER_SIZE = 40;
export const MAGNIFIER_BORDER_WIDTH = 2;
export const MAGNIFIER_DEFAULT_ZOOM = 2;
export const MAGNIFIER_GLASS_SIZE = 150;

export interface IMagnifierGlassStyles {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    backgroundPosition?: string;
}

interface ICalculateMagnifierGlassStylesParams {
    clientX: number;
    clientY: number;
    containerRect: DOMRect;
    imageElement: HTMLImageElement;
    glassWidth: number;
    glassHeight: number;
    rotationDeg: number;
    zoom: number;
}

/**
 * Calculates magnifier glass position and background offset based on cursor position.
 */
export const calculateMagnifierGlassStyles = ({
    clientX,
    clientY,
    containerRect,
    imageElement,
    glassWidth,
    glassHeight,
    rotationDeg,
    zoom
}: ICalculateMagnifierGlassStylesParams): IMagnifierGlassStyles => {
    const absRotationDeg = Math.abs(rotationDeg);
    const { bottom, height, left, right, top, width } = containerRect;

    let x = clientX - left - glassWidth;
    let y = clientY - top - glassHeight;

    if (clientX < left + MAGNIFIER_BUFFER_SIZE) {
        x = -glassWidth + MAGNIFIER_BUFFER_SIZE;
    }

    if (clientX > right - MAGNIFIER_BUFFER_SIZE) {
        x = width - MAGNIFIER_BUFFER_SIZE - glassWidth;
    }

    if (clientY < top + MAGNIFIER_BUFFER_SIZE) {
        y = -glassHeight + MAGNIFIER_BUFFER_SIZE;
    }

    if (clientY > bottom - MAGNIFIER_BUFFER_SIZE) {
        y = height - glassHeight - MAGNIFIER_BUFFER_SIZE;
    }

    const styles: IMagnifierGlassStyles = {};

    if (rotationDeg === 0 || absRotationDeg === 180) {
        if (rotationDeg === 0) {
            styles.left = `${x}px`;
            styles.top = `${y}px`;

            const glassX = x * zoom + MAGNIFIER_BUFFER_SIZE * zoom + MAGNIFIER_BORDER_WIDTH * 2;
            const glassY = y * zoom + MAGNIFIER_BUFFER_SIZE * zoom + MAGNIFIER_BORDER_WIDTH * 2;

            styles.backgroundPosition = `-${glassX}px -${glassY}px`;
        }

        if (absRotationDeg === 180) {
            styles.right = `${x}px`;
            styles.bottom = `${y}px`;

            const glassX =
                width * zoom - glassWidth - MAGNIFIER_BUFFER_SIZE * zoom - (x * zoom + MAGNIFIER_BUFFER_SIZE * zoom);
            const glassY =
                height * zoom - glassHeight - MAGNIFIER_BUFFER_SIZE * zoom - (y * zoom + MAGNIFIER_BUFFER_SIZE * zoom);

            styles.backgroundPosition = `-${glassX}px -${glassY}px`;
        }
    }

    if (absRotationDeg === 90 || absRotationDeg === 270) {
        if (rotationDeg === 90 || rotationDeg === -270) {
            styles.bottom = `${x}px`;
            styles.left = `${y}px`;

            const glassX =
                imageElement.height * zoom -
                glassHeight -
                MAGNIFIER_BUFFER_SIZE * zoom -
                (x * zoom + MAGNIFIER_BUFFER_SIZE * zoom);
            const glassY = y * zoom + MAGNIFIER_BUFFER_SIZE * zoom;

            styles.backgroundPosition = `-${glassY}px -${glassX}px`;
        }

        if (rotationDeg === 270 || rotationDeg === -90) {
            styles.top = `${x}px`;
            styles.right = `${y}px`;

            const glassX = x * zoom + MAGNIFIER_BUFFER_SIZE * zoom;
            const glassY =
                imageElement.width * zoom -
                glassWidth -
                MAGNIFIER_BUFFER_SIZE * zoom -
                (y * zoom + MAGNIFIER_BUFFER_SIZE * zoom);

            styles.backgroundPosition = `-${glassY}px -${glassX}px`;
        }
    }

    return styles;
};
