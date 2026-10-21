import { MouseEvent, RefObject, TouchEvent, useCallback, useEffect, useRef } from "react";

/**
 * Handles complex drag-and-drop pointer calculations across palettes and sliders.
 * Employs the "latest-ref" pattern to guarantee 60fps tracking without triggering React re-renders.
 * @param elementRef - The HTML element acting as the drag boundary (e.g., the slider track).
 * @param onDragChange - Callback providing the relative X and Y positions (normalized between 0 and 1).
 * @returns A mouse/touch event handler to attach to `onMouseDown` and `onTouchStart`.
 */
export const usePointerDrag = (
    elementRef: RefObject<HTMLElement>,
    onDragChange: (relativeHorizontalPos: number, relativeVerticalPos: number) => void
) => {
    const latestOnChangeRef = useRef(onDragChange);

    useEffect(() => {
        latestOnChangeRef.current = onDragChange;
    }, [onDragChange]);

    return useCallback(
        (interactionEvent: MouseEvent | TouchEvent) => {
            interactionEvent.preventDefault();

            const targetElement = elementRef.current;
            if (!targetElement) return;

            const calculateAndEmitPosition = (clientX: number, clientY: number) => {
                const boundingBox = targetElement.getBoundingClientRect();
                const boundedX = Math.min(Math.max(clientX - boundingBox.left, 0), boundingBox.width);
                const boundedY = Math.min(Math.max(clientY - boundingBox.top, 0), boundingBox.height);

                const relativeHorizontalPos = boundingBox.width === 0 ? 0 : boundedX / boundingBox.width;
                const relativeVerticalPos = boundingBox.height === 0 ? 0 : boundedY / boundingBox.height;

                latestOnChangeRef.current(relativeHorizontalPos, relativeVerticalPos);
            };

            const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
                calculateAndEmitPosition(moveEvent.clientX, moveEvent.clientY);
            };

            const handleTouchMove = (moveEvent: globalThis.TouchEvent) => {
                const activeTouch = moveEvent.touches[0];
                if (activeTouch) {
                    calculateAndEmitPosition(activeTouch.clientX, activeTouch.clientY);
                }
            };

            const handlePointerUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("mouseup", handlePointerUp);
                window.removeEventListener("touchend", handlePointerUp);
            };

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove, { passive: false });
            window.addEventListener("mouseup", handlePointerUp);
            window.addEventListener("touchend", handlePointerUp);

            if ("touches" in interactionEvent) {
                const initialTouch = interactionEvent.touches[0];
                if (initialTouch) {
                    calculateAndEmitPosition(initialTouch.clientX, initialTouch.clientY);
                }
            } else {
                const initialMouseEvent = interactionEvent as MouseEvent;
                calculateAndEmitPosition(initialMouseEvent.clientX, initialMouseEvent.clientY);
            }
        },
        [elementRef]
    );
};
