const MAGNIFIER_BUFFER_SIZE = 40;
const MAGNIFIER_BORDER_WIDTH = 2;
const MAGNIFIER_BORDER_OFFSET = MAGNIFIER_BORDER_WIDTH * 2;

const FULL_CIRCLE_DEG = 360;
const ROTATION_0_DEG = 0;
const ROTATION_90_DEG = 90;
const ROTATION_180_DEG = 180;
const ROTATION_270_DEG = 270;

export const MAGNIFIER_DEFAULT_ZOOM = 2;

export interface IMagnifierGlassStyles {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    backgroundPosition?: string;
}

/**
 * Normalizes rotation to a value between 0 and 359 degrees.
 */
export const normalizeRotationDeg = (rotationDeg: number): number =>
    ((rotationDeg % FULL_CIRCLE_DEG) + FULL_CIRCLE_DEG) % FULL_CIRCLE_DEG;

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
    const normalizedRotationDeg = normalizeRotationDeg(rotationDeg);
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
    const scaledBuffer = MAGNIFIER_BUFFER_SIZE * zoom;

    if (normalizedRotationDeg === ROTATION_0_DEG) {
        styles.left = `${x}px`;
        styles.top = `${y}px`;

        const glassX = x * zoom + scaledBuffer + MAGNIFIER_BORDER_OFFSET;
        const glassY = y * zoom + scaledBuffer + MAGNIFIER_BORDER_OFFSET;

        styles.backgroundPosition = `-${glassX}px -${glassY}px`;
    }

    if (normalizedRotationDeg === ROTATION_180_DEG) {
        styles.right = `${x}px`;
        styles.bottom = `${y}px`;

        const glassX = width * zoom - glassWidth - scaledBuffer - (x * zoom + scaledBuffer);
        const glassY = height * zoom - glassHeight - scaledBuffer - (y * zoom + scaledBuffer);

        styles.backgroundPosition = `-${glassX}px -${glassY}px`;
    }

    if (normalizedRotationDeg === ROTATION_90_DEG) {
        styles.bottom = `${x}px`;
        styles.left = `${y}px`;

        const glassX = imageElement.height * zoom - glassHeight - scaledBuffer - (x * zoom + scaledBuffer);
        const glassY = y * zoom + scaledBuffer;

        styles.backgroundPosition = `-${glassY}px -${glassX}px`;
    }

    if (normalizedRotationDeg === ROTATION_270_DEG) {
        styles.top = `${x}px`;
        styles.right = `${y}px`;

        const glassX = x * zoom + scaledBuffer;
        const glassY = imageElement.width * zoom - glassWidth - scaledBuffer - (y * zoom + scaledBuffer);

        styles.backgroundPosition = `-${glassY}px -${glassX}px`;
    }

    return styles;
};
