import { useEffect, useRef, MouseEvent, TouchEvent } from "react";

enum GestureState {
    started = "started",
    moved = "moved",
    ended = "ended"
}

interface ISlideArguments {
    onSlideLeft?: () => void;
    onSlideRight?: () => void;
    onSlideUp?: () => void;
    onSlideDown?: () => void;
}

const threshold = 40;

const getEventPositions = (event: UIEvent) => {
    const touchEvent = (event as unknown as TouchEvent).targetTouches;
    if (touchEvent) {
        const { pageX, pageY } = touchEvent?.[0] ?? {};
        return { x: pageX, y: pageY };
    }
    const mouseEvent = event as unknown as MouseEvent;
    return { x: mouseEvent.pageX, y: mouseEvent.pageY };
};

const useSwipe = <T extends HTMLElement>({ onSlideLeft, onSlideRight, onSlideUp, onSlideDown }: ISlideArguments) => {
    const ref = useRef<T>(null);
    const gestureState = useRef<GestureState>(GestureState.ended);
    const touchStartPosition = useRef<{ x?: number; y?: number }>({});

    useEffect(() => {
        const onTouchStart = (event: UIEvent) => {
            event.preventDefault();
            gestureState.current = GestureState.started;
            touchStartPosition.current = getEventPositions(event);
        };

        const onTouchEnd = (event: UIEvent) => {
            event.preventDefault();
            if (gestureState.current === GestureState.started) {
                gestureState.current = GestureState.ended;
                const { x, y } = getEventPositions(event);

                if (touchStartPosition.current.x === undefined || touchStartPosition.current.y === undefined) {
                    return;
                }

                if (x - touchStartPosition.current.x < -threshold) {
                    onSlideRight?.();
                    return;
                }

                if (x - touchStartPosition.current.x > threshold) {
                    onSlideLeft?.();
                    return;
                }

                if (y - touchStartPosition.current.y < -threshold) {
                    onSlideDown?.();
                    return;
                }

                if (y - touchStartPosition.current.y > threshold) {
                    onSlideUp?.();
                    return;
                }

                gestureState.current = GestureState.started;
            }
        };

        const onTouchLeave = () => {
            gestureState.current = GestureState.ended;
        };

        if (ref.current) {
            ref.current.addEventListener("mousedown", onTouchStart);
            ref.current.addEventListener("mouseup", onTouchEnd);
            ref.current.addEventListener("mouseleave", onTouchLeave);
            ref.current.addEventListener("touchstart", onTouchStart);
            ref.current.addEventListener("touchmove", onTouchEnd);
            ref.current.addEventListener("touchcancel", onTouchLeave);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mousedown", onTouchStart);
                ref.current.removeEventListener("mouseup", onTouchEnd);
                ref.current.removeEventListener("mouseleave", onTouchLeave);
                ref.current.removeEventListener("touchstart", onTouchStart);
                ref.current.removeEventListener("touchmove", onTouchEnd);
                ref.current.removeEventListener("touchcancel", onTouchLeave);
            }
        };
    }, [ref.current, onSlideLeft, onSlideRight, onSlideUp, onSlideDown]);

    return ref;
};

export default useSwipe;
