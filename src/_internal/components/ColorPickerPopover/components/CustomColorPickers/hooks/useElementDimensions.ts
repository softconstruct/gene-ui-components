import { RefObject, useEffect, useState } from "react";

/**
 * A highly optimized hook that tracks the physical dimensions of a DOM element.
 * @param elementRef - A React ref attached to the target HTML element.
 * @returns An object containing the `width` and `height` of the element in pixels.
 */
export const useElementDimensions = (elementRef: RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const targetElement = elementRef.current;

        let cleanup = () => {};

        if (targetElement) {
            const updateDimensions = () => {
                const boundingClientRect = targetElement.getBoundingClientRect();
                setDimensions({
                    width: Math.round(boundingClientRect.width),
                    height: Math.round(boundingClientRect.height)
                });
            };

            updateDimensions();

            if (typeof ResizeObserver !== "undefined") {
                const resizeObserver = new ResizeObserver(updateDimensions);
                resizeObserver.observe(targetElement);

                cleanup = () => resizeObserver.disconnect();
            } else {
                window.addEventListener("resize", updateDimensions);

                cleanup = () => window.removeEventListener("resize", updateDimensions);
            }
        }

        return cleanup;
    }, [elementRef]);

    return dimensions;
};
