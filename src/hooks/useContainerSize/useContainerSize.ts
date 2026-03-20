import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import useDebounceCallback from "@hooks/useDebounceCallback";

interface IUseContainerSizeProps {
    /**
     * Whether to observe resize changes
     * @default true
     */
    observeResize?: boolean;
    /**
     * Optional debounce delay (ms) for resize updates.
     * If 0 or undefined, updates are applied immediately (no debounce).
     * @default 0
     */
    debounceWait?: number;
}

export interface IContainerSize {
    width: number;
    height: number;
}

/**
 * Hook to measure container dimensions and observe resize changes
 *
 * @param observeResize - Whether to observe resize changes
 * @param debounceWait - Optional debounce delay (ms) for resize updates
 * @returns Object containing containerRef and size measurements
 *
 * @example
 * ```tsx
 * const { containerRef, sizes } = useContainerSize();
 *
 * return (
 *   <div ref={containerRef}>
 *     Container width: {sizes.width}px
 *   </div>
 * );
 * ```
 */
const useContainerSize = <T extends HTMLElement = HTMLElement>({
    observeResize = true,
    debounceWait = 0
}: IUseContainerSizeProps = {}): {
    containerRef: RefObject<T>;
    sizes: IContainerSize;
} => {
    const containerRef = useRef<T>(null);
    const [sizes, setSizes] = useState<IContainerSize>({ width: 0, height: 0 });

    const updateSize = useCallback(() => {
        if (!containerRef.current) return;

        const { offsetWidth, offsetHeight } = containerRef.current;
        setSizes({ width: offsetWidth, height: offsetHeight });
    }, []);

    const { debouncedCallback, clearDebounce } = useDebounceCallback(updateSize, debounceWait);

    useEffect(() => {
        // Initial measurement without debounce to avoid visible layout jump
        updateSize();

        if (!observeResize || !containerRef.current) return () => {};

        const resizeObserver = new ResizeObserver(() => {
            if (debounceWait > 0) {
                debouncedCallback();
            } else {
                updateSize();
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (debounceWait > 0) {
                clearDebounce();
            }
        };
    }, [observeResize, debounceWait, updateSize, debouncedCallback, clearDebounce]);

    return {
        containerRef,
        sizes
    };
};

export default useContainerSize;
