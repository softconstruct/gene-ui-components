import { MouseEvent, TouchEvent, useEffect, useRef } from "react";

interface ISlideArguments {
    onSlideLeft?: () => void;
    onSlideRight?: () => void;
    onSlideUp?: () => void;
    onSlideDown?: () => void;
}

const threshold = 40;

const getEventPositions = (event: Event) => {
    if ("touches" in event) {
        const touchEvent = event as unknown as TouchEvent;
        const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
        return { x: touch?.pageX, y: touch?.pageY };
    }
    const mouseEvent = event as unknown as MouseEvent;
    return { x: mouseEvent.pageX, y: mouseEvent.pageY };
};

export const useSwipe = <T extends HTMLElement>({
    onSlideLeft,
    onSlideRight,
    onSlideUp,
    onSlideDown
}: ISlideArguments) => {
    const ref = useRef<T>(null);
    const touchStartPosition = useRef<{ x?: number; y?: number }>({});

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        const onStart = (event: Event) => {
            if ("touches" in event) {
                event.preventDefault();
            }
            touchStartPosition.current = getEventPositions(event);
        };

        const onEnd = (event: Event) => {
            const { x, y } = getEventPositions(event);

            const startX = touchStartPosition.current.x;
            const startY = touchStartPosition.current.y;

            if (startX === undefined || startY === undefined) {
                return;
            }

            const deltaX = x - startX;
            const deltaY = y - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX < 0) {
                    onSlideRight?.();
                } else {
                    onSlideLeft?.();
                }
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
                if (deltaY < 0) {
                    onSlideDown?.();
                } else {
                    onSlideUp?.();
                }
            }

            touchStartPosition.current = {};
        };

        const onCancel = () => {
            touchStartPosition.current = {};
        };

        element.addEventListener("mousedown", onStart);
        element.addEventListener("mouseup", onEnd);
        element.addEventListener("mouseleave", onEnd);
        element.addEventListener("touchstart", onStart);
        element.addEventListener("touchend", onEnd);
        element.addEventListener("touchcancel", onCancel);

        return () => {
            element.removeEventListener("mousedown", onStart);
            element.removeEventListener("mouseup", onEnd);
            element.removeEventListener("mouseleave", onEnd);
            element.removeEventListener("touchstart", onStart);
            element.removeEventListener("touchend", onEnd);
            element.removeEventListener("touchcancel", onCancel);
        };
    }, [onSlideLeft, onSlideRight, onSlideUp, onSlideDown]);

    return ref;
};

export default useSwipe;
